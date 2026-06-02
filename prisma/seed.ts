import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'linkdup2024!'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@linkdup.club' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@linkdup.club',
      password: hashedPassword,
      name: "LINK'D UP Admin",
    },
  })
  console.log('Admin user created:', admin.email)

  // Seed June 4th event
  const event = await prisma.event.upsert({
    where: { eventSlug: 'june-4th-2026' },
    update: {},
    create: {
      eventName: "LINK'D UP — June 4th",
      eventSlug: 'june-4th-2026',
      eventDate: new Date('2026-06-04T19:00:00.000Z'),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      locationName: 'The Ring Workspace',
      address: '600 Cleveland St, Clearwater, FL',
      description: "A night of networking, art, live music, and community for artists, creators, entrepreneurs, and professionals. Beer, wine, and good people.",
      rsvpLink: 'https://linkdup.club/rsvp',
      facebookEventLink: 'https://www.facebook.com',
      status: 'live',
    },
  })
  console.log('Event seeded:', event.eventName)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
