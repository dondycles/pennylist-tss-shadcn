import { deleteMoney } from "@/lib/server/fn/money";
import { GetUser } from "@/lib/server/fn/user";
import { Database } from "@/lib/server/supabase/types";
import { useTransferState } from "@/lib/stores/transfer-state";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Pencil, PlaneLanding, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ActionConfirmDialog from "./ActionConfirmDialog";
import Amount from "./Amount";
import MoneyFormDialog from "./MoneyFormDialog";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function MoneyCard({
  m,
  deepView,
  moneysQty,
  user,
  queryClient,
  totalMoney,
}: {
  m: Database["public"]["Tables"]["money"]["Row"];
  deepView: boolean;
  moneysQty: number;
  user: GetUser;
  queryClient: QueryClient;
  totalMoney: number;
}) {
  const transferState = useTransferState();

  const transferRole =
    transferState.sender?.id === m.id
      ? "sender"
      : (transferState.receivers?.some((r) => r.id === m.id) ?? false)
        ? "reicever"
        : "none";

  const handleDeleteMoney = useMutation({
    mutationFn: async () =>
      await deleteMoney({
        data: {
          amount: m.amount,
          id: m.id,
          name: m.name,
          color: m.color,
          totalMoney,
        },
      }),
    onSuccess: () => {
      toast.success("Money Deleted");
      if (deepView) {
        location.reload();
      } else {
        if (user)
          queryClient.invalidateQueries({
            queryKey: ["moneys", user.id],
          });
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  if (!user) return null;
  return (
    <div
      hidden={transferRole !== "none"}
      key={m.id}
      style={{
        color: m.color ?? "var(--foreground)",
      }}
      className={`p-4 font-bold ${deepView ? "border-b" : "not-last:border-b"} ${handleDeleteMoney.isPending && "animate-pulse"}`}
    >
      <p className="truncate">{m.name}</p>
      {/* <Separator />
      <p>Role: {transferRole}</p>
      <Separator />
      <p>Sender: {JSON.stringify(transferState.sender)}</p>
      <Separator />
      <p>Receivers: {JSON.stringify(transferState.receivers)}</p>
      <Separator /> */}

      <Amount
        className="text-base font-bold"
        amount={m.amount}
        settings={{ sign: true }}
      />
      <ScrollArea>
        <div className="mt-4 flex overflow-auto">
          <Link hidden={deepView} to="/list/$id" params={{ id: m.id }}>
            <Button size={"icon"} variant={"ghost"}>
              <ExternalLink className="size-4" />
            </Button>
          </Link>
          <MoneyFormDialog
            deepView={deepView}
            initialData={m}
            desc="I hope this is an increase."
            title="Edit Money"
          >
            <Button size={"icon"} variant={"ghost"}>
              <Pencil className="size-4" />
            </Button>
          </MoneyFormDialog>
          <Button
            onClick={() => transferState.selectForTransfer(m)}
            hidden={moneysQty <= 1}
            disabled={moneysQty <= 0}
            size={"icon"}
            variant={"ghost"}
          >
            {transferState.sender ? (
              <PlaneLanding className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
          <ActionConfirmDialog
            confirm={handleDeleteMoney.mutate}
            desc="Are you sure to delete this money?"
            title="Delete"
          >
            <Button size={"icon"} variant={"ghost"}>
              <Trash2 className="size-4" />
            </Button>
          </ActionConfirmDialog>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
