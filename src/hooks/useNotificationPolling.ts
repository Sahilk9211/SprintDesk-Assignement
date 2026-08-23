import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pollNewPosts, postToNotification } from "../api/notificationService";
import { useNotificationStore } from "../stores/notificationStore";
import { useToast } from "./useToast";

const POLL_INTERVAL_MS = 15000;

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
export function useNotificationPolling(isPanelOpen: boolean) {
  const isTabVisible = useIsTabVisible();
  const { hasSeenPollId, registerSeenPollId, addNotification } =
    useNotificationStore();
  const toast = useToast();

  const { data } = useQuery({
    queryKey: ["notification-poll"],
    queryFn: pollNewPosts,
    refetchInterval: isTabVisible ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!data) return;

    data.forEach((post) => {
      if (hasSeenPollId(post.id)) return;

      registerSeenPollId(post.id);
      const notification = postToNotification(post);
      addNotification(notification);

      if (!isPanelOpen) {
        toast.info(`New notification: ${notification.message.slice(0, 40)}...`);
      }
    });
  }, [data]);
}
