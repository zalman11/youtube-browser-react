import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/youtube-browser-react/',
  plugins: [react()],
})