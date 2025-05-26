import LogCard from "@/components/LogCard";
import MoneyCard from "@/components/MoneyCard";
import MoneySkeleton from "@/components/MoneySkeleton";
import { moneyQueryOptions } from "@/lib/queries/money";
import { Database } from "@/lib/server/supabase/types";
import { useMoneyState } from "@/lib/stores/money-state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/(user)/list/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<MoneySkeleton />}>
      <Money />
    </Suspense>
  );
}

function Money() {
  const { id } = Route.useParams();
  const { queryClient, user } = Route.useRouteContext();
  const { total } = useMoneyState();

  const m = useSuspenseQuery(moneyQueryOptions(id));
  return (
    <>
      <MoneyCard
        queryClient={queryClient}
        user={user}
        moneysQty={1}
        deepView={true}
        m={m.data}
        totalMoney={total}
      />
      <Logs logs={m.data.log.map((log) => ({ ...log, money: m.data }))} />
    </>
  );
}

function Logs({
  logs,
}: {
  logs: Array<
    Database["public"]["Tables"]["log"]["Row"] & {
      money: Database["public"]["Tables"]["money"]["Row"];
    }
  >;
}) {
  return (
    <>
      <p className="text-muted-foreground px-4 pt-4 text-center">Logs</p>
      {logs.map((log) => (
        <LogCard log={log} key={log.id} />
      ))}
    </>
  );
}
