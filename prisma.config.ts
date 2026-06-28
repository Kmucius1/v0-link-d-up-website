import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '.env.local') })

const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL!

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
})
