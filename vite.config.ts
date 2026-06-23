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
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@arco-design/web-react')) {
            // 将 Arco Design 的 icon 拆为独立 chunk
            if (id.includes('node_modules/@arco-design/web-react/es/icon')) {
              return 'arco-icons'
            }
            // 将 Arco Design 的复杂重型组件（Table/DatePicker/Select/Cascader 等）拆为独立 chunk
            if (
              id.includes('node_modules/@arco-design/web-react/es/Table') ||
              id.includes('node_modules/@arco-design/web-react/es/DatePicker') ||
              id.includes('node_modules/@arco-design/web-react/es/Select') ||
              id.includes('node_modules/@arco-design/web-react/es/Cascader') ||
              id.includes('node_modules/@arco-design/web-react/es/Tree') ||
              id.includes('node_modules/@arco-design/web-react/es/TreeSelect') ||
              id.includes('node_modules/@arco-design/web-react/es/Transfer') ||
              id.includes('node_modules/@arco-design/web-react/es/Calendar') ||
              id.includes('node_modules/@arco-design/web-react/es/TimePicker')
            ) {
              return 'arco-heavy-components'
            }
            // 将 Form/Input/Modal 等中型组件拆出，减轻 arco-design 主 chunk
            if (
              id.includes('node_modules/@arco-design/web-react/es/Form') ||
              id.includes('node_modules/@arco-design/web-react/es/Modal') ||
              id.includes('node_modules/@arco-design/web-react/es/Input') ||
              id.includes('node_modules/@arco-design/web-react/es/Drawer') ||
              id.includes('node_modules/@arco-design/web-react/es/Notification') ||
              id.includes('node_modules/@arco-design/web-react/es/Carousel') ||
              id.includes('node_modules/@arco-design/web-react/es/Image')
            ) {
              return 'arco-form-modal'
            }
            // 其余 Arco Design 组件
            return 'arco-design'
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'react-router'
          }
        },
      },
    },
  },
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
