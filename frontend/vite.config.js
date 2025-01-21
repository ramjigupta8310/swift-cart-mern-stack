import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build:{
    outDir:'dist' // This will create the production build in the 'dist' folder
  },
  server: {
    historyApiFallback: true,  // Enable history fallback (for single-page apps)
  },
})
