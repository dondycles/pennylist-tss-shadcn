"use client";

import { useMoneyState } from "@/lib/stores/money-state";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export default function Amount({
  className,
  amount,
  settings,
  color,
}: {
  className?: ClassNameValue;
  amount: number;
  settings: { decimals?: number; sign: boolean };
  color?: string;
}) {
  const locked = false;
  const moneyState = useMoneyState();
  const stringedAmount = amount.toString();
  const asteriskedAmount = "*".repeat(stringedAmount.length);
  const withSign = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: settings?.decimals ?? 2,
  });
  const withoutSign = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: settings?.decimals ?? 2,
  });

  return (
    <span
      style={{ color: color ?? "" }}
      className={cn("font-readex text-2xl font-black", className)}
    >
      {locked
        ? asteriskedAmount
        : moneyState.asterisk
          ? asteriskedAmount
          : settings?.sign
            ? withSign.format(amount)
            : withoutSign.format(amount)}
    </span>
  );
}
