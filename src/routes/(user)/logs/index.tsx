import LogCard from "@/components/LogCard";
import PageStatusSetter from "@/components/PageStatusSetter";
import { Input } from "@/components/ui/input";
import { logsQueryOptions } from "@/lib/queries/logs";
import { debounce } from "@tanstack/pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileClock, RefreshCw } from "lucide-react";
import { Suspense } from "react";
export const Route = createFileRoute("/(user)/logs/")({
  component: RouteComponent,
  validateSearch: (search: {
    flow?: "asc" | "desc";
    type?: "add" | "edit" | "delete" | "transfer";
    q?: string;
    money?: string;
  }) => search,
  beforeLoad: async ({ search }) => {
    return { search };
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      logsQueryOptions({
        userId: context.user?.id,
        flow: context.search.flow,
        type: context.search.type,
        money: context.search.money,
        q: context.search.q,
      }),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const {
    user,
    queryClient,
    search: { q, flow, type, money },
  } = Route.useRouteContext();
  const debouncedSearch = debounce(
    async (searchTerm: string) => {
      await navigate({ to: "/logs", search: { q: searchTerm } });
      await queryClient.invalidateQueries({
        queryKey: ["logs", user?.id, flow, type, money, q],
      });
    },
    {
      wait: 500,
    },
  );
  return (
    <div className="flex h-full flex-col gap-4 pt-4 pb-32">
      <div className="text-muted-foreground flex items-center justify-between gap-4 border-b px-4 pb-4">
        <div className="flex items-center gap-2">
          <FileClock />
          <p>Logs </p>
        </div>
        <button onClick={() => location.reload()} type="button">
          <RefreshCw className="size-4" />
        </button>
      </div>
      <div className="px-4">
        <Input
          onChange={(e) => debouncedSearch(e.currentTarget.value)}
          placeholder="Search"
        />
      </div>
      <Suspense
        fallback={<p className="text-muted-foreground text-center">Getting logs...</p>}
      >
        <Logs />
      </Suspense>
      <PageStatusSetter
        state={{
          showAddMoneyBtn: false,
          showSettingsBtn: true,
          showLogsPageBtn: false,
          showAnalyticsPageBtn: true,
        }}
      />
    </div>
  );
}

function Logs() {
  const { search, user } = Route.useRouteContext();
  const logs = useSuspenseQuery(
    logsQueryOptions({
      userId: user?.id,
      flow: search.flow,
      type: search.type,
      money: search.money,
      q: search.q,
    }),
  );
  return (
    <div className="pb-32">
      {search.q ? (
        !logs.data.length ? (
          <p className="text-muted-foreground text-center">No results for '{search.q}'</p>
        ) : (
          <p className="text-muted-foreground text-center">Results for '{search.q}'</p>
        )
      ) : null}
      {logs.data.map((log) => (
        <LogCard log={log} key={log.id} />
      ))}
    </div>
  );
}
