import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/queries/user";
import { getUser } from "@/lib/server/fn/user";
import appCss from "@/lib/styles/app.css?url";
import { useEffect } from "react";
import { getSerwist } from "virtual:serwist";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof getUser>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(userQueryOptions());
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "pennylist.",
      },
      {
        name: "description",
        content: "Avoid becoming penniless, start using pennylist.",
      },
      { name: "theme-color", content: "#000000" },
      { name: "background-color", content: "#000000" },
      { name: "display", content: "standalone" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/icon-256.png", sizes: "256x256" },
      { rel: "mask-icon", href: "/icon-512.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  useEffect(() => {
    let serwist: Awaited<ReturnType<typeof getSerwist>> | undefined;
    const onInstalled = () => {
      console.log("Serwist installed!");
    };

    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        serwist = await getSerwist();

        serwist?.addEventListener("installed", onInstalled);

        void serwist?.register();
      }
    };

    loadSerwist();

    return () => {
      serwist?.removeEventListener("installed", onInstalled);
    };
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground lexend h-dvh antialiased">
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>
        {children}
        <Toaster richColors />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
