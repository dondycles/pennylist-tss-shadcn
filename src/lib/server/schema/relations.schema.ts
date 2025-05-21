import { relations } from "drizzle-orm";
import { log } from "./logs.schema";
import { money } from "./money.schema";

export const moneyRelations = relations(money, ({ many }) => ({
  logsData: many(log),
}));
export const logRelations = relations(log, ({ one }) => ({
  moneyData: one(money, {
    fields: [log.moneyId],
    references: [money.id],
  }),
}));
