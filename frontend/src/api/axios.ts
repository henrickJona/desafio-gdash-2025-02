import axios from "axios";
// 💡 Importar a store diretamente para que possamos acessar o estado fora do React.
import { useAuthStore } from "./../stores/auth.store"; // Ajuste o caminho conforme necessário

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
  // ✅ Usar useAuthStore.getState() para acessar o estado síncrono,
  // incluindo o token que está no memory state (e é persistido pelo middleware).
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// O interceptor de resposta (opcional, mas recomendado para logout automático)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a resposta for 401 Unauthorized e o usuário estiver autenticado,
    // significa que o token expirou ou é inválido.
    if (error.response?.status === 401) {
      const { authenticated, logout } = useAuthStore.getState();
      if (authenticated) {
        // Loga o usuário para limpar o token
        logout();
        // Opcionalmente, notificar o usuário
        // toast.error("Sua sessão expirou. Faça login novamente.");
      }
    }
    return Promise.reject(error);
  }
);
