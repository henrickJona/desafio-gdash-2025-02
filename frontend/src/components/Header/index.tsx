import { User, LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
      <div className="text-xl font-bold">Weather Dashboard ☁️</div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span className="font-medium">{user?.email || "Usuário Logado"}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-1 p-2 rounded-lg hover:bg-blue-700 transition-colors"
          title="Sair da sessão"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
