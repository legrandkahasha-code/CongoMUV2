// vite.config.ts
import { defineConfig } from "file:///C:/Users/LEGRAND/Downloads/CongoMuv/project/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/LEGRAND/Downloads/CongoMuv/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\LEGRAND\\Downloads\\CongoMuv\\project";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Alias pour les imports absolus
      { find: "@", replacement: path.resolve(__vite_injected_original_dirname, "./src") },
      { find: "@components", replacement: path.resolve(__vite_injected_original_dirname, "./src/components") },
      { find: "@lib", replacement: path.resolve(__vite_injected_original_dirname, "./src/lib") },
      { find: "@pages", replacement: path.resolve(__vite_injected_original_dirname, "./src/pages") }
    ]
  },
  optimizeDeps: {
    exclude: ["lucide-react", "@ark-ui/react"],
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-i18next",
      "i18next",
      "date-fns",
      "leaflet",
      "qrcode",
      "react-hook-form",
      "react-icons",
      "framer-motion",
      "react-toastify",
      "@emotion/react",
      "@emotion/styled"
    ]
    // Removed '@supabase/supabase-js' if not critical
  },
  server: {
    watch: {
      usePolling: false,
      // Disabled polling for better performance
      ignored: [
        "**/backend/**",
        "**/database/**",
        "**/dist/**"
      ]
    },
    proxy: {}
  },
  cacheDir: "./node_modules/.vite",
  // Added cache directory for faster rebuilds
  json: {
    stringify: true
  },
  logLevel: "info"
  // Added log level for better diagnostics
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRUdSQU5EXFxcXERvd25sb2Fkc1xcXFxDb25nb011dlxcXFxwcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRUdSQU5EXFxcXERvd25sb2Fkc1xcXFxDb25nb011dlxcXFxwcm9qZWN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MRUdSQU5EL0Rvd25sb2Fkcy9Db25nb011di9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIE9wdGltaXplZCBWaXRlIGNvbmZpZ3VyYXRpb24gZm9yIGZhc3RlciBzdGFydHVwLlxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIC8vIEFsaWFzIHBvdXIgbGVzIGltcG9ydHMgYWJzb2x1c1xuICAgICAgeyBmaW5kOiAnQCcsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSB9LFxuICAgICAgeyBmaW5kOiAnQGNvbXBvbmVudHMnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSB9LFxuICAgICAgeyBmaW5kOiAnQGxpYicsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbGliJykgfSxcbiAgICAgIHsgZmluZDogJ0BwYWdlcycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSB9LFxuICAgIF0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0JywgJ0BhcmstdWkvcmVhY3QnXSxcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAncmVhY3QtaTE4bmV4dCcsXG4gICAgICAnaTE4bmV4dCcsXG4gICAgICAnZGF0ZS1mbnMnLFxuICAgICAgJ2xlYWZsZXQnLFxuICAgICAgJ3FyY29kZScsXG4gICAgICAncmVhY3QtaG9vay1mb3JtJyxcbiAgICAgICdyZWFjdC1pY29ucycsXG4gICAgICAnZnJhbWVyLW1vdGlvbicsXG4gICAgICAncmVhY3QtdG9hc3RpZnknLFxuICAgICAgJ0BlbW90aW9uL3JlYWN0JyxcbiAgICAgICdAZW1vdGlvbi9zdHlsZWQnLFxuICAgIF0sIC8vIFJlbW92ZWQgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycgaWYgbm90IGNyaXRpY2FsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiBmYWxzZSwgLy8gRGlzYWJsZWQgcG9sbGluZyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgICBpZ25vcmVkOiBbXG4gICAgICAgICcqKi9iYWNrZW5kLyoqJyxcbiAgICAgICAgJyoqL2RhdGFiYXNlLyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHByb3h5OiB7fSxcbiAgfSxcbiAgY2FjaGVEaXI6ICcuL25vZGVfbW9kdWxlcy8udml0ZScsIC8vIEFkZGVkIGNhY2hlIGRpcmVjdG9yeSBmb3IgZmFzdGVyIHJlYnVpbGRzXG4gIGpzb246IHtcbiAgICBzdHJpbmdpZnk6IHRydWUsXG4gIH0sXG4gIGxvZ0xldmVsOiAnaW5mbycsIC8vIEFkZGVkIGxvZyBsZXZlbCBmb3IgYmV0dGVyIGRpYWdub3N0aWNzXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1QsU0FBUyxvQkFBb0I7QUFDNVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxFQUFFLE1BQU0sS0FBSyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxPQUFPLEVBQUU7QUFBQSxNQUMzRCxFQUFFLE1BQU0sZUFBZSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0IsRUFBRTtBQUFBLE1BQ2hGLEVBQUUsTUFBTSxRQUFRLGFBQWEsS0FBSyxRQUFRLGtDQUFXLFdBQVcsRUFBRTtBQUFBLE1BQ2xFLEVBQUUsTUFBTSxVQUFVLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGFBQWEsRUFBRTtBQUFBLElBQ3hFO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGdCQUFnQixlQUFlO0FBQUEsSUFDekMsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU8sQ0FBQztBQUFBLEVBQ1Y7QUFBQSxFQUNBLFVBQVU7QUFBQTtBQUFBLEVBQ1YsTUFBTTtBQUFBLElBQ0osV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFVBQVU7QUFBQTtBQUNaLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
