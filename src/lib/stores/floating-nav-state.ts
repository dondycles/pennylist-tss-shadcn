import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export type FloatingNavState = {
  showAddMoneyBtn: boolean;
  showSettingsBtn: boolean;
  showLogsPageBtn: boolean;
  setState: ({
    showAddMoneyBtn,
    showSettingsBtn,
    showLogsPageBtn,
  }: {
    showAddMoneyBtn: boolean;
    showSettingsBtn: boolean;
    showLogsPageBtn: boolean;
  }) => void;
};

export const useFloatingNavState = create<FloatingNavState>()(
  persist(
    (set) => ({
      showAddMoneyBtn: false,
      showSettingsBtn: false,
      showLogsPageBtn: false,
      setState: (state) => set(() => state),
    }),
    {
      name: "floating-nav-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
