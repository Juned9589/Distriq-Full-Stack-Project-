import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: 'dist',  //  Render will serve from here
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      },
      // Add this to proxy uploads directly
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  }
})