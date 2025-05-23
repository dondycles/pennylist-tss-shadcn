import { getSupabaseServerClient } from "@/lib/server/supabase";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
});
export const Route = createFileRoute("/logout")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const logOut = async () => {
      await logoutFn();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.invalidate();
    };
    const timeOut = setTimeout(() => logOut(), 1000);
    return () => clearTimeout(timeOut);
  }, []);
  return (
    <div className="flex h-dvh w-full items-center justify-center p-4">
      <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
        <Loader2 className="size-16 animate-spin" />
        <p>Logging out...</p>
      </div>
    </div>
  );
}
