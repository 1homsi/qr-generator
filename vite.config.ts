import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "QR Generator",
        short_name: "QR Gen",
        description: "Generate & customize QR codes for any purpose",
        theme_color: "#4583c4",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/qr-generator/",
        scope: "/qr-generator/",
        icons: [
          {
            src: "icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  base: "/qr-generator/",
});
