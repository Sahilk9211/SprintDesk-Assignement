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

export function postToNotification(post: JsonPlaceholderPost): AppNotification {
  return {
    id: post.id + 1000,
    title: "New activity",
    message: post.title,
    type: "task",
    read: false,
    createdAt: new Date().toISOString(),
  };
}
