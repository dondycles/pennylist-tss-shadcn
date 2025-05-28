import { queryOptions } from "@tanstack/react-query";
import { getAnalytics } from "../server/fn/analytics";

export const analyticsQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: ["analytics", userId ?? "no-user"],
    queryFn: getAnalytics,
  });
