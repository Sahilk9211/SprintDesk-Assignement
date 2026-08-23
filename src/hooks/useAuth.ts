import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authService";
import { useAuthStore } from "../stores/authStore";
import type { LoginCredentials } from "../types/auth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return () => {
    clearAuth();
    navigate("/login", { replace: true });
  };
}
