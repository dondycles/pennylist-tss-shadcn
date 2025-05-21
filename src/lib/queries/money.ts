import { queryOptions } from "@tanstack/react-query";
import { getMoney, getMoneys } from "../server/fn/money";
import { ListState } from "../stores/list-state";

export const moneysQueryOptions = (
  userId: string | undefined,
  listState: Pick<ListState, "flow" | "sortBy">,
) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["moneys", userId ?? "no-user", listState.flow, listState.sortBy],
    queryFn: async () => await getMoneys({ data: listState }),
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
