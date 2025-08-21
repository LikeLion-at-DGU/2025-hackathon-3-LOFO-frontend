import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.BACKEND_ORIGIN, // .env 값 그대로 사용
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: 'localhost',
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  }
})
