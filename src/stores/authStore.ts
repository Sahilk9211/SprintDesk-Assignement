// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, AuthUser } from "../types/auth";

interface AuthStore extends AuthState {
  refreshToken: string | null;
  isInitializing: boolean;
  hasHydrated: boolean; // NEW — true once Zustand finishes reading localStorage
  setAuth: (data: AuthUser) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void; // NEW
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,
      hasHydrated: false, // NEW

      setAuth: (data) =>
        set({
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        }),

      setAccessToken: (token) => set({ accessToken: token }),
      setInitializing: (value) => set({ isInitializing: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }), // NEW

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "sprintdesk-auth",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      // NEW — fires the moment Zustand finishes applying localStorage data
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
