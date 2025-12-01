import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .js files that may contain JSX so the plugin transforms them
      include: '**/*.{js,jsx,ts,tsx}'
    })
  ]
})
