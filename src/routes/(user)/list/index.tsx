import MoneyCard from "@/components/MoneyCard";
import MoneySkeleton from "@/components/MoneySkeleton";
import PageStatusSetter from "@/components/PageStatusSetter";
import TotalMoneySetter from "@/components/TotalMoneySetter";
import { moneysQueryOptions } from "@/lib/queries/money";
import { useListState } from "@/lib/stores/list-state";
import { useMoneyState } from "@/lib/stores/money-state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/(user)/list/")({
  component: RouteComponent,
  // loader: ({ context }) => {
  //   context.queryClient.prefetchQuery(
  //     moneysQueryOptions(context.user?.id, { flow: "desc", sortBy: "date" }),
  //   );
  // },
});
function RouteComponent() {
  return (
    <>
      <PageStatusSetter
        state={{ showAddMoneyBtn: true, showSettingsBtn: true, showLogsPageBtn: true }}
      />
      <Suspense
        fallback={Array.from({ length: 4 }).map((_, i) => (
          <MoneySkeleton key={i} />
        ))}
      >
        <Moneys />
      </Suspense>
    </>
  );
}

function Moneys() {
  const { user, queryClient } = Route.useRouteContext();
  const { total } = useMoneyState();
  const listState = useListState();
  // change settings to be saved in database as well
  const moneys = useSuspenseQuery(moneysQueryOptions(user?.id, listState));
  return (
    <div className="pb-32">
      {moneys.data?.map((m) => (
        <MoneyCard
          queryClient={queryClient}
          user={user}
          moneysQty={moneys.data.length}
          deepView={false}
          m={m}
          key={m.id}
          totalMoney={total}
        />
      ))}
      <TotalMoneySetter money={moneys.data} />
    </div>
  );
}
