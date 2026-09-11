import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('@inertiajs')) {
                            return 'vendor-core';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-motion';
                        }
                        if (id.includes('howler')) {
                            return 'vendor-audio';
                        }
                        if (id.includes('canvas-confetti')) {
                            return 'vendor-confetti';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
