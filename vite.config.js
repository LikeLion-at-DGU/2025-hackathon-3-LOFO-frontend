import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
dotenv.config()

const target = process.env.BACKEND_ORIGIN

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
        rewrite: p => p.replace(/^\/api/, ''),
      },
    },
  },
})
