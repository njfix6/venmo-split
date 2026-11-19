import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Lets the built preview be opened through a forwarded address, not only localhost.
  preview: { allowedHosts: true },
})
