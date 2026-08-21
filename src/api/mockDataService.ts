// src/api/mockDataService.ts
import { mockClient } from "./clients";
import type {
  MockData,
  User,
  Sprint,
  Task,
  Comment,
  AppNotification,
} from "../types";

let cachedData: MockData | null = null;

// Simulates a real backend by fetching once and caching in memory.
// UI never touches this file directly — only via hooks in src/hooks/.
async function fetchMockData(): Promise<MockData> {
  if (cachedData) return cachedData;
  const { data } = await mockClient.get<MockData>("/mock-data.json");
  cachedData = data;
  return data;
}

export async function getUsers(): Promise<User[]> {
  const data = await fetchMockData();
  return data.users;
}

export async function getSprints(): Promise<Sprint[]> {
  const data = await fetchMockData();
  return data.sprints;
}

export async function getTasks(): Promise<Task[]> {
  const data = await fetchMockData();
  // "Fetch the first 30 tasks" — mock data currently has exactly 30,
  // but slice defensively in case it grows.
  return data.tasks.slice(0, 30);
}

export async function getComments(taskId: number): Promise<Comment[]> {
  const data = await fetchMockData();
  return data.comments.filter((c) => c.taskId === taskId);
}

export async function getInitialNotifications(): Promise<AppNotification[]> {
  const data = await fetchMockData();
  return data.notifications;
}
