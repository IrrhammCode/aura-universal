import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name, orgName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create or find the org
    let org = await prisma.organization.findFirst({ where: { id: 'org_default' } });
    if (!org) {
      org = await prisma.organization.create({
        data: { id: 'org_default', name: orgName || 'Default Organization' }
      });
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        passwordHash,
        role: 'ADMIN',
        organizationId: org.id
      }
    });

    // Ensure settings exist for the org
    await prisma.settings.upsert({
      where: { organizationId: org.id },
      update: {},
      create: {
        organizationId: org.id,
        twoFactorAuth: true,
        restrictedRegions: 'None',
        primaryColor: '#06b6d4',
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
