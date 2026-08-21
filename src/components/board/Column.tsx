// src/components/board/Column.tsx
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, User, TaskStatus } from "../../types";
import TaskCard from "./TaskCard";
import { statusLabel } from "../../utils/taskDisplay";

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
}

export default function Column({
  status,
  tasks,
  users,
  onTaskClick,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 flex-shrink-0 flex-col rounded-lg border ${
        isOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50"
      } p-3`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          {statusLabel[status]}
        </h2>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[40px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={users.find((u) => u.id === task.assigneeId)}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
