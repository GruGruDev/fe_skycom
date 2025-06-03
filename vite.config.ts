import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");

  return {
    plugins: [
      mdx.default(),
      react(),
      checker({
        // e.g. use TypeScript check
        typescript: true,
        enableBuild: false,
      }),
    ],
    resolve: {
      alias: {
        utils: path.resolve(__dirname, "src/utils"),
        types: path.resolve(__dirname, "src/types"),
        assets: path.resolve(__dirname, "src/assets"),
        apis: path.resolve(__dirname, "src/apis"),
        constants: path.resolve(__dirname, "src/constants"),
        components: path.resolve(__dirname, "src/components"),
        hooks: path.resolve(__dirname, "src/hooks"),
        store: path.resolve(__dirname, "src/store"),
        providers: path.resolve(__dirname, "src/providers"),
        routers: path.resolve(__dirname, "src/routers"),
        layout: path.resolve(__dirname, "src/layout"),
        views: path.resolve(__dirname, "src/views"),
        theme: path.resolve(__dirname, "src/theme"),
        services: path.resolve(__dirname, "src/services"),
        validations: path.resolve(__dirname, "src/validations"),
      },
    },
    build: {
      outDir: "build",
      sourcemap: false,
    },
    envPrefix: "REACT_APP_",
    server: {
      port: 3000,
    },
  };
});
