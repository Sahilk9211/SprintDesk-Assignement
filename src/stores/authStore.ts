// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, AuthUser } from "../types/auth";

interface AuthStore extends AuthState {
  refreshToken: string | null;
  isInitializing: boolean; // true while validating session on app load
  setAuth: (data: AuthUser) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,

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

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setInitializing: (value) => set({ isInitializing: value }),
    }),
    {
      name: "sprintdesk-auth",
      // CRITICAL: only persist refreshToken + user.
      // accessToken must stay in-memory only (assignment requirement),
      // so it's deliberately excluded here — it's lost on refresh and
      // re-obtained via the refresh flow in Step 6.
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
