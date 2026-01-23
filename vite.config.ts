import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: mode === 'development' ? [
      { find: '@apps-in-toss/web-bridge', replacement: path.resolve(__dirname, './src/mocks/webBridge.ts') }
    ] : []
  }
}))
