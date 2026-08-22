// src/components/ui/Modal.tsx
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  position?: "center" | "right";
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  position = "center",
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleEscape);
      requestAnimationFrame(() => panelRef.current?.focus());
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelPositionClass =
    position === "right"
      ? "ml-auto h-full w-full max-w-md animate-slide-in-right"
      : "w-full max-w-lg rounded-lg max-h-[85vh]";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${
        position === "center" ? "p-4" : ""
      }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`flex flex-col bg-white shadow-xl outline-none ${panelPositionClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2
            id="modal-title"
            className="text-base font-semibold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
