import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: "popup.html", // HTML file for popup
        background: "src/background.ts", // TypeScript background script
        content: "src/content.ts",
      },
      output: {
        dir: "dist", // Output folder for compiled files
        format: "esm", // Use ES module format
      },
    },
  },
});
