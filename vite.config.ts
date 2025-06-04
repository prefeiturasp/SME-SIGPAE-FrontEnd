import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), EnvironmentPlugin("all", { prefix: "REACT_APP_" })],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  define: {
    "process.env": {},
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  resolve: {
    alias: {
      src: "/src",
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
}));
