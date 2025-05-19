import { Money } from "../server/fn/money";
export type MoneyWithTransferDetails = Money & {
  fee: number;
  reason: string;
};
export type TransferState = {
  sender: Money | null;
  receivers: MoneyWithTransferDetails[] | null;
  setSender: (money: Money | null) => void;
  setReceivers: (money: MoneyWithTransferDetails | null) => void;
  reset: () => void;
};
