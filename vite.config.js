import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // 👈 force IPv4 localhost
    port: 5173         // change to 5174 if you prefer
  }
})
