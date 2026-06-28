import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter } as never)

async function main() {
  const email = process.env.SEED_EMAIL || 'admin@linkdup.club'
  const password = process.env.SEED_PASSWORD || 'linkdup2024!'
  const name = process.env.SEED_NAME || 'LinkDup Admin'

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin already exists: ${email}`)
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({ data: { email, password: hashed, name } })
  console.log(`Created admin: ${admin.email} (id: ${admin.id})`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
