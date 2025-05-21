import { Logs } from "@/lib/server/fn/logs";
import { log } from "@/lib/server/schema";
import { ArrowDownIcon, ArrowUpIcon, Clock } from "lucide-react";
import Amount from "./Amount";
import { Separator } from "./ui/separator";

export default function LogCard({ log }: { log: Logs[number] }) {
  const getDiff = (key: "amount" | "totalMoney") => {
    const prev = log.changes.prev[key] ?? 0;
    const curr = log.changes.current[key] ?? 0;
    const isIncrease = prev < curr;
    const hasDifference = prev !== curr;
    const difference = curr - prev;
    const percentChange =
      hasDifference && prev !== 0
        ? Math.abs(Math.round((difference / (prev || 1)) * 100))
        : 0;
    return { isIncrease, hasDifference, difference, percentChange };
  };

  const {
    isIncrease: moneyIsIncrease,
    hasDifference: moneyHasDifference,
    difference: moneyDifference,
    percentChange: moneyPercentChange,
  } = getDiff("amount");
  const {
    isIncrease: totalMoneyIsIncrease,
    hasDifference: totalMoneyHasDifference,
    difference: totalMoneyDifference,
    percentChange: totalMoneyPercentChange,
  } = getDiff("totalMoney");

  return (
    <div key={log.id} className="w-full py-4 not-last:border-b">
      <div className="w-full px-4">
        <p className="font-bold capitalize">{log.reason ?? log.type}</p>
        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
          <Clock className="size-4" />
          <p className="text-sm">{log.createdAt?.toLocaleDateString()}</p>
        </div>
        <div className="xs:grid-cols-[1fr_1fr] xs:grid-rows-1 mt-4 grid grid-rows-[1fr_1fr] gap-4">
          <Data title="Previous" data={log.changes.prev} />
          <Data
            title="Current"
            data={log.changes.current}
            moneyDiffComponent={
              moneyHasDifference ? (
                <Difference
                  difference={moneyDifference}
                  isIncrease={moneyIsIncrease}
                  percentChange={moneyPercentChange}
                />
              ) : null
            }
            totalMoneyDiffComponent={
              totalMoneyHasDifference ? (
                <Difference
                  difference={totalMoneyDifference}
                  isIncrease={totalMoneyIsIncrease}
                  percentChange={totalMoneyPercentChange}
                />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
}

function Data({
  data,
  moneyDiffComponent,
  totalMoneyDiffComponent,
  title,
}: {
  data: (typeof log.$inferSelect)["changes"]["prev"];
  moneyDiffComponent?: React.ReactNode;
  totalMoneyDiffComponent?: React.ReactNode;
  title: string;
}) {
  return (
    <div
      style={{ color: data.color ?? "var(--foreground)" }}
      className="bg-muted truncate rounded-3xl p-4"
    >
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="font-bold">{data.name}</p>
      <Amount
        className="truncate text-base"
        amount={data.amount}
        settings={{ sign: true }}
      />
      {moneyDiffComponent ? moneyDiffComponent : null}
      <Separator className="my-2" />
      <p className="text-muted-foreground text-sm">Overall Money</p>
      <Amount
        className="truncate text-base"
        amount={data.totalMoney ?? 0}
        settings={{ sign: true }}
      />
      {totalMoneyDiffComponent ? totalMoneyDiffComponent : null}
    </div>
  );
}

function Difference({
  isIncrease,
  difference,
  percentChange,
}: {
  isIncrease: boolean;
  difference: number;
  percentChange: number;
}) {
  return (
    <>
      {" "}
      (
      <span className={`inline ${isIncrease ? "text-green-500" : "text-destructive"} `}>
        {isIncrease ? "+" : "-"}
      </span>
      <Amount
        className={`inline ${isIncrease ? "text-green-500" : "text-destructive"} text-base`}
        amount={Math.abs(difference)}
        settings={{ sign: true }}
      />{" "}
      {isIncrease ? (
        <ArrowUpIcon className="inline size-4 align-text-bottom text-green-500" />
      ) : (
        <ArrowDownIcon className="text-destructive inline size-4 align-text-bottom" />
      )}
      <span
        className={`inline font-bold ${isIncrease ? "text-green-500" : "text-destructive"}`}
      >
        {percentChange}%
      </span>
      )
    </>
  );
}
