
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs only in production
        drop_debugger: true,
      },
    },
    // Create smaller chunks for better loading on mobile
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-toast',
          ],
          recording: [
            '@hooks/recording/audioProcessing',
            '@hooks/recording/recorderManager',
            '@hooks/recording/soapNoteProcessing',
            '@utils/soapNoteGenerator',
          ],
        },
      },
    },
    // Improve code splitting for Android
    chunkSizeWarningLimit: 1000, // Increase warning limit for mobile bundles
    sourcemap: mode !== 'production', // Only generate sourcemaps in development
  },
  // Optimize for mobile performance
  esbuild: {
    legalComments: 'none', // Remove license comments
    target: ['es2020', 'chrome87'], // Target modern mobile browsers
  }
}));
