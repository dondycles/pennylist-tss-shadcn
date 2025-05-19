import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/list";
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
    return {
      redirectUrl: REDIRECT_URL,
      user: context.user,
    };
  },
});

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <img src="favicon.ico" className="size-24 rounded-full" />
          <span className="sr-only">pennylist.</span>
        </a>
        <Outlet />
      </div>
    </div>
  );
}
