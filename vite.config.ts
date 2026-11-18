import { defineConfig } from 'vite'
import { geaPlugin } from '@geajs/vite-plugin'

// User site (himmetcanumutlu.github.io) is served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [geaPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: false,
    modulePreload: { polyfill: false },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
})
