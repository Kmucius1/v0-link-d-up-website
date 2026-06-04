import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '.env.local') })

// Always use DATABASE_URL (pooler) — DIRECT_URL (port 5432) is blocked on some networks
const migrationUrl = process.env.DATABASE_URL!

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
})
