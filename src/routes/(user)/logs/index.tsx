import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/radix/dialog";
import LogCard from "@/components/LogCard";
import PageStatusSetter from "@/components/PageStatusSetter";
import Scrollable from "@/components/Scrollable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useAutoLoadNextPage from "@/lib/hooks/use-auto-reload-infinite-q";
import { logsQueryOptions } from "@/lib/queries/logs";
import { moneyIdsQueryOptions } from "@/lib/queries/money";
import { debounce } from "@tanstack/pacer";
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileClock, Filter, RefreshCw, X } from "lucide-react";
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
});

function RouteComponent() {
  return (
    <Scrollable hideTotalMoney={true}>
      <div className="text-muted-foreground flex items-center justify-between gap-4 border-b p-4">
        <div className="flex items-center gap-2">
          <FileClock />
          <p>Logs </p>
        </div>
        <button onClick={() => location.reload()} type="button">
          <RefreshCw className="size-4" />
        </button>
      </div>
      <SearchInput />
      <Suspense
        fallback={
          <div className="w-full space-y-4 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="space-y-4 border-b pb-4">
                <Skeleton className="h-12 w-full rounded-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl" />
                </div>
              </div>
            ))}
          </div>
        }
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
    </Scrollable>
  );
}

function SearchInput() {
  const navigate = Route.useNavigate();

  const {
    user,
    queryClient,
    search: { q, flow, type, money },
  } = Route.useRouteContext();
  const debouncedSearch = debounce(
    async (searchTerm: string) => {
      await navigate({ to: "/logs", search: { q: searchTerm, flow, money, type } });
      await queryClient.invalidateQueries({
        queryKey: ["logs", user?.id, flow, type, money, q],
      });
    },
    {
      wait: 500,
    },
  );
  return (
    <div className="flex px-4">
      <Input
        id="searchLog"
        className="-me-px rounded-e-none shadow-none focus-visible:z-10"
        placeholder="Search for 'reason'"
        type="text"
        onChange={(e) => debouncedSearch(e.currentTarget.value)}
      />
      <Dialog>
        <DialogTrigger className="text-muted-foreground flex items-center gap-2 rounded-s-none rounded-e-full border border-l-transparent pr-4 pl-3 text-sm">
          <Filter className="size-4" />
          <span>Filter</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Logs</DialogTitle>
            <DialogDescription>
              Use the filters to narrow down your log search results. You can filter by
              type, money, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Moneys:</p>
              <Suspense
                fallback={
                  <p className="text-muted-foreground text-center text-sm">
                    Getting moneys...
                  </p>
                }
              >
                <MoneyIds />
              </Suspense>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Type:</p>
              <div className="flex flex-wrap gap-2">
                {["add", "edit", "delete", "transfer"].map((_type) => (
                  <Badge
                    asChild
                    className="rounded-full text-sm"
                    variant={"outline"}
                    key={_type}
                  >
                    <Link
                      to="/logs"
                      search={{
                        type:
                          type === _type
                            ? undefined
                            : (_type as "add" | "edit" | "delete" | "transfer"),
                        flow,
                        money,
                        q,
                      }}
                    >
                      {_type}
                      {type === _type ? <X /> : null}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MoneyIds() {
  const { search, user } = Route.useRouteContext();
  const moneyIds = useSuspenseQuery(moneyIdsQueryOptions(user?.id));
  return (
    <div className="flex flex-wrap gap-2">
      {moneyIds.data.map((money) => (
        <Link
          key={money.id}
          to="/logs"
          search={{ ...search, money: money.id === search.money ? undefined : money.id }}
        >
          <Badge
            style={{
              color: money.color ?? "var(--foreground)",
              borderColor:
                money.color === "var(--foreground)"
                  ? "var(--muted)"
                  : money.color || "var(--muted)",
            }}
            variant={search.money === money.id ? "secondary" : "outline"}
            className="min-w-16 rounded-3xl text-sm"
          >
            {money.name}
            {money.id === search.money ? <X /> : null}
          </Badge>
        </Link>
      ))}
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
                    <div ref={ref} className="flex-1" />
                    <LogCard log={log} />
                  </React.Fragment>
                );
              return <LogCard log={log} key={log.id} />;
            })}
            <Button
              className="text-muted-foreground w-full text-center text-sm font-light"
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
                  <div ref={ref} className="flex-1" />
                  <LogCard log={log} />
                </React.Fragment>
              );
            return <LogCard log={log} key={log.id} />;
          })}
          <Button
            className="text-muted-foreground w-full text-center text-sm font-light"
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
