import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    hmr: true,
    proxy: {},
    watch: {
      usePolling: true
    },
    headers: {
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=5'
    }
  }
}); 