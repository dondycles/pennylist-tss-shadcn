import LogCard from "@/components/LogCard";
import PageStatusSetter from "@/components/PageStatusSetter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAutoLoadNextPage from "@/lib/hooks/use-auto-reload-infinite-q";
import { logsQueryOptions } from "@/lib/queries/logs";
import { debounce } from "@tanstack/pacer";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileClock, RefreshCw } from "lucide-react";
import React, { Suspense } from "react";
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
    await context.queryClient.prefetchInfiniteQuery(
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
  const logs = useSuspenseInfiniteQuery(
    logsQueryOptions({
      userId: user?.id,
      flow: search.flow,
      type: search.type,
      money: search.money,
      q: search.q,
    }),
  );
  const _logs = logs.data.pages.flatMap((page) => page);

  const { ref, loaderRef } = useAutoLoadNextPage({
    fetchNextPage: () => logs.fetchNextPage(),
  });
  return (
    <div className="pb-32">
      {search.q ? (
        !_logs.length ? (
          <p className="text-muted-foreground text-center">No results for '{search.q}'</p>
        ) : (
          <>
            <p className="text-muted-foreground text-center">Results for '{search.q}'</p>
            {_logs.map((log, i) => {
              if (i === _logs.length - 1)
                return (
                  <React.Fragment key={log.id}>
                    <div ref={ref} key={log.id} className="flex-1" />
                    <LogCard log={log} key={log.id} />
                  </React.Fragment>
                );
              return <LogCard log={log} key={log.id} />;
            })}
            <Button
              className="text-muted-foreground text-xs font-light"
              hidden={!logs.hasNextPage}
              ref={loaderRef}
              variant={"ghost"}
              onClick={() => {
                logs.fetchNextPage();
              }}
            >
              {logs.isFetchingNextPage ? "Loading..." : "Fetch more posts"}
            </Button>
          </>
        )
      ) : (
        <>
          {_logs.map((log, i) => {
            if (i === _logs.length - 1)
              return (
                <React.Fragment key={log.id}>
                  <div ref={ref} key={log.id} className="flex-1" />
                  <LogCard log={log} key={log.id} />
                </React.Fragment>
              );
            return <LogCard log={log} key={log.id} />;
          })}
          <Button
            className="text-muted-foreground text-xs font-light"
            hidden={!logs.hasNextPage}
            ref={loaderRef}
            variant={"ghost"}
            onClick={() => {
              logs.fetchNextPage();
            }}
          >
            {logs.isFetchingNextPage ? "Loading..." : "Fetch more posts"}
          </Button>
        </>
      )}
    </div>
  );
}
