import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./storage";

export type PageState = {
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

export const usePageState = create<PageState>()(
  persist(
    (set) => ({
      showAddMoneyBtn: false,
      showSettingsBtn: false,
      showLogsPageBtn: false,
      setState: (state) => set(() => state),
    }),
    {
      name: "page-state",
      storage: createJSONStorage(() => storage),
    },
  ),
);
