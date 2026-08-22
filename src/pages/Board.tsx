// src/pages/Board.tsx
import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "../components/board/Column";
import TaskCard from "../components/board/TaskCard";
import { useBoardData } from "../hooks/useBoardData";
import { useUsersQuery } from "../hooks/useTasksQuery";
import { useBoardStore } from "../stores/boardStore";
import { statusOrder } from "../utils/taskDisplay";
import type { Task, TaskStatus } from "../types";

import TaskDrawer from "../components/board/TaskDrawer";
import CreateTaskModal from "../components/board/CreateTaskModal";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

export default function Board() {
  const { tasks, isLoading } = useBoardData();
  const { data: users = [] } = useUsersQuery();
  const moveTask = useBoardStore((s) => s.moveTask);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Dropped over a column (empty area) vs over another task card.
    const overIsColumn = statusOrder.includes(over.id as TaskStatus);
    const newStatus = overIsColumn
      ? (over.id as TaskStatus)
      : tasks.find((t) => t.id === over.id)?.status;

    if (!newStatus) return;

    const tasksInTargetColumn = tasks.filter(
      (t) => t.status === newStatus && t.id !== active.id,
    );
    const newOrder = tasksInTargetColumn.length + 1;

    moveTask(active.id as number, newStatus, newOrder);
  }

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    statusOrder.forEach((status) => {
      map.set(
        status,
        tasks
          .filter((t) => t.status === status)
          .sort((a, b) => a.order - b.order),
      );
    });
    return map;
  }, [tasks]);

  //   if (isLoading) {
  //     return <p className="text-sm text-gray-500">Loading board...</p>;
  //   }

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-72 space-y-2">
            <Skeleton variant="rect" height="40px" />
            <Skeleton variant="rect" height="80px" />
            <Skeleton variant="rect" height="80px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Sprint Board</h1>
        <Button onClick={() => setIsCreateOpen(true)}>+ New Task</Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* {statusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks
                .filter((t) => t.status === status)
                .sort((a, b) => a.order - b.order)}
              users={users}
              // onTaskClick={(task) => setSelectedTask(task)} // Step 11 me drawer banayenge
              onTaskClick={handleTaskClick} // Step 11 me drawer banayenge
            />
          ))} */}
          {statusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasksByStatus.get(status) ?? []}
              users={users}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              assignee={users.find((u) => u.id === activeTask.assigneeId)}
              onClick={() => {}}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>
      <TaskDrawer
        task={
          selectedTask
            ? (tasks.find((t) => t.id === selectedTask.id) ?? null)
            : null
        }
        users={users}
        onClose={() => setSelectedTask(null)}
      />
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        users={users}
      />
    </div>
  );
}
