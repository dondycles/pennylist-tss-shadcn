import { queryOptions } from "@tanstack/react-query";
import { getUser, getUserSettings } from "../server/fn/user";

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: ({ signal }) => getUser({ signal }),
  });

export const userSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-settings"],
    queryFn: async ({ signal }) => {
      const settings = await getUserSettings({ signal });
      if (!settings) {
        throw new Error("User settings not found");
      }
      return settings;
    },
  });
