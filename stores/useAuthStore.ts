import { create } from "zustand";

import { clearAuth, getStoredUser } from "@/lib/storage";

export type AuthUser = {
  accessToken?: string;
  tokenType?: string;
  userId: number;
  email: string;
  name: string;
  nickname: string;
};

type AuthState = {
  user: AuthUser | null;
  hydrate: () => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  hydrate: () => {
    set({
      user: getStoredUser() as AuthUser | null,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    clearAuth();
    set({ user: null });
  },
}));