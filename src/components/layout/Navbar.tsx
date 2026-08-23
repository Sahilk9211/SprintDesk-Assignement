import { useEffect, useState } from "react";
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
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
      : "text-gray-600 hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-hover"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
      : "text-gray-700 hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-hover"
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

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-dark-border dark:bg-dark-surface">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">
              SprintDesk
            </span>

            <div className="hidden gap-1 md:flex">
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
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
              className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-dark-muted dark:hover:bg-dark-hover dark:hover:text-dark-text
              "
            >
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              )}
            </button>

            <NotificationBell onClick={() => setIsPanelOpen(true)} />
            {user && (
              <div className="hidden items-center gap-2 md:flex">
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-8 w-8 rounded-full"
                />

                <span className="text-sm text-gray-700 dark:text-dark-muted">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}

            <div className="hidden md:block">
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
              className=" rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-dark-muted dark:hover:bg-dark-hover dark:hover:text-dark-text  md:hidden
              "
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            onClick={closeMobileMenu}
          />

          <aside
            id="mobile-drawer"
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl animate-slide-in-right dark:bg-dark-surface dark:shadow-dark-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div
              className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-dark-border
              "
            >
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-dark-text">
                  SprintDesk
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none  focus:ring-2 focus:ring-indigo-500 dark:text-dark-muted dark:hover:bg-dark-hover dark:hover:text-dark-text"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                <NavLink
                  to="/dashboard"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/board"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Board
                </NavLink>

                <NavLink
                  to="/analytics"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Analytics
                </NavLink>
              </div>

              <hr className="my-4 border-gray-200 dark:border-dark-border" />

              {/* User */}
              {user && (
                <div
                  className="
                    flex items-center gap-3
                    rounded-lg
                    bg-gray-50
                    px-3 py-3
                    dark:bg-dark-elevated
                  "
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-9 w-9 rounded-full"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-dark-text">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-dark-subtle">
                      Signed in
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="
                border-t border-gray-200
                p-4
                dark:border-dark-border
              "
            >
              <Button variant="secondary" onClick={logout} className="w-full">
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
}
