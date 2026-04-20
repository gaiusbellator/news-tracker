import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: '/news-tracker/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/news': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '/v2'),
      },
    },
  },
  define: {
    __PROD__: command === 'build',
  },
}))
