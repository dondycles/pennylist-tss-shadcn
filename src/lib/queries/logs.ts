import { infiniteQueryOptions } from "@tanstack/react-query";
import { getLogs } from "../server/fn/logs";

export const logsQueryOptions = ({
  userId,
  flow,
  type,
  q,
  money,
}: {
  userId: string | undefined;
  flow?: "asc" | "desc";
  type?: "add" | "edit" | "delete" | "transfer";
  q?: string;
  money?: string;
}) =>
  infiniteQueryOptions({
    queryKey: ["logs", userId ?? "no-user", flow, type, money, q],
    queryFn: async ({ signal, pageParam }) =>
      await getLogs({ signal, data: { flow, type, money, q, pageParam } }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
