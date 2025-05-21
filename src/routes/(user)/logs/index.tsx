import LogCard from "@/components/LogCard";
import PageStatusSetter from "@/components/PageStatusSetter";
import { logsQueryOptions } from "@/lib/queries/logs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChartGantt } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/(user)/logs/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(logsQueryOptions(context.user?.id));
  },
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col justify-between gap-8 pt-8 pb-32">
      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 px-4 pb-4">
          <ChartGantt />
          <p>Logs</p>
        </div>
        <Suspense
          fallback={
            <p className="text-muted-foreground p-4 text-center text-sm">
              Getting logs...
            </p>
          }
        >
          <Logs />
        </Suspense>
        <PageStatusSetter
          state={{
            showAddMoneyBtn: false,
            showSettingsBtn: true,
            showLogsPageBtn: false,
          }}
        />
      </div>
    </div>
  );
}
function Logs() {
  const { user } = Route.useRouteContext();
  const logs = useSuspenseQuery(logsQueryOptions(user?.id));
  return (
    <div className="pb-32">
      {logs.data?.map((log) => <LogCard log={log} key={log.id} />)}
    </div>
  );
}
