import { addMoney, editMoney, moneySchema } from "@/lib/server/fn/money";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Database } from "@/lib/server/supabase/types";
import { useMoneyState } from "@/lib/stores/money-state";
import { useRouteContext } from "@tanstack/react-router";
import { Loader2, RotateCw } from "lucide-react";
import ActionConfirmDialog from "../ActionConfirmDialog";
import Amount from "../Amount";
import ColorPicker from "../ColorPickerDialog";
import MoneyInput from "../MoneyInput";
import { DialogClose } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export default function MoneyForm({
  close,
  initialData,
  deepView,
}: {
  close: () => void;
  initialData?: Database["public"]["Tables"]["money"]["Row"];
  deepView: boolean;
}) {
  const { queryClient, user } = useRouteContext({ from: "__root__" });
  const { total: totalMoney } = useMoneyState();
  const moneyForm = useForm<z.infer<typeof moneySchema>>({
    resolver: zodResolver(moneySchema),
    defaultValues: {
      amount: initialData ? initialData.amount : undefined,
      name: initialData ? initialData.name : undefined,
      color: initialData ? initialData.color : undefined,
      reason: undefined,
    },
  });

  const handleMoney = useMutation({
    mutationFn: async (money: z.infer<typeof moneySchema>) => {
      if (initialData) {
        return await editMoney({
          data: {
            current: { ...initialData, ...money },
            prev: initialData,
            totalMoney,
            reason: money.reason,
          },
        });
      }
      return await addMoney({ data: { ...money, totalMoney } });
    },
    onSuccess: () => {
      if (deepView) {
        if (initialData)
          queryClient.invalidateQueries({ queryKey: ["money", initialData.id] });
      } else {
        if (user) queryClient.invalidateQueries({ queryKey: ["moneys", user.id] });
      }
      close();
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const pending = handleMoney.isPending || moneyForm.formState.isSubmitting;

  return (
    <Form {...moneyForm}>
      <form
        onSubmit={moneyForm.handleSubmit((money) => handleMoney.mutate(money))}
        className="space-y-2"
      >
        <FormField
          control={moneyForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  style={{ color: moneyForm.watch("color") ?? "var(--foreground)" }}
                  placeholder="Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={moneyForm.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <MoneyInput
                    style={{ color: moneyForm.watch("color") ?? "var(--foreground)" }}
                    className="w-full"
                    type="number"
                    placeholder="Amount"
                    {...field}
                  />

                  {initialData ? (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Difference:</span>
                      <Amount
                        className={`ml-1 text-sm font-normal ${field.value - initialData.amount === 0 ? "" : field.value - initialData.amount > 0 ? "text-green-500" : "text-destructive"}`}
                        amount={field.value - initialData.amount}
                        settings={{ sign: true }}
                      />
                    </div>
                  ) : null}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={moneyForm.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col items-center gap-2">
                  <ColorPicker color={field.value ?? ""} setColor={field.onChange} />
                  <div className="flex w-full items-center justify-center gap-2">
                    <Input
                      style={{ color: field.value ?? "var(--foreground)" }}
                      className="flex-1"
                      placeholder="Color"
                      {...field}
                      value={field.value ?? ""}
                    />
                    {!initialData && field.value ? (
                      <Button
                        variant={"outline"}
                        size="icon"
                        className="text-muted-foreground"
                        onClick={() => moneyForm.setValue("color", "")}
                      >
                        <RotateCw />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={moneyForm.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  hidden={!initialData}
                  placeholder="Reason (Optional)"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-col gap-2">
          {initialData ? (
            <ActionConfirmDialog
              confirm={moneyForm.handleSubmit((money) => handleMoney.mutate(money))}
              desc="Are you sure to make these changes?"
              title="Edit"
            >
              <Button
                disabled={pending || !moneyForm.formState.isDirty}
                type="button"
                className="flex-1"
              >
                {pending ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </ActionConfirmDialog>
          ) : (
            <Button
              disabled={pending || !moneyForm.formState.isDirty}
              type="submit"
              className="flex-1"
            >
              {pending ? <Loader2 className="animate-spin" /> : "Add"}
            </Button>
          )}

          <DialogClose asChild>
            <Button
              variant={"ghost"}
              className="text-destructive hover:text-destructive-foreground"
              disabled={pending}
              type="button"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
