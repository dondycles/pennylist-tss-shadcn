import TotalMoneyBar from "@/components/TotalMoneyBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-dvh w-full">
      <div className="mx-auto w-full max-w-4xl">
        <TotalMoneyBar />
        <Outlet />
      </div>
    </div>
  );
}
