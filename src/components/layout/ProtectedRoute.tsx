// src/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 transition-colors dark:bg-dark-bg dark:text-dark-text"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-gray-500 dark:text-dark-muted">
          Loading session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
