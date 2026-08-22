// src/pages/Dashboard.tsx
import { useBoardStore } from "../stores/boardStore";
import { statusOrder, statusLabel } from "../utils/taskDisplay";

export default function Dashboard() {
  const tasks = useBoardStore((s) => s.tasks);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statusOrder.map((status) => (
          <div
            key={status}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{statusLabel[status]}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {tasks.filter((t) => t.status === status).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
