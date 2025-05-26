import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "../supabase";
import { Database } from "../supabase/types";
export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  return {
    email: user.email,
    id: user.id,
    createdAt: user.created_at,
  };
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
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("setting").select().eq("userId", id);
      if (error) throw new Error(JSON.stringify(error, null, 2));
      return data[0];
    },
  );

export type GetUserSettings = Awaited<ReturnType<typeof getUserSettings>>;

export const updateUserSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Database["public"]["Tables"]["setting"]["Insert"]) => data)
  .handler(
    async ({
      context: {
        user: { id },
      },
      data,
    }) => {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase
        .from("setting")
        .upsert({
          asterisk: data.asterisk,
          flow: data.flow,
          sortBy: data.sortBy,
          theme: data.theme,
          id: id,
          updated_at: new Date().toISOString(),
          PIN: data.PIN,
        })
        .eq("userId", id);
      if (error) throw new Error(JSON.stringify(error, null, 2));
    },
  );

export const initiateUserSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context: {
        user: { id },
      },
    }) => {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("setting").insert({
        asterisk: false,
        flow: "desc",
        sortBy: "date",
        theme: "dark",
        updated_at: new Date().toISOString(),
        userId: id,
      });
      if (error) throw new Error(JSON.stringify(error, null, 2));
    },
  );

export const getUserPIN = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context: {
        user: { id },
      },
    }) => {
      const supabase = getSupabaseServerClient();
      const { error, data } = await supabase
        .from("setting")
        .select("PIN")
        .eq("userId", id)
        .single();
      if (error) throw new Error(JSON.stringify(error, null, 2));
      return data;
    },
  );
