import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        include: [
            'src/test/unitTests/**/*.{test,spec}.{js,jsx}',
            'src/test/integrationTests/**/*.{test,spec}.{js,jsx}'
        ],
    },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'react-map-gl': 'react-map-gl/dist/es6/index.js',
        },
    },
})