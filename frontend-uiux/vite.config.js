import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext', // Support top-level await and modern JS features
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  esbuild: {
    target: 'esnext', // Enable top-level await support
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // Support top-level await in dependencies
    },
    exclude: ['@aztec/bb.js'], // Exclude problematic ZK libraries from pre-bundling
  },
  define: {
    global: 'globalThis', // Fix for libraries expecting global
  },
})
