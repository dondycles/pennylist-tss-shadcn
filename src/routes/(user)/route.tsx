import FloatingNav from "@/components/FloatingNav";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/login";
    if (!context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
    return {
      redirectUrl: REDIRECT_URL,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  if (user)
    return (
      <>
        <Outlet />
        <FloatingNav />
      </>
    );
}
