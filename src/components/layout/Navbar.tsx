// src/components/layout/Navbar.tsx
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { useState } from "react";
import NotificationBell from "../notifications/NotificationBell";
import NotificationPanel from "../notifications/NotificationPanel";
import { useNotificationData } from "../../hooks/useNotificationData";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useNotificationData();
  useNotificationPolling(isPanelOpen);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-gray-900">
            SprintDesk
          </span>
          <div className="flex gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/board" className={navLinkClass}>
              Board
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell onClick={() => setIsPanelOpen(true)} />
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-700 hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </header>
  );
}
