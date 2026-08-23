export interface LoginCredentials {
  username: string;
  password: string;
}

// Response shape from POST https://dummyjson.com/auth/login
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: Omit<AuthUser, "accessToken" | "refreshToken"> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
