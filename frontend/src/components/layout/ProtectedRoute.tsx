import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authenticated = useAuthStore((s) => s.authenticated);
  const loading = useAuthStore((s) => s.loading);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        carregando...
      </div>
    );

  return authenticated ? (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
