// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      }),
      tailwindcss(),
      // VitePWA({
      //   strategies: "generateSW",
      //   injectRegister: "script",
      //   includeAssets: ["favicon.ico", "icon-512.png", "icon-256.png"],
      //   manifest: {
      //     name: "pennylist.",
      //     short_name: "pennylist.",
      //     description: "Avoid becoming penniless, start using pennylist.",
      //     start_url: "/",
      //     scope: "/",
      //     display: "standalone",
      //     display_override: ["standalone"],
      //     background_color: "#000000",
      //     theme_color: "#000000",
      //     icons: [
      //       {
      //         src: "/favicon.ico",
      //         sizes: "any",
      //         type: "image/x-icon",
      //       },
      //       {
      //         src: "/icon-512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //         purpose: "maskable",
      //       },
      //       {
      //         src: "/icon-256.png",
      //         sizes: "256x256",
      //         type: "image/png",
      //         purpose: "any",
      //       },
      //     ],
      //   },
      //   workbox: {
      //     runtimeCaching: [
      //       {
      //         urlPattern: /.*/i,
      //         handler: "CacheFirst",
      //         options: {
      //           cacheableResponse: {
      //             statuses: [0, 200],
      //           },
      //         },
      //       },
      //     ],
      //     skipWaiting: true,
      //     clientsClaim: true,
      //     navigationPreload: true,
      //   },
      // }),
      serwist({
        swSrc: "src/sw.ts",
        swDest: "sw.js",
        globDirectory: "dist",
        injectionPoint: "self.__SW_MANIFEST",
        rollupFormat: "iife"
      })
    ]
  },
  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19"
          }
        ]
      ]
    }
  },
  tsr: {
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src"
  },
  server: {
    // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
    // preset: "netlify",
  }
});
export {
  app_config_default as default
};
