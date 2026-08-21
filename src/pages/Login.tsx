// src/pages/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate({ username, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 space-y-5"
      >
        <h1 className="text-2xl font-semibold text-gray-900">SprintDesk</h1>
        <p className="text-sm text-gray-500">Sign in to manage your sprints</p>

        <Input
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            Invalid username or password.
          </p>
        )}

        <Button type="submit" isLoading={isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
