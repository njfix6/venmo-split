import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Listen on all interfaces so `npm run dev` / `npm run preview` can be
  // opened from a phone on the same Wi-Fi (Vite prints the Network URL).
  server: { host: true },
  preview: { host: true },
});
