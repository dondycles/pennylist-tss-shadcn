import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type MoneyState = {
  asterisk: boolean;
  setAsterisk: (state: boolean) => void;
};

export const useMoneyState = create<MoneyState>()(
  persist(
    (set) => ({
      asterisk: false,
      setAsterisk: (state) => set(() => ({ asterisk: state })),
    }),
    {
      name: "money-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
