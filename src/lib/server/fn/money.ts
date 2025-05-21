import { authMiddleware } from "@/lib/middleware/auth-guard";
import { ListState } from "@/lib/stores/list-state";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import _ from "lodash";
import z from "zod";
import { db } from "../db";
import { money } from "../schema/money.schema";
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
  .middleware([authMiddleware])
  .validator((data: Pick<ListState, "flow" | "sortBy">) => data)
  .handler(
    async ({
      data: { flow, sortBy },
      context: {
        user: { id: userId },
      },
    }) => {
      return await db.query.money.findMany({
        where: (money, { eq }) => eq(money.userId, userId),
        orderBy: (money, { asc, desc }) =>
          flow === "asc"
            ? asc(sortBy === "amount" ? money.amount : money.createdAt)
            : desc(sortBy === "amount" ? money.amount : money.createdAt),
      });
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
      return (
        (await db.query.money.findFirst({
          where: (money, { eq, and }) => and(eq(money.userId, userId), eq(money.id, id)),
          with: {
            logsData: true,
          },
        })) ?? null
      );
    },
  );

export const getTotalMoney = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context: {
        user: { id: userId },
      },
    }) => {
      const result = await db.query.money.findMany({
        where: (money, { eq }) => eq(money.userId, userId),
        columns: {
          amount: true,
        },
      });
      return result.reduce((sum, item) => sum + item.amount, 0);
    },
  );

export type Money = Awaited<ReturnType<typeof getMoneys>>[0];

export const addMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(moneySchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: moneyData, context: { user } }) => {
    const insteredMoneyData = await db
      .insert(money)
      .values({
        ...moneyData,
        userId: user.id,
      })
      .returning();
    await addLog({
      data: {
        changes: {
          current: {
            ...insteredMoneyData[0],
            totalMoney: moneyData.totalMoney + moneyData.amount,
          },
          prev: { ...insteredMoneyData[0], totalMoney: moneyData.totalMoney },
        },
        moneyId: insteredMoneyData[0].id,
        type: "add",
        reason: "Add",
      },
    });
  });

export const editMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(editMoneySchema.extend({ totalMoney: z.coerce.number().nonnegative() }))
  .handler(async ({ data: { current, prev, totalMoney, reason }, context: { user } }) => {
    await db
      .update(money)
      .set({
        ...current,
        updatedAt: new Date(),
      })
      .where(and(eq(money.id, current.id), eq(money.userId, user.id)));
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
    await db
      .delete(money)
      .where(and(eq(money.id, moneyData.id), eq(money.userId, user.id)));
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
    await db
      .update(money)
      .set({ ...sender, amount: sender.amount - fees - cashIns })
      .where(and(eq(money.id, sender.id), eq(money.userId, user.id)));
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

    await db.transaction(async (tx) => {
      for (const receiver of receivers) {
        await tx
          .update(money)
          .set({ ...receiver, amount: receiver.amount + (receiver.cashIn ?? 0) })
          .where(and(eq(money.id, receiver.id), eq(money.userId, user.id)));
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
  });
