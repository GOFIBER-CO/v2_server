import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: { host: 'localhost' },
        host: true,
        port: 8078,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})
