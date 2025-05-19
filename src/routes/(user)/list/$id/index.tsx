import MoneyCard from "@/components/MoneyCard";
import { NotFound } from "@/components/NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { moneyQueryOptions } from "@/lib/queries/money";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list/$id/")({
  component: RouteComponent,
});

export const useRefetchMoneyDeepViewPage = () => {
  const { queryClient, user } = Route.useRouteContext();
  const { id } = Route.useParams();
  if (user && id) queryClient.invalidateQueries(moneyQueryOptions(id));
};

function RouteComponent() {
  const { id } = Route.useParams();
  const m = useQuery({ ...moneyQueryOptions(id) });

  if (m.isLoading) return <Skeleton className="mt-4 h-24 w-full rounded-3xl" />;
  if (m.data) return <MoneyCard moneysQty={1} deepView={true} m={m.data} />;
  return <NotFound />;
}
