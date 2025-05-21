import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { moneySchema } from "../fn/money";
import { user } from "./auth.schema";
import { money } from "./money.schema";

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
      prev: z.infer<typeof moneySchema> & { totalMoney: number };
      current: z.infer<typeof moneySchema> & { totalMoney: number };
    }>()
    .notNull(),
});
