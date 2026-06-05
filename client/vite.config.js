import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    // Docker Compose の client からはサービス名 nginx。ホストのみで dev する場合は .env で VITE_API_ORIGIN=http://127.0.0.1:8080 など
    const apiProxyTarget = env.VITE_API_ORIGIN || "http://nginx:80";

    return {
        plugins: [react()],

        server: {
            host: "0.0.0.0",
            port: 5173,
            watch: {
                usePolling: true,
            },
            // ブラウザは同一オリジンで /api を叩き、Vite が apiProxyTarget（nginx 等）へ中継（CORS 回避）
            proxy: {
                "/api": {
                    target: apiProxyTarget,
                    changeOrigin: true,
                },
            },
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
                "Cross-Origin-Embedder-Policy": "require-corp",
            },
        },
    };
});
