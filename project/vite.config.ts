import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Optimized Vite configuration for faster startup.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Alias pour les imports absolus
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@lib', replacement: path.resolve(__dirname, './src/lib') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
    ],
  },
  optimizeDeps: {
    exclude: ['lucide-react', '@ark-ui/react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'date-fns',
      'leaflet',
      'qrcode',
      'react-hook-form',
      'react-icons',
      'framer-motion',
      'react-toastify',
      '@emotion/react',
      '@emotion/styled',
    ], // Removed '@supabase/supabase-js' if not critical
  },
  server: {
    watch: {
      usePolling: false, // Disabled polling for better performance
      ignored: [
        '**/backend/**',
        '**/database/**',
        '**/dist/**',
      ],
    },
    proxy: {},
  },
  cacheDir: './node_modules/.vite', // Added cache directory for faster rebuilds
  json: {
    stringify: true,
  },
  logLevel: 'info', // Added log level for better diagnostics
});
