// src/hooks/useNotificationPolling.ts
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pollNewPosts, postToNotification } from "../api/notificationService";
import { useNotificationStore } from "../stores/notificationStore";
import { useToast } from "./useToast";

const POLL_INTERVAL_MS = 15000; // 15s — frequent enough to demo, not spammy

// Tracks document.visibilitychange so polling can pause/resume.
function useIsTabVisible() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    function handleChange() {
      setIsVisible(!document.hidden);
    }
    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);

  return isVisible;
}

// Call once near the app root (e.g. in AppLayout) so polling runs
// for the whole authenticated session, regardless of which page is open.
export function useNotificationPolling(isPanelOpen: boolean) {
  const isTabVisible = useIsTabVisible();
  const { hasSeenPollId, registerSeenPollId, addNotification } =
    useNotificationStore();
  const toast = useToast();

  const { data } = useQuery({
    queryKey: ["notification-poll"],
    queryFn: pollNewPosts,
    refetchInterval: isTabVisible ? POLL_INTERVAL_MS : false, // pause when hidden
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!data) return;

    data.forEach((post) => {
      if (hasSeenPollId(post.id)) return;

      registerSeenPollId(post.id);
      const notification = postToNotification(post);
      addNotification(notification);

      // Only toast if the panel is closed — otherwise the panel itself
      // is already showing the new item, a toast would be redundant.
      if (!isPanelOpen) {
        toast.info(`New notification: ${notification.message.slice(0, 40)}...`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
