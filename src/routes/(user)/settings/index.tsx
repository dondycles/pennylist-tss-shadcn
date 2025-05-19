import ActionConfirmDialog from "@/components/ActionConfirmDialog";
import PageStatusSetter from "@/components/PageStatusSetter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Settings } from "lucide-react";
export const Route = createFileRoute("/(user)/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col justify-between gap-8 px-4 pt-8 pb-32">
      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 pb-4">
          <Settings />
          <p>Settings</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage className="" src={user?.image ?? "favicon.ico"} />
            <AvatarFallback>Pfp</AvatarFallback>
          </Avatar>
          <p className="truncate text-2xl font-bold sm:text-4xl">{user?.name}</p>
        </div>
        <p className="text-muted-foreground">
          Joined at {user?.createdAt.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <ActionConfirmDialog
          confirm={() => {}}
          desc="Are you sure to permanentaly delete your account?"
          title="Account Deletion"
        >
          <Button type="button" variant="destructive">
            Delete Account
          </Button>
        </ActionConfirmDialog>
        <ActionConfirmDialog
          confirm={() => navigate({ to: "/logout" })}
          desc="Are you sure to log out?"
          title="Logging out"
        >
          <Button type="button" variant="ghost">
            Sign out
          </Button>
        </ActionConfirmDialog>
      </div>
      <PageStatusSetter state={{ showAddMoneyBtn: false, showSettingsBtn: false }} />
    </div>
  );
}
