import { queryOptions } from "@tanstack/react-query";
import { getUser, getUserPIN, getUserSettings } from "../server/fn/user";

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: ({ signal }) => getUser({ signal }),
  });

export const userSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-settings"],
    queryFn: async ({ signal }) => await getUserSettings({ signal }),
  });

export const userPINQueryOptions = () =>
  queryOptions({
    queryKey: ["user-pin"],
    queryFn: async ({ signal }) => {
      const { PIN } = await getUserPIN({ signal });
      return PIN;
    },
  });
