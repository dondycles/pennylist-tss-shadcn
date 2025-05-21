import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { log } from "../schema";

const moneySchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  color: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
});
export const logSchema = z.object({
  moneyId: z.string(),
  type: z.enum(["edit", "transfer", "delete", "add"]),
  changes: z.object({
    prev: moneySchema
      .omit({ reason: true })
      .extend({ totalMoney: z.coerce.number().nonnegative().default(0) }),
    current: moneySchema
      .omit({ reason: true })
      .extend({ totalMoney: z.coerce.number().nonnegative().default(0) }),
  }),
  reason: z.string().optional(),
  transferDetails: z
    .object({
      sender: moneySchema.omit({ reason: true }).extend({ id: z.string() }),
      receivers: z.array(
        moneySchema.omit({ reason: true }).extend({
          fee: z.coerce.number().nonnegative().optional().nullable(),
          cashIn: z.coerce.number().nonnegative().optional().nullable(),
          id: z.string(),
        }),
      ),
    })
    .optional()
    .nullable(),
});

export const addLog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(logSchema)
  .handler(async ({ data, context: { user } }) => {
    await db.insert(log).values({ ...data, userId: user.id });
  });

export const getLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: { user } }) => {
    return await db.query.log.findMany({
      where: (log, { eq }) => eq(log.userId, user.id),
      orderBy: (log, { desc }) => [desc(log.createdAt)],
      with: {
        moneyData: true,
      },
    });
  });

export type Logs = NonNullable<Awaited<ReturnType<typeof getLogs>>>;
