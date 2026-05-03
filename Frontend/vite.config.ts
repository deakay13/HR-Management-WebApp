import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from the parent directory
  const env = loadEnv(mode, '../', '');

  return {
    envDir: '../',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: Number(env.FRONTEND_PORT) || 3000,
    },
    test: {
      exclude: ['e2e/*', 'node_modules/**/*'],
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: false,
      coverage: {
        provider: 'v8',
        all: true,
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: [
          'src/test/**/*', 
          'src/main.tsx', 
          'src/vite-env.d.ts', 
          'src/components/ui/**/*', // Không test code sinh ra từ thư viện shadcn/ui
          'src/types/**/*',         // Không test Type definitions
        ],
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 99,
          functions: 99,
          branches: 99,
          statements: 99,
        },
      },
    },
  };
});
