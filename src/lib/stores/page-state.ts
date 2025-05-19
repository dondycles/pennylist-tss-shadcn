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

export type PageState = {
  showAddMoneyBtn: boolean;
  setShowAddMoneyBtn: (state: boolean) => void;
};

export const usePageState = create<PageState>()(
  persist(
    (set) => ({
      showAddMoneyBtn: false,

      setShowAddMoneyBtn: (state) => set(() => ({ showAddMoneyBtn: state })),
    }),
    {
      name: "page-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
