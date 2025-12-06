import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  authenticated: boolean;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      authenticated: false,
      loading: true, // inicia carregando

      login: (token, user) => {
        set({
          token,
          user,
          authenticated: true,
          loading: false,
        });
        window.location.href = "/"; // redireciona após login
      },

      logout: () => {
        set({
          token: null,
          user: null,
          authenticated: false,
          loading: false,
        });
        window.location.href = "/login"; // redireciona após logout
      },
    }),
    {
      name: "auth-storage", // key do localStorage
      // ✅ callback quando Zustand termina de restaurar do localStorage
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);
