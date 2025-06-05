import { TransferState, useTransferState } from "@/lib/stores/transfer-state";
import { Plus, X } from "lucide-react";
import Amount from "./Amount";
import MoneyInput from "./MoneyInput";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function MoneyTransferCard({
  receiver,
  sender,
  action,
  totalFees,
  totalCashins,
  invalid,
}: {
  receiver?: NonNullable<TransferState["receivers"]>[number];
  sender?: NonNullable<TransferState["sender"]>;
  action: () => void;
  totalFees: number;
  totalCashins: number;
  invalid: boolean;
}) {
  const { setReceiverData } = useTransferState();
  if (sender) {
    return (
      <div style={{ color: sender.color ?? "var(--foreground)" }} className="space-y-1">
        {invalid ? (
          <p className="text-destructive">Sender cannot be below zero.</p>
        ) : (
          <p className="text-muted-foreground">Sender</p>
        )}
        <p className="truncate font-bold">{sender.name}</p>

        <Amount
          className={`truncate font-bold ${invalid && "text-destructive"}`}
          amount={sender.amount - totalFees - totalCashins}
          settings={{ sign: true }}
        />
      </div>
    );
  }
  if (receiver) {
    return (
      <div
        style={{ color: receiver.color ?? "var(--foreground)" }}
        className="w-full text-left not-first:border-t not-first:pt-4"
      >
        <div className="flex w-full flex-row items-start justify-between">
          <div className="grid">
            <p className="truncate font-bold">{receiver.name}</p>
            <Amount
              className="truncate text-base font-bold"
              amount={receiver.amount + (receiver.cashIn ?? 0)}
              settings={{ sign: true }}
            />
          </div>
          <Button
            size={"icon"}
            onClick={action}
            className="text-destructive hover:text-destructive"
            variant={"ghost"}
          >
            <X />
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-[minmax(128px,1fr)_16px_minmax(64px,_128px)] gap-2">
          <MoneyInput
            aria-invalid={invalid}
            value={receiver.cashIn}
            onChange={(e) => {
              setReceiverData({
                ...receiver,
                cashIn: Number(e.currentTarget.value),
              });
            }}
            className="w-full"
            placeholder="Incoming transfer amount"
          />
          <Plus className="m-auto size-4" />
          <MoneyInput
            aria-invalid={invalid}
            value={receiver.fee}
            onChange={(e) => {
              setReceiverData({
                ...receiver,
                fee: Number(e.currentTarget.value),
              });
            }}
            className="w-full"
            placeholder="Fee"
          />
        </div>
        <Textarea
          value={receiver.reason ?? ""}
          onChange={(e) => {
            setReceiverData({ ...receiver, reason: e.currentTarget.value });
          }}
          placeholder="reason (optional)"
          className="mt-2"
        />
      </div>
    );
  }
}
