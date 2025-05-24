import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";
import { Database } from "./types";
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    "https://caqfoypqaqnvbguueowy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWZveXBxYXFudmJndXVlb3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Mjc5MTgsImV4cCI6MjA2MzUwMzkxOH0.Op5A9-rCPR5ZUgUPTcfd-frZ8clnjcVdfpM-vRDqfKo",
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
    },
  );
}
