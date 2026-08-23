import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useBoardData } from "../../hooks/useBoardData";

export default function AppLayout() {
  useBoardData();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-dark-bg dark:text-dark-text">
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg dark:focus:bg-dark-elevated
          dark:focus:text-dark-text dark:focus:shadow-dark-lg
        "
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
