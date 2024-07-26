import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateSharedCertificate } from '../shared/generateSharedCertificate'

const { key, cert } = generateSharedCertificate();

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key,
      cert,
    },
    host: true, // This exposes the server to your network
  },
})