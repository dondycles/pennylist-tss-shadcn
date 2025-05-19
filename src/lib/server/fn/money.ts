import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { money } from "../schema/money.schema";

export const moneySchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().min(1),
  color: z.string().optional(),
});

export const getMoneys = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context: {
        user: { id: userId },
      },
    }) => {
      return await db.query.money.findMany({
        where: (money, { eq }) => eq(money.userId, userId),
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
  .validator(moneySchema)
  .handler(async ({ data: moneyData, context: { user } }) => {
    await db.insert(money).values({
      ...moneyData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
    });
  });

export const editMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(moneySchema.extend({ id: z.string() }))
  .handler(async ({ data: moneyData, context: { user } }) => {
    await db
      .update(money)
      .set({
        ...moneyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(money.id, moneyData.id), eq(money.userId, user.id)));
  });

export const deleteMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(moneySchema.extend({ id: z.string() }))
  .handler(async ({ data: moneyData, context: { user } }) => {
    await db
      .delete(money)
      .where(and(eq(money.id, moneyData.id), eq(money.userId, user.id)));
  });
