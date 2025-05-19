import TotalMoneyBar from "@/components/TotalMoneyBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TotalMoneyBar />
      <Outlet />
    </>
  );
}
