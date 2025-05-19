import { deleteMoney, Money } from "@/lib/server/fn/money";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { ExternalLink, Pencil, Send, Trash2 } from "lucide-react";
import ActionConfirmDialog from "./ActionConfirmDialog";
import Amount from "./Amount";
import MoneyFormDialog from "./MoneyFormDialog";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function MoneyCard({
  m,
  deepView,
  moneysQty,
}: {
  m: Money;
  deepView: boolean;
  moneysQty: number;
}) {
  const { queryClient, user } = useRouteContext({ from: "__root__" });
  const handleDeleteMoney = useMutation({
    mutationFn: async () =>
      await deleteMoney({
        data: {
          amount: m.amount,
          id: m.id,
          name: m.name,
          color: m.color ?? undefined,
        },
      }),
    onSuccess: () => {
      if (deepView) {
        location.reload();
      } else {
        if (user)
          queryClient.invalidateQueries({
            queryKey: ["moneys", user.id],
          });
      }
    },
  });
  return (
    <div
      key={m.id}
      style={{
        color: m.color ?? "var(--foreground)",
        borderColor: m.color ? `${m.color}20` : "var(--border)",
      }}
      className={`p-4 font-bold ${deepView ? "border-b" : "not-first:border-t"} ${handleDeleteMoney.isPending && "animate-pulse"}`}
    >
      <p className="truncate">{m.name}</p>
      <Amount
        className="text-base font-bold"
        amount={m.amount}
        settings={{ sign: true }}
      />
      <ScrollArea>
        <div className="mt-4 flex overflow-auto">
          <Link
            hidden={deepView}
            to="/list/$id"
            params={{ id: m.id }}
            search={{ data: m }}
          >
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
            hidden={moneysQty <= 1}
            disabled={moneysQty <= 0}
            size={"icon"}
            variant={"ghost"}
          >
            <Send className="size-4" />
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
