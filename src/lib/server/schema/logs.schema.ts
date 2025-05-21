import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { moneySchema } from "../fn/money";
import { user } from "./auth.schema";
import { money } from "./money.schema";

type MoneyPrimaryDataOnly = Omit<z.infer<typeof moneySchema>, "reason">;

export const log = pgTable("log", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID())
    .notNull(),
  createdAt: timestamp("created_at").$default(() => new Date()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  moneyId: text("moneyId").references(() => money.id, { onDelete: "set null" }),
  type: text("type").$type<"edit" | "transfer" | "delete" | "add">().notNull(),
  reason: text("reason"),
  changes: jsonb("changes")
    .$type<{
      prev: MoneyPrimaryDataOnly & { totalMoney: number };
      current: MoneyPrimaryDataOnly & { totalMoney: number };
    }>()
    .notNull(),
  transferDetails: jsonb("transferDetails").$type<{
    sender: MoneyPrimaryDataOnly & { id: string };
    receivers: (MoneyPrimaryDataOnly & {
      id: string;
      fee?: number | null;
      cashIn?: number | null;
    })[];
  }>(),
});
