import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',        // ← ESTA LÍNEA SOLUCIONA LOS ESTILOS EN EL HOSTING
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://padel-gestionado.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
