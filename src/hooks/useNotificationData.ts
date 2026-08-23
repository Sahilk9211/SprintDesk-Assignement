import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInitialNotifications } from "../api/mockDataService";
import { useNotificationStore } from "../stores/notificationStore";

export function useNotificationData() {
  const { data } = useQuery({
    queryKey: ["initial-notifications"],
    queryFn: getInitialNotifications,
  });
  const hydrate = useNotificationStore((s) => s.hydrate);

  useEffect(() => {
    if (data) hydrate(data);
  }, [data, hydrate]);
}
