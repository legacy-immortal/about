import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

const pkgRoot = resolve(__dirname);

export default defineConfig({
   base: "/legacyimmortal-marketing/",
   plugins: [
      TanStackRouterVite({
         target: "react",
         routesDirectory: resolve(pkgRoot, "src/routes"),
         generatedRouteTree: resolve(pkgRoot, "src/routeTree.gen.ts"),
         autoCodeSplitting: true,
      }),
      react(),
   ],
   resolve: {
      alias: {
         "~": resolve(pkgRoot, "src"),
      },
   },
   build: {
      outDir: "dist",
   },
});