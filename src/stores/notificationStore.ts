// src/stores/notificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification } from "../types";

interface NotificationStore {
  notifications: AppNotification[];
  seenPollIds: number[]; // JSONPlaceholder post IDs already turned into notifications
  isHydrated: boolean;
  hydrate: (initial: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  hasSeenPollId: (postId: number) => boolean;
  registerSeenPollId: (postId: number) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      seenPollIds: [],
      isHydrated: false,

      hydrate: (initial) => {
        if (get().isHydrated) return;
        set({ notifications: initial, isHydrated: true });
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      hasSeenPollId: (postId) => get().seenPollIds.includes(postId),

      registerSeenPollId: (postId) =>
        set((state) => ({ seenPollIds: [...state.seenPollIds, postId] })),
    }),
    { name: "sprintdesk-notifications" },
  ),
);
