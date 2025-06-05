import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";
import { Database } from "./types";
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(parseCookies()).map(([name, value]) => ({
            name,
            value,
          }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value);
          });
        },
      },
      auth: {
        persistSession: true,
        storage: {
          getItem: (key) => {
            const cookies = parseCookies();
            return cookies[key] || null;
          },
          setItem: (key, value) => {
            setCookie(key, value);
          },
          removeItem: (key) => {
            setCookie(key, "", { expires: new Date(0) });
          },
        },
        storageKey: "supabase.auth.token",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}
