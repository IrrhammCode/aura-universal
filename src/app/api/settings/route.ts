import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ORG_ID = "org_default"; // Mock single tenant for now

export async function GET() {
  try {
    // Ensure mock org exists
    let org = await prisma.organization.findUnique({ where: { id: ORG_ID } });
    if (!org) {
      org = await prisma.organization.create({ data: { id: ORG_ID, name: "Default Org" } });
    }

    let settings = await prisma.settings.findUnique({ where: { organizationId: ORG_ID } });
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          organizationId: ORG_ID,
          twoFactorAuth: true,
          restrictedRegions: 'None',
          primaryColor: '#06b6d4',
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newSettings = await req.json();
    
    // Ensure mock org exists
    let org = await prisma.organization.findUnique({ where: { id: ORG_ID } });
    if (!org) {
      org = await prisma.organization.create({ data: { id: ORG_ID, name: "Default Org" } });
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { organizationId: ORG_ID },
      update: {
        heygenKey: newSettings.heygenKey,
        elevenLabsKey: newSettings.elevenLabsKey,
        falKey: newSettings.falKey,
        openAiKey: newSettings.openAiKey,
        twoFactorAuth: newSettings.twoFactorAuth ?? true,
        restrictedRegions: newSettings.restrictedRegions ?? 'None',
        companyLogo: newSettings.companyLogo,
        primaryColor: newSettings.primaryColor ?? '#06b6d4',
        calendlyUrl: newSettings.calendlyUrl
      },
      create: {
        organizationId: ORG_ID,
        heygenKey: newSettings.heygenKey,
        elevenLabsKey: newSettings.elevenLabsKey,
        falKey: newSettings.falKey,
        openAiKey: newSettings.openAiKey,
        twoFactorAuth: newSettings.twoFactorAuth ?? true,
        restrictedRegions: newSettings.restrictedRegions ?? 'None',
        companyLogo: newSettings.companyLogo,
        primaryColor: newSettings.primaryColor ?? '#06b6d4',
        calendlyUrl: newSettings.calendlyUrl
      }
    });

    // Optional: If we want to dynamically override process.env for the current Node process
    if (updatedSettings.heygenKey) process.env.NEXT_PUBLIC_HEYGEN_API_KEY = updatedSettings.heygenKey;
    if (updatedSettings.elevenLabsKey) process.env.ELEVENLABS_API_KEY = updatedSettings.elevenLabsKey;
    if (updatedSettings.falKey) process.env.FAL_KEY = updatedSettings.falKey;
    if (updatedSettings.openAiKey) process.env.OPENAI_API_KEY = updatedSettings.openAiKey;

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Settings POST Error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
