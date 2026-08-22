// src/utils/analytics.ts
import type { Task, Sprint, TaskPriority } from "../types";
import { statusOrder, statusLabel } from "./taskDisplay";

export interface VelocityDatum {
  sprint: string;
  completed: number;
}

export function getSprintVelocity(
  tasks: Task[],
  sprints: Sprint[],
): VelocityDatum[] {
  return sprints.map((sprint) => ({
    sprint: sprint.name,
    completed: tasks.filter(
      (t) => t.sprintId === sprint.id && t.status === "done",
    ).length,
  }));
}

export interface StatusDatum {
  status: string;
  count: number;
}

export function getStatusDistribution(tasks: Task[]): StatusDatum[] {
  return statusOrder.map((status) => ({
    status: statusLabel[status],
    count: tasks.filter((t) => t.status === status).length,
  }));
}

export interface PriorityBreakdownDatum {
  status: string;
  low: number;
  medium: number;
  high: number;
}

export function getPriorityBreakdown(tasks: Task[]): PriorityBreakdownDatum[] {
  return statusOrder.map((status) => {
    const tasksInStatus = tasks.filter((t) => t.status === status);
    const countByPriority = (p: TaskPriority) =>
      tasksInStatus.filter((t) => t.priority === p).length;

    return {
      status: statusLabel[status],
      low: countByPriority("low"),
      medium: countByPriority("medium"),
      high: countByPriority("high"),
    };
  });
}

export interface TrendDatum {
  date: string;
  completed: number;
}

export function getCompletionTrend(tasks: Task[]): TrendDatum[] {
  const completedTasks = tasks.filter((t) => t.completedAt);

  const countByDate = new Map<string, number>();
  completedTasks.forEach((t) => {
    const date = new Date(t.completedAt as string).toISOString().slice(0, 10); // YYYY-MM-DD
    countByDate.set(date, (countByDate.get(date) ?? 0) + 1);
  });

  return Array.from(countByDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, completed]) => ({ date, completed }));
}
