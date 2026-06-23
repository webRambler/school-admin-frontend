import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePluginForArco } from '@arco-plugins/vite-react'

export default defineConfig({
  css: {
    transformer: 'postcss',
  },
  plugins: [
    react(),
    vitePluginForArco({
      style: "css"
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
