/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@blueprints': path.resolve(__dirname, './src/blueprints'),
      '@components': path.resolve(__dirname, './src/components'),
      '@designer': path.resolve(__dirname, './src/designer'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@modals': path.resolve(__dirname, './src/modals'),
      '@mutations': path.resolve(__dirname, './src/mutations'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@sidebars': path.resolve(__dirname, './src/sidebars'),
      '@state': path.resolve(__dirname, './src/state'),
      '@storage': path.resolve(__dirname, './src/storage'),
      '@sync': path.resolve(__dirname, './src/sync'),
      '@tabs': path.resolve(__dirname, './src/tabs'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
