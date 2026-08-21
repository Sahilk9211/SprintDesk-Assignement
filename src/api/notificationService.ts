// src/api/notificationService.ts
import { notificationClient } from "./clients";
import type { JsonPlaceholderPost } from "../types/notification";
import type { AppNotification } from "../types";

export async function pollNewPosts(): Promise<JsonPlaceholderPost[]> {
  const { data } = await notificationClient.get<JsonPlaceholderPost[]>(
    "/posts",
    {
      params: { _limit: 5 },
    },
  );
  return data;
}

// Transforms a raw JSONPlaceholder post into our app's notification shape.
// Called by the polling hook when a post ID hasn't been seen before.
export function postToNotification(post: JsonPlaceholderPost): AppNotification {
  return {
    id: post.id + 1000, // offset to avoid clashing with mock notification ids (101-104)
    title: "New activity",
    message: post.title,
    type: "task",
    read: false,
    createdAt: new Date().toISOString(),
  };
}
