import PageStatusSetter from "@/components/PageStatusSetter";
import Scrollable from "@/components/Scrollable";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/(user)/analytics/")({
  component: RouteComponent,
});

import { TotalMoneyChart } from "@/components/TotalMoneyChart";

function RouteComponent() {
  // const { logs, search } = Route.useRouteContext();

  return (
    <Scrollable hideTotalMoney={true}>
      <div className="text-muted-foreground flex items-center justify-between gap-4 border-b p-4">
        <div className="flex items-center gap-2">
          <Activity />
          <p>Analytics </p>
        </div>
        <button onClick={() => location.reload()} type="button">
          <RefreshCw className="size-4" />
        </button>
      </div>
      <TotalMoneyChart />
      <PageStatusSetter
        state={{
          showAddMoneyBtn: false,
          showSettingsBtn: true,
          showLogsPageBtn: true,
          showAnalyticsPageBtn: false,
        }}
      />
    </Scrollable>
  );
}
