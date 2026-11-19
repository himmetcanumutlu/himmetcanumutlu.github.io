import { defineConfig } from 'vite'
import { geaPlugin } from '@geajs/vite-plugin'

// The user site is served from the domain root; preview branches are built
// with BASE_PATH=/<branch>/ and published under that subpath.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
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
