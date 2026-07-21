import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local-first dev server. Base path set for GitHub Pages project-site deploys
// (repo served at <user>.github.io/ai-projects-showcase/) — change to '/' if
// this ends up on a custom domain or user-site repo instead.
export default defineConfig({
  base: '/ai-projects-showcase/',
  plugins: [react()],
  server: {
    port: 5190,
    open: true,
  },
})
