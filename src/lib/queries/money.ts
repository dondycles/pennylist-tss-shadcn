import { queryOptions } from "@tanstack/react-query";
import { getMoney, getMoneyIds, getMoneys } from "../server/fn/money";

export const moneysQueryOptions = (userId: string | undefined) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["moneys", userId ?? "no-user"],
    queryFn: async ({ signal }) => await getMoneys({ signal }),
  });

export const moneyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["money", id],
    queryFn: async ({ signal }) => await getMoney({ data: id, signal }),
  });

export const moneyIdsQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["moneyIds", userId ?? "no-user"],
    queryFn: async ({ signal }) => await getMoneyIds({ signal }),
  });
