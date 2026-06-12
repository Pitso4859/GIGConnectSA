import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      // Local dev: proxy /api/v1/* to backend at localhost:8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // No rewrite needed — backend context-path is /api/v1
        // and frontend calls /api/v1/... directly
      },
    },
  },
  build: { outDir: 'dist' },
});
