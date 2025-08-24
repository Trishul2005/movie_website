import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configure the development server to proxy API requests to the backend
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }

})
