import PageStatusSetter from "@/components/PageStatusSetter";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/(user)/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-4 pt-4 pb-32">
      <div className="text-muted-foreground flex items-center justify-between gap-4 border-b px-4 pb-4">
        <div className="flex items-center gap-2">
          <Activity />
          <p>Analytics</p>
        </div>
        <button onClick={() => location.reload()} type="button">
          <RefreshCw className="size-4" />
        </button>
      </div>
      <PageStatusSetter
        state={{
          showAddMoneyBtn: false,
          showSettingsBtn: true,
          showLogsPageBtn: true,
          showAnalyticsPageBtn: false,
        }}
      />
    </div>
  );
}
