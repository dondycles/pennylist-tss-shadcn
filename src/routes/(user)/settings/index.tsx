import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDownIcon,
  DollarSign,
  Eye,
  EyeClosed,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import ActionConfirmDialog from "@/components/ActionConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu";
import PageStatusSetter from "@/components/PageStatusSetter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { userSettingsQueryOptions } from "@/lib/queries/user";
import { updateUserSettings } from "@/lib/server/fn/user";
import { ListState, useListState } from "@/lib/stores/list-state";
import { useMoneyState } from "@/lib/stores/money-state";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/(user)/settings/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(userSettingsQueryOptions());
  },
});

function RouteComponent() {
  const { user, queryClient } = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();
  const settings = useSuspenseQuery(userSettingsQueryOptions());

  const [theme, setTheme] = useState<"dark" | "light">(
    localStorage.theme as "dark" | "light",
  );
  const { asterisk, setAsterisk } = useMoneyState();
  const { flow, sortBy, setState } = useListState();

  const handleUpdateUserSettings = useMutation({
    mutationFn: (
      data: Pick<ListState, "flow" | "sortBy"> & {
        theme: "dark" | "light";
        asterisk: boolean;
      },
    ) => {
      return updateUserSettings({
        data,
      });
    },
    onSuccess: () => {
      settings.refetch();
      queryClient.invalidateQueries({ queryKey: ["moneys", user?.id] });
    },
  });

  function toggleTheme() {
    if (
      document.documentElement.classList.contains("dark") ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
      handleUpdateUserSettings.mutate({ asterisk, flow, sortBy, theme: "light" });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
      handleUpdateUserSettings.mutate({ asterisk, flow, sortBy, theme: "dark" });
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 pt-4 pb-32">
      <div className="text-muted-foreground flex items-center gap-2 border-b px-4 pb-4">
        <Settings />
        <p>Settings</p>
      </div>
      <div className="flex items-center gap-4 px-4">
        <Avatar className="size-16">
          <AvatarImage className="" src={user?.email ?? "favicon.ico"} />
          <AvatarFallback>Pfp</AvatarFallback>
        </Avatar>
        <p className="truncate text-2xl font-bold sm:text-4xl">{user?.email}</p>
      </div>
      <p className="text-muted-foreground px-4">
        Joined at {new Date(user?.createdAt ?? new Date()).toLocaleString()}
      </p>
      <p className="text-muted-foreground px-4">
        Last update at {new Date(settings.data.updated_at ?? new Date()).toLocaleString()}
      </p>
      <Separator />
      <div className="space-y-4 px-4">
        <SettingBar
          label="List Sorting"
          component={(id) => (
            <ListSorterDropdown
              pending={handleUpdateUserSettings.isPending}
              listState={{
                flow: settings.data.flow ?? flow,
                sortBy: settings.data.sortBy ?? sortBy,
                setState: (state) => {
                  setState(state);
                  handleUpdateUserSettings.mutate({ ...state, asterisk, theme });
                },
              }}
              id={id}
            />
          )}
        />
        <SettingBar
          label="Money Visibility"
          component={(id) => (
            <SwitcherComponent
              pending={handleUpdateUserSettings.isPending}
              id={id}
              checked={settings.data.asterisk ?? asterisk}
              onCheckedChange={(asterisk) => {
                setAsterisk(asterisk);
                handleUpdateUserSettings.mutate({ asterisk, theme, flow, sortBy });
              }}
              checkedIcon={<Eye size={16} aria-hidden="true" />}
              uncheckedIcon={<EyeClosed size={16} aria-hidden="true" />}
            />
          )}
        />
        <SettingBar
          label="Theme Mode"
          component={(id) => (
            <SwitcherComponent
              pending={handleUpdateUserSettings.isPending}
              id={id}
              checked={settings.data.theme === "light" || theme === "light"}
              onCheckedChange={toggleTheme}
              checkedIcon={<MoonIcon size={16} aria-hidden="true" />}
              uncheckedIcon={<SunIcon size={16} aria-hidden="true" />}
            />
          )}
        />
      </div>
      <Separator />
      <div className="flex flex-col gap-4 px-4">
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

      <PageStatusSetter
        state={{
          showAddMoneyBtn: false,
          showSettingsBtn: false,
          showLogsPageBtn: true,
          showAnalyticsPageBtn: true,
        }}
      />
    </div>
  );
}

function SettingBar({
  label,
  component,
}: {
  label: string;
  component: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="bg-muted/50 flex items-center justify-between gap-4 rounded-3xl p-4">
      <Label htmlFor={id}>{label}</Label>
      {component(id)}
    </div>
  );
}

function SwitcherComponent({
  checked,
  onCheckedChange,
  checkedIcon,
  uncheckedIcon,
  pending,
  ...props
}: React.ComponentProps<"div"> & {
  checked: boolean | undefined;
  onCheckedChange: (checked: boolean) => void;
  checkedIcon: React.ReactNode;
  uncheckedIcon: React.ReactNode;
  pending: boolean;
}) {
  return (
    <div
      {...props}
      className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium"
    >
      <Switch
        disabled={pending}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto cursor-pointer [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
      />
      <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
        {checkedIcon}
      </span>
      <span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
        {uncheckedIcon}
      </span>
    </div>
  );
}

function ListSorterDropdown({
  listState: { flow, sortBy, setState },
  pending,
  ...props
}: React.ComponentProps<"button"> & { listState: ListState; pending: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props} variant="secondary" disabled={pending}>
          {flow === "asc" ? <ArrowUp /> : <ArrowDown />}
          {sortBy === "amount" ? <DollarSign /> : null}
          {sortBy === "date" ? <Calendar /> : null}
          <span className="capitalize">{sortBy}</span>
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(v) => setState({ flow, sortBy: v as "date" | "amount" })}
        >
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="amount">Amount</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={flow}
          onValueChange={(v) => setState({ flow: v as "desc" | "asc", sortBy })}
        >
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
