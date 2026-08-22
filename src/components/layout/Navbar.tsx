// src/components/layout/Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/useAuth";
import Button from "../ui/Button";
import NotificationBell from "../notifications/NotificationBell";
import NotificationPanel from "../notifications/NotificationPanel";
import { useNotificationData } from "../../hooks/useNotificationData";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";
import { useThemeStore } from "../../stores/themeStore";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-100"
  }`;

// Same styling, but full-width block for the stacked mobile menu.
const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

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

          {/* Desktop nav links — hidden below md */}
          <div className="hidden md:flex gap-1">
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

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <NotificationBell onClick={() => setIsPanelOpen(true)} />

          {/* User info + Logout — hidden below md, moved into mobile menu instead */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
          <div className="hidden md:block">
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Hamburger — visible only below md */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1"
        >
          <NavLink
            to="/dashboard"
            className={mobileNavLinkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/board"
            className={mobileNavLinkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Board
          </NavLink>
          <NavLink
            to="/analytics"
            className={mobileNavLinkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Analytics
          </NavLink>

          <hr className="my-2 border-gray-200" />

          {user && (
            <div className="flex items-center gap-2 px-3 py-2">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}

          <Button variant="secondary" onClick={logout} className="w-full">
            Logout
          </Button>
        </div>
      )}

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </header>
  );
}
