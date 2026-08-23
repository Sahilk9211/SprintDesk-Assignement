import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useNotificationStore } from "../../stores/notificationStore";

const PAGE_SIZE = 20;

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
}: NotificationPanelProps) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const [page, setPage] = useState(1);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      position="right"
    >
      <div className="space-y-3">
        {notifications.some((n) => !n.read) && (
          <Button variant="secondary" onClick={markAllRead} className="w-full">
            Mark all as read
          </Button>
        )}

        {pageItems.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-dark-muted">
            No notifications yet
          </p>
        ) : (
          <ul className="space-y-2">
            {pageItems.map((n) => (
              <li
                key={n.id}
                onClick={() => markRead(n.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && markRead(n.id)}
                className={`cursor-pointer rounded-md border p-3 text-sm transition-colors ${
                  n.read
                    ? "border-gray-200 bg-white hover:bg-gray-50 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-hover"
                    : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40"
                }`}
              >
                <p className="font-medium text-gray-800 dark:text-dark-text">
                  {n.title}
                </p>

                <p className="text-gray-600 dark:text-dark-muted">
                  {n.message}
                </p>

                <p className="mt-1 text-xs text-gray-400 dark:text-dark-subtle">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-gray-500 dark:text-dark-muted">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
