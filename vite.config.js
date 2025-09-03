import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import svgr from "vite-plugin-svgr";
dotenv.config()

const target = process.env.BACKEND_ORIGIN

export default defineConfig({
  plugins: [
    svgr({
      enforce: 'pre',                           // 먼저 돌기
      include: ['**/*.svg?react', '**/*.svg?*react'], // ?import&react도 매칭
    }),
    react(),
  ], 
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
