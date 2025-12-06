import { useState } from "react";
import { api } from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";
import { z } from "zod";
import { FormEvent } from "react"; // 👈 Importe FormEvent

const loginSchema = z.object({
  email: z.email("Formato de e-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // ✅ Pega a função login do Zustand
  const login = useAuthStore((s) => s.login);

  const getErrorMessage = (field: keyof LoginFormValues) => {
    const error = errors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  };

  // 1. Modificar a função para aceitar o evento de formulário
  async function submit(event: FormEvent) {
    // 2. Prevenir o comportamento padrão de recarregar a página
    event.preventDefault();

    setIsLoading(true);
    setErrors([]);

    try {
      const validation = loginSchema.safeParse({ email, password });

      if (!validation.success) {
        setErrors(validation.error.issues);
        setIsLoading(false);
        return;
      }

      const r = await api.post("/users/login", { email, password });
      const { access_token, user } = r.data;

      if (access_token && user) {
        login(access_token, user); // ✅ usa Zustand store
        toast.success("Login realizado!");
      } else {
        throw new Error("Resposta da API incompleta.");
      }
    } catch (e: any) {
      console.error("Erro de Login:", e);
      toast.error(
        e.response?.data?.message || "Credenciais inválidas ou erro de rede."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {/* 3. Envolver o conteúdo em um formulário e usar onSubmit */}
      <form onSubmit={submit} className="p-6 border rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>

        <div className="space-y-3">
          {/* Email */}
          <div className="space-y-1">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={getErrorMessage("email") ? "border-red-500" : ""}
            />
            {getErrorMessage("email") && (
              <p className="text-xs text-red-500">{getErrorMessage("email")}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              className={getErrorMessage("password") ? "border-red-500" : ""}
            />
            {getErrorMessage("password") && (
              <p className="text-xs text-red-500">
                {getErrorMessage("password")}
              </p>
            )}
          </div>
        </div>

        {/* 4. O botão de envio não precisa mais de onClick, ele aciona o form.onSubmit por padrão */}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
