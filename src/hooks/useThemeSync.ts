// src/hooks/useThemeSync.ts
import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

// Syncs the Zustand theme value onto the <html> element's class list,
// since Tailwind's `dark:` variants key off that class.
export function useThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
}
