import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      '@aquagentic/core-game': path.resolve(__dirname, '../../packages/core-game/src/index.ts')
    }
  },
  optimizeDeps: {
    exclude: ['@aquagentic/core-game']
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    target: 'esnext'
  }
});
