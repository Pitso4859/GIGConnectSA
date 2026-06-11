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
      // api.ts BASE is already '/api/v1', so requests arrive as /api/v1/...
      // The backend context-path is /api/v1 — forward the full path unchanged.
      // The old rewrite was doubling the /v1 prefix, causing 404s in dev.
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: { outDir: 'dist' },
});
