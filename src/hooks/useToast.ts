// src/hooks/useToast.ts
import { useCallback } from "react";
import { useToastStore } from "../stores/toastStore";
import type { ToastType } from "../stores/toastStore";

const AUTO_DISMISS_MS = 4000;

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  const removeToast = useToastStore((s) => s.removeToast);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = addToast(message, type);
      setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
      return id;
    },
    [addToast, removeToast],
  );

  return {
    success: (message: string) => show(message, "success"),
    error: (message: string) => show(message, "error"),
    info: (message: string) => show(message, "info"),
  };
}
