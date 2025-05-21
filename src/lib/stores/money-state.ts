import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export type MoneyState = {
  asterisk: boolean;
  setAsterisk: (state: boolean) => void;
  total: number;
  setTotal: (total: number) => void;
};

export const useMoneyState = create<MoneyState>()(
  persist(
    (set) => ({
      asterisk: false,
      setAsterisk: (asterisk) => set(() => ({ asterisk })),
      total: 0,
      setTotal: (total) => set(() => ({ total })),
    }),
    {
      name: "money-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
