import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export type ListState = {
  sortBy: "date" | "amount";
  flow: "asc" | "desc";
  setState: ({
    sortBy,
    flow,
  }: {
    sortBy: "date" | "amount";
    flow: "asc" | "desc";
  }) => void;
};

export const useListState = create<ListState>()(
  persist(
    (set) => ({
      flow: "desc",
      sortBy: "date",
      setState: ({ flow, sortBy }) => set(() => ({ flow, sortBy })),
    }),
    {
      name: "list-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
