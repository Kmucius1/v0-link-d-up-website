import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Prisma CLI only reads .env by default — load .env.local too
config({ path: resolve(__dirname, '.env.local') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
