import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    envPrefix: 'VUE_',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '_c': path.resolve(__dirname, 'src/components'),
            '_s': path.resolve(__dirname, 'src/store'),
            '_v': path.resolve(__dirname, 'src/views'),
            '@img': path.resolve(__dirname, 'src/assets/images')
        }
    },
    server: {
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3002/admin/', // 代理接口
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    },
    plugins: [vue()],
    define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
    }
})
