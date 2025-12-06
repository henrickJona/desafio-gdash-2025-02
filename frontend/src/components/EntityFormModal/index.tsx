import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z, ZodIssue } from "zod";
import { FormEvent } from "react"; // 👈 Importamos FormEvent

interface Field {
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
}

interface EntityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
  values: Record<string, any>;
  onChange: (field: string, value: string) => void;
  // A função onSubmit no componente pai não aceita o evento,
  // mas vamos envolver sua chamada com preventDefault() aqui
  onSubmit: () => void;
  validationErrors?: ZodIssue[];
  loading?: boolean;
}

export function EntityFormModal({
  open,
  onOpenChange,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  validationErrors = [],
  loading,
}: EntityFormModalProps) {
  const getErrorMessage = (field: string) => {
    const err = validationErrors.find((e) => e.path.includes(field));
    return err ? err.message : null;
  };

  // Handler que será chamado no onSubmit do formulário
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Impede o recarregamento padrão do formulário HTML
    onSubmit(); // Chama a função de envio do componente pai
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Preencha os dados abaixo.</DialogDescription>
        </DialogHeader>

        {/* CORREÇÃO: Usar a tag <form> com onSubmit */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {fields.map((field) => (
              <div className="space-y-1" key={field.name}>
                <label className="block text-sm font-medium">
                  {field.label}
                </label>
                <Input
                  type={field.type || "text"}
                  // Conversão para string necessária para evitar avisos de controle de input
                  value={
                    values[field.name] === undefined
                      ? ""
                      : String(values[field.name])
                  }
                  onChange={(e) => onChange(field.name, e.target.value)}
                  disabled={field.disabled || loading} // Desativa campos durante o loading
                  className={
                    getErrorMessage(field.name) ? "border-red-500" : ""
                  }
                />
                {getErrorMessage(field.name) && (
                  <p className="text-xs text-red-500">
                    {getErrorMessage(field.name)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* DialogFooter deve ser mantido fora do div.space-y-4 para o layout */}
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
