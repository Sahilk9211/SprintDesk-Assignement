import type { ToastItem } from "../../stores/toastStore";
import { useToastStore } from "../../stores/toastStore";

const typeClasses: Record<ToastItem["type"], string> = {
  success: `
    bg-green-600
    dark:bg-green-700
  `,
  error: `
    bg-red-600
    dark:bg-red-700
  `,

  info: `
    bg-gray-800
    dark:bg-dark-elevated
    dark:text-dark-text
  `,
};

export default function Toast({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 rounded-md px-4 py-2.5 text-sm text-white shadow-lg transition-colors ${typeClasses[toast.type]}`}
    >
      <span>{toast.message}</span>

      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="text-white/80 transition-colors hover:text-white 
        "
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
  );
}
