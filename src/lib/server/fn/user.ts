import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { user } from "../schema";
export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user || null;
});
export type GetUser = Awaited<ReturnType<typeof getUser>>;

export const getUserSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context: {
        user: { id },
      },
    }) => {
      return await db.query.user.findFirst({
        where: eq(user.id, id),
        columns: {
          settings: true,
        },
      });
    },
  );

export type GetUserSettings = Awaited<ReturnType<typeof getUserSettings>>;

export const updateUserSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: (typeof user.$inferSelect)["settings"]) => data)
  .handler(
    async ({
      context: {
        user: { id },
      },
      data,
    }) => {
      await db.update(user).set({ settings: data }).where(eq(user.id, id));
    },
  );
