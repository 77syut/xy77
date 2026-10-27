import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { dedupe: ['three'] },
  server: { host: true, port: 5173 },
})
