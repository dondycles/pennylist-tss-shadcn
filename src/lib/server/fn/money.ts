import { authMiddleware } from "@/lib/middleware/auth-guard";
import { settingMiddleware } from "@/lib/middleware/setting-guard";
import { createServerFn } from "@tanstack/react-start";
import _ from "lodash";
import z from "zod";
import { getSupabaseServerClient } from "../supabase";
import { addLog } from "./logs";

export const moneySchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  color: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
});
export const moneyWithIdSchema = moneySchema.extend({ id: z.string() });
export const moneyWithTransferDetailsSchema = moneySchema.extend({
  id: z.string(),
  cashIn: z.coerce.number().nonnegative().optional(),
  fee: z.number().optional(),
});
export const transferSchema = z.object({
  sender: moneyWithTransferDetailsSchema,
  receivers: z.array(moneyWithTransferDetailsSchema),
});
export const editMoneySchema = z.object({
  prev: moneyWithIdSchema.omit({ reason: true }),
  current: moneyWithIdSchema.omit({ reason: true }),
  reason: z.string().optional().nullable(),
});
export const getMoneys = createServerFn({ method: "GET" })
  .middleware([authMiddleware, settingMiddleware])
  .handler(
    async ({
      context: {
        user: { id: userId },
        setting,
      },
    }) => {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("money").select().eq("userId", userId);
      if (!setting) {
        query = query.order("created_at", {
          ascending: false,
        });
      } else {
        if (setting.sortBy === "amount") {
          query = query.order("amount", {
            ascending: setting.flow === "asc" ? true : false,
          });
        } else {
          query = query.order("created_at", {
            ascending: setting.flow === "asc" ? true : false,
          });
        }
      }
      const { data, error } = await query;
      if (error) throw new Error(JSON.stringify(error, null, 2));
      return data;
    },
  );

export const getMoney = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(
    async ({
      context: {
        user: { id: userId },
      },
      data: id,
    }) => {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("money")
        .select("*, log(*)")
        .eq("userId", userId)
        .eq("id", id)
        .single();
      if (error) throw new Error(JSON.stringify(error, null, 2));

      return data;
    },
  );

export const addMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(moneySchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: moneyData }) => {
    const supabase = getSupabaseServerClient();
    const { data: insteredMoneyData, error } = await supabase
      .from("money")
      .insert({
        name: moneyData.name,
        amount: moneyData.amount,
        color: moneyData.color,
      })
      .select()
      .single();
    if (error) throw new Error(JSON.stringify(error, null, 2));

    if (insteredMoneyData)
      await addLog({
        data: {
          changes: {
            current: {
              ...insteredMoneyData,
              totalMoney: moneyData.totalMoney + moneyData.amount,
            },
            prev: { ...insteredMoneyData, totalMoney: moneyData.totalMoney },
          },
          moneyId: insteredMoneyData.id,
          type: "add",
          reason: "Add",
        },
      });
  });

export const editMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(editMoneySchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: { current, prev, totalMoney, reason }, context: { user } }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("money")
      .update({
        ...current,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .eq("userId", user.id);
    if (error) throw new Error(JSON.stringify(error, null, 2));

    await addLog({
      data: {
        changes: {
          current: {
            ...current,
            totalMoney: totalMoney + (current.amount - prev.amount),
          },
          prev: { ...prev, totalMoney },
        },
        moneyId: current.id,
        type: "edit",
        reason: reason ?? undefined,
      },
    });
  });

export const deleteMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(moneyWithIdSchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: moneyData, context: { user } }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("money")
      .delete()
      .eq("id", moneyData.id)
      .eq("userId", user.id);
    if (error) throw new Error(JSON.stringify(error, null, 2));

    await addLog({
      data: {
        changes: {
          current: {
            amount: 0,
            name: "",
            color: "",
            totalMoney: moneyData.totalMoney - moneyData.amount,
          },
          prev: moneyData,
        },
        moneyId: moneyData.id,
        type: "edit",
        reason: "Deletion",
      },
    });
  });

export const transferMoneys = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(transferSchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: { receivers, sender, totalMoney }, context: { user } }) => {
    const fees = _.sum(receivers.map((r) => r.fee ?? 0));
    const cashIns = _.sum(receivers.map((r) => r.cashIn ?? 0));
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("money")
      .update({
        ...sender,
        amount: sender.amount - fees - cashIns,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sender.id)
      .eq("userId", user.id);
    if (error) throw new Error(JSON.stringify(error, null, 2));

    await addLog({
      data: {
        changes: {
          current: {
            ...sender,
            amount: sender.amount - fees - cashIns,
            totalMoney: totalMoney - fees,
          },
          prev: { ...sender, totalMoney },
        },
        moneyId: sender.id,
        type: "transfer",
        reason: sender.reason ?? undefined,
        transferDetails: {
          receivers,
          sender,
        },
      },
    });

    for (const receiver of receivers) {
      const { error } = await supabase
        .from("money")
        .update({
          ...receiver,
          amount: receiver.amount + (receiver.cashIn ?? 0),
          updated_at: new Date().toISOString(),
        })
        .eq("id", receiver.id)
        .eq("userId", user.id);
      if (error) throw new Error(JSON.stringify(error, null, 2));

      await addLog({
        data: {
          changes: {
            current: {
              ...receiver,
              amount: receiver.amount + (receiver.cashIn ?? 0),
              totalMoney: totalMoney - fees,
            },
            prev: { ...receiver, totalMoney: totalMoney },
          },
          moneyId: receiver.id,
          type: "transfer",
          reason: receiver.reason ?? undefined,
          transferDetails: {
            receivers,
            sender,
          },
        },
      });
    }
  });
