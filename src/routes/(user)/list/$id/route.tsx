import PageStatusSetter from "@/components/PageStatusSetter";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <PageStatusSetter showAddMoneyBtn={false} />
    </>
  );
}
