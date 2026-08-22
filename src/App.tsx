// src/App.tsx
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { refreshTokenRequest } from "./api/authService";
import { useThemeSync } from "./hooks/useThemeSync";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import ToastContainer from "./components/ui/ToastContainer";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Board = lazy(() => import("./pages/Board"));
const Analytics = lazy(() => import("./pages/Analytics"));

function PageFallback() {
  return (
    <div
      className="flex items-center justify-center py-20"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm text-gray-500 dark:text-dark-muted">
        Loading...
      </span>
    </div>
  );
}

export default function App() {
  useThemeSync();
  const {
    refreshToken,
    setAccessToken,
    setInitializing,
    clearAuth,
    isInitializing,
    hasHydrated,
  } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    async function restoreSession() {
      if (!refreshToken) {
        setInitializing(false);
        return;
      }
      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshTokenRequest(refreshToken);
        setAccessToken(accessToken);
        useAuthStore.setState({
          refreshToken: newRefreshToken,
          isAuthenticated: true,
        });
      } catch {
        clearAuth();
      } finally {
        setInitializing(false);
      }
    }
    restoreSession();
  }, [hasHydrated]);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-gray-500 dark:text-dark-muted">
          Loading SprintDesk...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-dark-bg dark:text-dark-text">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/board"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Board />
                  </Suspense>
                }
              />
              <Route
                path="/analytics"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Analytics />
                  </Suspense>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

// username: emilys
// password: emilyspass
