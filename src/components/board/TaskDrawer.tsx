// src/components/board/TaskDrawer.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { Task, User } from "../../types";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { useBoardStore } from "../../stores/boardStore";
import { useCommentsQuery } from "../../hooks/useCommentsQuery";
import { useCommentsStore } from "../../stores/commentsStore";
import { useAuthStore } from "../../stores/authStore";
import { statusLabel, statusOrder } from "../../utils/taskDisplay";
import { useToast } from "../../hooks/useToast";

interface TaskDrawerProps {
  task: Task | null;
  users: User[];
  onClose: () => void;
}

export default function TaskDrawer({ task, users, onClose }: TaskDrawerProps) {
  const toast = useToast();
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const { data: serverComments = [] } = useCommentsQuery(task?.id ?? -1);
  const localComments = useCommentsStore((s) => s.localComments);
  const addComment = useCommentsStore((s) => s.addComment);
  const currentUser = useAuthStore((s) => s.user);

  const [newComment, setNewComment] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!task) return null;

  const allComments = [
    ...serverComments,
    ...localComments.filter((c) => c.taskId === task.id),
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !task) return;
    addComment({
      id: Date.now(),
      taskId: task.id,
      authorId: currentUser?.id ?? 0,
      message: newComment.trim(),
      createdAt: new Date().toISOString(),
    });
    setNewComment("");
  }

  function handleDeleteConfirmed() {
    if (!task) return;
    deleteTask(task.id);
    toast.success("Task deleted");
    onClose();
  }

  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      title="Task Details"
      position="right"
    >
      <div className="space-y-4">
        <Input
          id="task-title"
          label="Title"
          value={task.title}
          onChange={(e) => updateTask(task.id, { title: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>

        <Select
          id="task-status"
          label="Status"
          value={task.status}
          onChange={(e) =>
            updateTask(task.id, { status: e.target.value as Task["status"] })
          }
          options={statusOrder.map((s) => ({
            value: s,
            label: statusLabel[s],
          }))}
        />

        <Select
          id="task-priority"
          label="Priority"
          value={task.priority}
          onChange={(e) =>
            updateTask(task.id, {
              priority: e.target.value as Task["priority"],
            })
          }
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />

        <Select
          id="task-assignee"
          label="Assignee"
          value={task.assigneeId}
          onChange={(e) =>
            updateTask(task.id, { assigneeId: Number(e.target.value) })
          }
          options={users.map((u) => ({ value: String(u.id), label: u.name }))}
        />

        <Input
          id="task-due-date"
          label="Due Date"
          type="date"
          value={task.dueDate}
          onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
        />

        <hr className="border-gray-200" />

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Comments <Badge>{allComments.length}</Badge>
          </h3>
          <ul className="space-y-2 mb-3">
            {allComments.map((c) => {
              const author = users.find((u) => u.id === c.authorId);
              return (
                <li key={c.id} className="rounded-md bg-gray-50 p-2 text-sm">
                  <span className="font-medium text-gray-800">
                    {author?.name ?? "Unknown"}:{" "}
                  </span>
                  <span className="text-gray-600">{c.message}</span>
                </li>
              );
            })}
          </ul>
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Input
              id="new-comment"
              label="Add a comment"
              hideLabel
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              Post
            </Button>
          </form>
        </div>

        <hr className="border-gray-200" />

        {!confirmingDelete ? (
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete Task
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
            <span className="text-sm text-red-700">
              Delete this task permanently?
            </span>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
