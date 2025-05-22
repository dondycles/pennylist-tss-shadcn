import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export type FloatingNavState = {
  showAddMoneyBtn: boolean;
  showSettingsBtn: boolean;
  showLogsPageBtn: boolean;
  showAnalyticsPageBtn: boolean;
  setState: ({
    showAddMoneyBtn,
    showSettingsBtn,
    showLogsPageBtn,
    showAnalyticsPageBtn,
  }: {
    showAddMoneyBtn: boolean;
    showSettingsBtn: boolean;
    showLogsPageBtn: boolean;
    showAnalyticsPageBtn: boolean;
  }) => void;
};

export const useFloatingNavState = create<FloatingNavState>()(
  persist(
    (set) => ({
      showAddMoneyBtn: false,
      showSettingsBtn: false,
      showLogsPageBtn: false,
      showAnalyticsPageBtn: false,
      setState: (state) => set(() => state),
    }),
    {
      name: "floating-nav-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
