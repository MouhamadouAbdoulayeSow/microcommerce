import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// In development, /api is proxied to the Spring Boot API on port 9090,
// so the browser never needs CORS. In production, set VITE_API_URL.
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9090",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
