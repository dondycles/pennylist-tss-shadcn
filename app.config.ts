import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import { VitePWA } from "vite-plugin-pwa";
import tsConfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      VitePWA({
        injectRegister: "script",
        manifest: {
          name: "pennylist.",
          short_name: "pennylist.",
          description: "Avoid becoming penniless, start using pennylist.",
          start_url: "/",
          scope: "/",
          display: "fullscreen",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: "/favicon.ico",
              sizes: "any",
              type: "image/x-icon",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/icon-256.png",
              sizes: "256x256",
              type: "image/png",
              purpose: "any",
            },
          ],
        },
        devOptions: { enabled: true },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: ({ url }) => {
                return url.pathname.startsWith("/api");
              },
              handler: "CacheFirst",
              options: {
                cacheName: "api-cache",
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
  },
  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19",
          },
        ],
      ],
    },
  },

  tsr: {
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src",
  },

  server: {
    // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
    // preset: "netlify",
  },
});
