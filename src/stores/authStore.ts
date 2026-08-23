import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, AuthUser } from "../types/auth";

interface AuthStore extends AuthState {
  refreshToken: string | null;
  isInitializing: boolean;
  hasHydrated: boolean;
  setAuth: (data: AuthUser) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,
      hasHydrated: false,

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
      setHasHydrated: (value) => set({ hasHydrated: value }), 

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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
