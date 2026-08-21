// src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { refreshTokenRequest } from "./api/authService";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Board from "./pages/Board";
import ToastContainer from "./components/ui/ToastContainer";
import Analytics from "./pages/Analytics";

export default function App() {
  const {
    refreshToken,
    setAccessToken,
    setInitializing,
    clearAuth,
    isInitializing,
  } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      if (!refreshToken) {
        setInitializing(false);
        return;
      }
      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshTokenRequest(refreshToken);
        setAccessToken(accessToken);
        useAuthStore.setState({ refreshToken: newRefreshToken });
      } catch {
        clearAuth();
      } finally {
        setInitializing(false);
      }
    }
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-gray-500">Loading SprintDesk...</span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<div>Dashboard (coming Step 9+)</div>}
            />
            {/* <Route path="/board" element={<div>Board (coming later)</div>} /> */}
            <Route path="/board" element={<Board />} />
            {/* <Route
              path="/analytics"
              element={<div>Analytics (coming later)</div>}
            /> */}
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

// username: emilys;
// password: emilyspass;
