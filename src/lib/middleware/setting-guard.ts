import { createMiddleware } from "@tanstack/react-start";
import { getSupabaseServerClient } from "../server/supabase";
import { authMiddleware } from "./auth-guard";

// https://tanstack.com/start/latest/docs/framework/react/middleware
// This is a sample middleware that you can use in your server functions.

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const settingMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context: { user } }) => {
    const supabase = getSupabaseServerClient();
    const { data: setting } = await supabase
      .from("setting")
      .select()
      .eq("userId", user.id)
      .single();

    return next({ context: { setting } });
  });
