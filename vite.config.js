import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react-dom')) return 'vendor-react';
                    if (id.includes('node_modules/react-router')) return 'vendor-router';
                    if (id.includes('node_modules/react')) return 'vendor-react';
                    if (id.includes('node_modules/@tanstack')) return 'vendor-query';
                    if (id.includes('node_modules')) return 'vendor';
                },
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
