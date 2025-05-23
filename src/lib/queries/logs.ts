import { queryOptions } from "@tanstack/react-query";
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
  queryOptions({
    queryKey: ["logs", userId ?? "no-user", flow, type, money, q],
    queryFn: async ({ signal }) =>
      await getLogs({ signal, data: { flow, type, money, q } }),
  });
