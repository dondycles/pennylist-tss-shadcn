import { z } from "zod";
import { create } from "zustand";
import { Money, moneyWithTransferDetailsSchema } from "../server/fn/money";
export type MoneyWithTransferDetails = Money & {
  fee?: number;
  reason?: string;
  cashIn?: number;
};
export type TransferState = {
  sender: z.infer<typeof moneyWithTransferDetailsSchema> | null;
  receivers: z.infer<typeof moneyWithTransferDetailsSchema>[] | null;
  selectForTransfer: (money: z.infer<typeof moneyWithTransferDetailsSchema>) => void;
  cancel: () => void;
  setReceiverData: (money: z.infer<typeof moneyWithTransferDetailsSchema>) => void;
  reset: () => void;
};

export const useTransferState = create<TransferState>()((set) => ({
  sender: null,
  receivers: null,
  selectForTransfer: (money) =>
    set((state) => {
      // If sender is not set, set sender to the selected money
      if (!state.sender) {
        return { sender: money };
      }
      // If the selected money is the sender, reset both sender and receivers
      if (money.id === state.sender.id) {
        return { sender: null, receivers: null };
      }
      // If receivers is null or empty, add the selected money as the first receiver
      if (!state.receivers || state.receivers.length === 0) {
        return { receivers: [money] };
      }
      // If the selected money is already a receiver, remove it; otherwise, add it
      const isExisting = state.receivers.some((r) => r.id === money.id);
      if (isExisting) {
        const updatedReceivers = state.receivers.filter((r) => r.id !== money.id);
        return { receivers: updatedReceivers.length ? updatedReceivers : null };
      } else {
        return { receivers: [...state.receivers, money] };
      }
    }),
  setReceiverData: (money) =>
    set((state) => {
      if (state.receivers && state.receivers.find((r) => r.id === money.id)) {
        return {
          receivers: state.receivers.map((r) =>
            r.id === money.id ? { ...r, ...money } : r,
          ),
        };
      }
      return {};
    }),
  cancel: () => set(() => ({ receivers: null, sender: null })),
  reset: () =>
    set(({ receivers }) => {
      return {
        receivers: receivers?.map((r) => ({ ...r, cashIn: 0, fee: 0 })),
      };
    }),
}));
