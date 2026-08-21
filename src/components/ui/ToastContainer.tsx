// src/components/ui/ToastContainer.tsx
import { createPortal } from "react-dom";
import { useToastStore } from "../../stores/toastStore";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}
