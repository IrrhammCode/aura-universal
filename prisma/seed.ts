import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting neural seeding...')

  // 1. Create Default Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org_default' },
    update: {},
    create: {
      id: 'org_default',
      name: 'AURA Neural Systems',
    },
  })
  console.log('✅ Organization created:', org.name)

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10)
  const admin = await (prisma.user as any).upsert({
    where: { email: 'admin@aura.ai' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: 'admin@aura.ai',
      name: 'Neural Admin',
      role: 'ADMIN',
      passwordHash: hashedPassword,
      organizationId: org.id,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 3. Create Default Settings
  await prisma.settings.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      primaryColor: '#06b6d4',
      twoFactorAuth: false,
    },
  })
  console.log('✅ System settings initialized')

  console.log('✨ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
