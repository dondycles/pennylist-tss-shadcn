import { Suspense, useId } from "react";

import { Label } from "@/components/ui/label";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDownIcon,
  ClockPlus,
  DollarSign,
  Eye,
  EyeClosed,
  History,
  Loader2,
  MoonIcon,
  SunIcon,
  User2,
} from "lucide-react";

import ActionConfirmDialog from "@/components/ActionConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/radix/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu";
import PageStatusSetter from "@/components/PageStatusSetter";
import Scrollable from "@/components/Scrollable";
import TimeInfo from "@/components/TimeInfo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { userSettingsQueryOptions } from "@/lib/queries/user";
import { updateUserSettings } from "@/lib/server/fn/user";
import { ListState } from "@/lib/server/supabase/types";
import { useMoneyState } from "@/lib/stores/money-state";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { OTPInput, SlotProps } from "input-otp";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
export const Route = createFileRoute("/(user)/settings/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(userSettingsQueryOptions());
  },
});

function RouteComponent() {
  return (
    <Scrollable hideTotalMoney={true}>
      <div className="text-muted-foreground flex items-center gap-2 border-b p-4">
        <Settings />
        <p>Settings</p>
      </div>
      <Suspense
        fallback={
          <p className="text-muted-foreground text-center">Getting settings...</p>
        }
      >
        <SettingsComponent />
      </Suspense>
    </Scrollable>
  );
}

function SettingsComponent() {
  const { user, queryClient } = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();
  const settings = useSuspenseQuery(userSettingsQueryOptions());
  const [theme, setTheme] = useState<"dark" | "light">(
    localStorage.theme as "dark" | "light",
  );
  const [openPINDialog, setOpenPINDialog] = useState(false);
  const { asterisk, setAsterisk } = useMoneyState();
  const handleUpdateUserSettings = useMutation({
    mutationFn: (data: {
      theme?: "dark" | "light";
      asterisk?: boolean;
      withPIN?: boolean | null;
      PIN?: string | null;
      sortBy?: "date" | "amount";
      flow?: "asc" | "desc";
    }) => {
      return updateUserSettings({
        data,
      });
    },
    onSuccess: () => {
      setOpenPINDialog(false);
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
      handleUpdateUserSettings.mutate({ ...settings.data, theme: "light" });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
      handleUpdateUserSettings.mutate({ ...settings.data, theme: "dark" });
    }
  }
  return (
    <>
      <div className="flex items-center gap-4 px-4">
        <User2 className="size-10" />
        <p className="truncate text-2xl font-bold sm:text-4xl">{user?.email}</p>
      </div>
      <div className="text-muted-foreground space-y-1 px-4 text-sm">
        <div>
          <span>Joined </span>
          <TimeInfo createdAt={user?.createdAt ?? new Date().toLocaleString()} />{" "}
          <ClockPlus className="inline size-4" />
        </div>
        <div>
          <span>Last update </span>
          <TimeInfo
            createdAt={settings.data?.updated_at ?? new Date().toLocaleString()}
          />{" "}
          <History className="inline size-4" />
        </div>
      </div>
      <Separator />
      <div className="space-y-4 px-4">
        <SettingBar
          label="List Sorting"
          component={(id) => (
            <ListSorterDropdown
              pending={handleUpdateUserSettings.isPending}
              listState={{
                flow: settings.data ? settings.data.flow : "desc",
                sortBy: settings.data ? settings.data.sortBy : "date",
                setState: (state) => {
                  handleUpdateUserSettings.mutate({ ...settings.data, ...state });
                },
              }}
              id={id}
            />
          )}
        />
        <Dialog onOpenChange={setOpenPINDialog} open={openPINDialog}>
          <SettingBar
            label="Ask PIN On Open"
            component={() => (
              <DialogTrigger asChild>
                <Button variant={"secondary"}>
                  {settings.data.PIN === null ? "Set PIN" : "Change/Remove PIN"}
                </Button>
              </DialogTrigger>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {settings.data.PIN !== null ? "Change/Remove PIN" : "Set PIN"}
              </DialogTitle>
              <DialogDescription>
                Current PIN: {settings.data.PIN ?? "Not set"}
              </DialogDescription>
            </DialogHeader>
            <PinCard
              setPin={(PIN) => handleUpdateUserSettings.mutate({ PIN })}
              pending={handleUpdateUserSettings.isPending}
              PIN={settings.data?.PIN}
            />
          </DialogContent>
        </Dialog>

        <SettingBar
          label="Money Visibility"
          component={(id) => (
            <SwitcherComponent
              pending={handleUpdateUserSettings.isPending}
              id={id}
              checked={settings.data?.asterisk ?? asterisk}
              onCheckedChange={(asterisk) => {
                setAsterisk(asterisk);
                handleUpdateUserSettings.mutate({ ...settings.data, asterisk });
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
              checked={
                settings.data
                  ? settings.data.theme === "light" || theme === "light"
                  : theme === "light"
              }
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
    </>
  );
}

function SettingBar({
  label,
  component,
  card,
}: {
  label: string;
  component?: (id: string) => React.ReactNode;
  card?: React.ReactNode;
}) {
  const id = useId();
  if (card)
    return (
      <div className="bg-muted/50 flex w-full flex-col items-center justify-between gap-4 rounded-3xl p-4">
        <div className="flex w-full items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          {component ? component(id) : null}
        </div>
        <div className="w-full">{card}</div>
      </div>
    );
  return (
    <div className="bg-muted/50 flex items-center justify-between gap-4 rounded-3xl p-4">
      <Label htmlFor={id}>{label}</Label>
      {component ? component(id) : null}
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
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-3xl last:rounded-e-3xl",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

function PinCard({
  PIN,
  pending,
  setPin,
}: {
  PIN?: string | null;
  pending: boolean;
  setPin: (PIN: string | null) => void;
}) {
  return PIN ? (
    <ChangePinForm PIN={PIN} pending={pending} setPin={setPin} />
  ) : (
    <NewPinForm PIN={PIN} pending={pending} setPin={setPin} />
  );
}

function ChangePinForm({
  PIN,
  pending,
  setPin,
}: {
  PIN: string;
  pending: boolean;
  setPin: (PIN: string | null) => void;
}) {
  const formSchema = z
    .object({
      currentPIN: z.string().min(4).max(4),
      newPIN: z.string().min(4).max(4),
    })
    .refine((data) => data.currentPIN === PIN, {
      message: "Did no match with current PIN",
      path: ["currentPIN"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPIN: "",
      newPIN: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPin(values.newPIN);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4"
      >
        <FormField
          control={form.control}
          name="currentPIN"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Current PIN</FormLabel>
              <FormControl>
                <OTPInput
                  {...field}
                  containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                  maxLength={4}
                  render={({ slots }) => (
                    <div className="flex">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New PIN</FormLabel>
              <FormControl>
                <OTPInput
                  {...field}
                  containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                  maxLength={4}
                  render={({ slots }) => (
                    <div className="flex">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ActionConfirmDialog
          title="Change PIN"
          desc="Are you sure to change PIN?"
          confirm={() => setPin(form.getValues("newPIN"))}
        >
          <Button disabled={pending} type="button" className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Change PIN"}
          </Button>
        </ActionConfirmDialog>
        <ActionConfirmDialog
          title="Remove PIN"
          desc="Are you sure to remove PIN?"
          confirm={() => setPin(null)}
        >
          <Button
            disabled={pending}
            type="button"
            className="w-full"
            variant={"destructive"}
          >
            {pending ? <Loader2 className="animate-spin" /> : "Remove PIN"}
          </Button>
        </ActionConfirmDialog>
      </form>
    </Form>
  );
}

function NewPinForm({
  PIN,
  pending,
  setPin,
}: {
  PIN?: string | null;
  pending: boolean;
  setPin: (PIN: string | null) => void;
}) {
  const formSchema = z.object({
    PIN: z.string().min(4).max(4),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PIN: PIN ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPin(values.PIN);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4"
      >
        <FormField
          control={form.control}
          name="PIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIN</FormLabel>
              <FormControl>
                <OTPInput
                  {...field}
                  id="PIN"
                  name="pin"
                  containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                  maxLength={4}
                  render={({ slots }) => (
                    <div className="flex">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ActionConfirmDialog
          title="Set PIN"
          desc="Are you sure to set PIN?"
          confirm={() => setPin(form.getValues("PIN"))}
        >
          <Button disabled={pending} type="button" className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Set PIN"}
          </Button>
        </ActionConfirmDialog>
      </form>
    </Form>
  );
}
