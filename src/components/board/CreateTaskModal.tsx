// src/components/board/CreateTaskModal.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { User, TaskPriority } from "../../types";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useBoardStore } from "../../stores/boardStore";
import { useToast } from "../../hooks/useToast";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  users,
}: CreateTaskModalProps) {
  const toast = useToast();
  const tasks = useBoardStore((s) => s.tasks);
  const addTaskAction = useBoardStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState(users[0]?.id ?? 0);
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");

  function resetForm() {
    setTitle("");
    setPriority("medium");
    setAssigneeId(users[0]?.id ?? 0);
    setDueDate("");
    setTitleError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    if (!dueDate) {
      return;
    }

    const nextId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
    const now = new Date().toISOString();

    addTaskAction({
      id: nextId,
      title: title.trim(),
      description: "",
      status: "backlog",
      priority,
      assigneeId,
      dueDate,
      sprintId: 3,
      order: tasks.filter((t) => t.status === "backlog").length + 1,
      createdAt: now,
      completedAt: null,
      updatedAt: now,
    });

    toast.success("Task created");
    resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Task"
      position="center"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="new-task-title"
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);

            if (titleError) {
              setTitleError("");
            }
          }}
          error={titleError}
          required
        />

        <Select
          id="new-task-priority"
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />

        <Select
          id="new-task-assignee"
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(Number(e.target.value))}
          options={users.map((u) => ({
            value: String(u.id),
            label: u.name,
          }))}
        />

        <Input
          id="new-task-due-date"
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 border-t border-transparent pt-2 dark:border-transparent">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
