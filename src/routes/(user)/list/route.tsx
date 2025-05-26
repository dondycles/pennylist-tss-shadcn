import Scrollable from "@/components/Scrollable";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Scrollable>
      <Outlet />
    </Scrollable>
  );
}
