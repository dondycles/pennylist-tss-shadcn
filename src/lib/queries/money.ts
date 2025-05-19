import { queryOptions } from "@tanstack/react-query";
import { getMoney, getMoneys } from "../server/fn/money";

export const moneysQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["moneys", userId ?? "no-user"],
    queryFn: async () => await getMoneys(),
  });

export const moneyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["money", id],
    queryFn: async () => {
      const money = await getMoney({ data: id });
      if (!money) {
        throw new Error("Money not found");
      }
      return money;
    },
  });
