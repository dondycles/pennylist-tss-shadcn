import { queryOptions } from "@tanstack/react-query";
import { getMoney, getMoneys } from "../server/fn/money";

export const moneysQueryOptions = (userId: string | undefined) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["moneys", userId ?? "no-user"],
    queryFn: async ({ signal }) => await getMoneys({ signal }),
  });

export const moneyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["money", id],
    queryFn: async ({ signal }) => {
      const money = await getMoney({ data: id, signal });
      if (!money) {
        throw new Error("Money not found");
      }
      return money;
    },
  });
