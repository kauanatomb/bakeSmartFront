import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

const env = config().parsed;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // define as variáveis de ambiente para o código do aplicativo
    'process.env': JSON.stringify(env)
  }
})
