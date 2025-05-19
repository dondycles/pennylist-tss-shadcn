import { getTotalMoney } from "@/lib/server/fn/money";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import Amount from "./Amount";

export default function TotalMoneyBar() {
  const { user } = useRouteContext({ from: "__root__" });

  const totalMoney = useQuery({
    queryFn: user ? getTotalMoney : skipToken,
    queryKey: ["totalMoney", user ? user.id : "no-user"],
  });

  return (
    <div className="bg-background w-full space-y-1 rounded-b-3xl p-8 text-center shadow-xl dark:bg-neutral-900">
      <p className="text-muted-foreground">Total money</p>
      <Amount
        className="truncate text-4xl font-bold"
        amount={totalMoney.data ?? 0}
        settings={{ sign: true }}
      />
    </div>
  );
}
