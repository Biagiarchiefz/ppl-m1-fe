import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      // Saat `npm run dev`, panggilan /api diteruskan ke backend M1
      // sehingga tidak perlu pengaturan CORS di lokal.
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "https://ppl-m1-be-pied.vercel.app",
          changeOrigin: true,
        },
      },
    },
  };
});
