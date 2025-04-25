import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/youtube-browser-react/', // your GitHub repo name
  plugins: [react()],
})
