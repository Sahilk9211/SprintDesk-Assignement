// src/components/ui/Toast.tsx
import type { ToastItem } from "../../stores/toastStore";
import { useToastStore } from "../../stores/toastStore";

const typeClasses: Record<ToastItem["type"], string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-800",
};

export default function Toast({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 rounded-md px-4 py-2.5 text-sm text-white shadow-lg ${typeClasses[toast.type]}`}
    >
      <span>{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
