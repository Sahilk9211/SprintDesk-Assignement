// src/components/board/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, User } from "../../types";
import Badge from "../ui/Badge";
import { priorityColor } from "../../utils/taskDisplay";

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
  onClick: () => void;
}

export default function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className="cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-gray-900">{task.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
        <span className="text-xs text-gray-500">
          {new Date(task.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      {assignee && (
        <div className="mt-2 flex items-center gap-1.5">
          <img
            src={assignee.avatar}
            alt={assignee.name}
            className="h-5 w-5 rounded-full"
          />
          <span className="text-xs text-gray-600">{assignee.name}</span>
        </div>
      )}
    </div>
  );
}
