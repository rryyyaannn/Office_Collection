import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // servido sob /portal no deploy unificado (landing em / + portal em /portal)
  base: "/portal/",
  plugins: [react()],
  server: { port: 5180, open: false },
});
