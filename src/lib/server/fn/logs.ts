import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "../supabase";

const baseMoneySchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  color: z.string().optional().nullable(),
});

const moneyWithTotalSchema = baseMoneySchema.extend({
  totalMoney: z.coerce.number().nonnegative().default(0),
});

const senderSchema = baseMoneySchema.extend({
  id: z.string(),
});

const receiverSchema = baseMoneySchema.extend({
  fee: z.coerce.number().nonnegative().optional().nullable(),
  cashIn: z.coerce.number().nonnegative().optional().nullable(),
  id: z.string(),
});

export const logSchema = z.object({
  moneyId: z.string(),
  type: z.enum(["edit", "transfer", "delete", "add"]),
  changes: z.object({
    prev: moneyWithTotalSchema,
    current: moneyWithTotalSchema,
  }),
  reason: z.string().optional(),
  transferDetails: z
    .object({
      sender: senderSchema,
      receivers: z.array(receiverSchema),
    })
    .optional()
    .nullable(),
});

export const addLog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(logSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("log").insert(data);
    if (error) throw new Error(JSON.stringify(error, null, 2));
  });

export const getLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      flow?: "asc" | "desc";
      type?: "add" | "edit" | "delete" | "transfer";
      money?: string;
      q?: string;
      pageParam?: number;
    }) => data,
  )
  .handler(async ({ context: { user }, data: { flow, type, money, q, pageParam } }) => {
    const supabase = getSupabaseServerClient();
    const page = typeof pageParam === "number" ? pageParam : 0;
    let query = supabase
      .from("log")
      .select("*, money!inner(*)")
      .eq("userId", user.id)
      .order("created_at", {
        ascending: flow === "asc" ? true : false,
      })
      .range(page * 4, page * 4 + 3);

    if (q) {
      query = query.ilike("type", `%${q}%`);
    }
    if (type) {
      query = query.ilike("type", `%${type}%`);
    }
    if (money) {
      query = query.ilike("money.name", `%${money}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(JSON.stringify(error, null, 2));
    return data;
  });
