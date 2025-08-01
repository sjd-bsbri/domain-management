import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/domain-management/',
  server: {
    port: 3000,
    open: true,
  },
}) 