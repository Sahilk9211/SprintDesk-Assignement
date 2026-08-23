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
    <div
      className="
        flex min-h-screen items-center justify-center
        bg-gray-50 px-4
        dark:bg-dark-bg
      "
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-lg "
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text">
            SprintDesk
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-dark-subtle">
            Sign in to manage your sprints
          </p>
        </div>

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
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
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
