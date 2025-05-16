import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, or whatever framework you're using

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Ensure base path is set correctly (usually '/' for Vercel)
  base: '/',
})