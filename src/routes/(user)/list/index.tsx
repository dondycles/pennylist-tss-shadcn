import MoneyCard from "@/components/MoneyCard";
import PageStatusSetter from "@/components/PageStatusSetter";
import { moneysQueryOptions } from "@/lib/queries/money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(moneysQueryOptions(context.user?.id));
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const moneys = useSuspenseQuery(moneysQueryOptions(user?.id));

  return (
    <>
      <PageStatusSetter showAddMoneyBtn={true} />
      <div>
        {moneys.data?.map((m) => (
          <MoneyCard moneysQty={moneys.data.length} deepView={false} m={m} key={m.id} />
        ))}
      </div>
    </>
  );
}
