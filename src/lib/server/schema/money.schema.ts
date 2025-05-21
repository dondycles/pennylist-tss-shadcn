import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const money = pgTable("money", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID())
    .notNull(),
  name: text("name").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").$default(() => new Date()),
  updatedAt: timestamp("updated_at").$default(() => new Date()),
  color: text("color"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
