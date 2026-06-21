import { create } from "zustand";
import type { User } from "@/types";
import { tokenStore } from "@/api/tokens";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!tokenStore.getAccess(),
  setAuth: (user, access, refresh) => {
    tokenStore.set(access, refresh);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    tokenStore.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
