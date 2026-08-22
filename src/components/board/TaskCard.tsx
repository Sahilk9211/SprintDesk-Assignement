// src/components/board/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, User } from "../../types";
import Badge from "../ui/Badge";
import { priorityColor } from "../../utils/taskDisplay";
import { memo } from "react";

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
  onClick: () => void;
  isOverlay?: boolean;
}

function TaskCard({
  task,
  assignee,
  onClick,
  isOverlay = false,
}: TaskCardProps) {
  const sortable = useSortable({ id: task.id, disabled: isOverlay });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      onClick={isOverlay ? undefined : onClick}
      role={isOverlay ? undefined : "button"}
      tabIndex={isOverlay ? undefined : 0}
      aria-label={isOverlay ? undefined : `Task: ${task.title}`}
      onKeyDown={
        isOverlay
          ? undefined
          : (e) => {
              if (e.key === "Enter") onClick();
            }
      }
      className="cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 active:cursor-grabbing dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-sm dark:hover:shadow-dark-md dark:focus:ring-indigo-400"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
        {task.title}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>

        <span className="text-xs text-gray-500 dark:text-dark-subtle">
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
            loading="lazy"
            className="h-5 w-5 rounded-full"
          />

          <span className="text-xs text-gray-600 dark:text-dark-muted">
            {assignee.name}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(TaskCard);
