import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    })
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@infra": path.resolve(__dirname, "./src/infra"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@routers": path.resolve(__dirname, "./src/routers"),
      "@locale": path.resolve(__dirname, "./src/locale"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'data-grid': ['@components/data-grid'],
          'antd': ['antd'],
          'ag-grid': ['ag-grid-react']
        }
      }
    }
  },
  css: {
  }
});
