import { queryOptions } from "@tanstack/react-query";
import { getLogs } from "../server/fn/logs";

export const logsQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["logs", userId ?? "no-user"],
    queryFn: async () => await getLogs(),
  });
