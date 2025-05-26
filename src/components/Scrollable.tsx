"use client";

import TotalMoneyBar from "./TotalMoneyBar";
import { ScrollArea } from "./ui/scroll-area";

import { cn } from "@/lib/utils";

export default function Scrollable({
  children,
  hideTotalMoney = false,
  className,
}: {
  children: React.ReactNode;
  hideTotalMoney?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full flex-1 overflow-x-hidden overflow-y-auto", className)}>
      <ScrollArea className="h-full w-full">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-40">
          {!hideTotalMoney ? <TotalMoneyBar /> : null}
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
