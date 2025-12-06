import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  // Controla se o diálogo está visível
  open: boolean;
  // Função para fechar o diálogo
  onOpenChange: (open: boolean) => void;
  // Mensagem de confirmação principal
  message: string;
  // Título da caixa de diálogo
  title: string;
  // Função a ser executada na confirmação
  onConfirm: () => void;
  // Estado de loading do botão de confirmação
  isLoading: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  message,
  title,
  onConfirm,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-start">
          {/* Botão Cancelar */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          {/* Botão Confirmar */}
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
