// src/api/authService.ts
import { authClient } from "./clients";
import type { LoginCredentials, AuthUser } from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  const { data } = await authClient.post<AuthUser>("/auth/login", {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30, // short expiry so we can realistically test silent refresh
  });
  return data;
}

export async function refreshTokenRequest(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const { data } = await authClient.post("/auth/refresh", {
    refreshToken,
    expiresInMins: 30,
  });
  return data;
}
