import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptApiKey, decryptApiKey, isEncrypted } from '@/lib/encryption';

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

    // Mask API keys for frontend (never send full keys to browser)
    const maskedSettings = {
      ...settings,
      heygenKey: settings.heygenKey ? '••••' + (decryptApiKey(settings.heygenKey)).slice(-4) : null,
      elevenLabsKey: settings.elevenLabsKey ? '••••' + (decryptApiKey(settings.elevenLabsKey)).slice(-4) : null,
      falKey: settings.falKey ? '••••' + (decryptApiKey(settings.falKey)).slice(-4) : null,
      openAiKey: settings.openAiKey ? '••••' + (decryptApiKey(settings.openAiKey)).slice(-4) : null,
    };

    return NextResponse.json(maskedSettings);
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

    // Encrypt API keys before storing
    const encryptIfNew = (val: string | undefined | null): string | undefined => {
      if (!val || val.startsWith('••••')) return undefined; // Don't overwrite with masked value
      if (isEncrypted(val)) return val; // Already encrypted
      return encryptApiKey(val);
    };

    const encHeygenKey = encryptIfNew(newSettings.heygenKey);
    const encElevenLabsKey = encryptIfNew(newSettings.elevenLabsKey);
    const encFalKey = encryptIfNew(newSettings.falKey);
    const encOpenAiKey = encryptIfNew(newSettings.openAiKey);

    const updateData: any = {
      twoFactorAuth: newSettings.twoFactorAuth ?? true,
      restrictedRegions: newSettings.restrictedRegions ?? 'None',
      companyLogo: newSettings.companyLogo,
      primaryColor: newSettings.primaryColor ?? '#06b6d4',
      calendlyUrl: newSettings.calendlyUrl
    };
    // Only update keys if a real new value was provided
    if (encHeygenKey) updateData.heygenKey = encHeygenKey;
    if (encElevenLabsKey) updateData.elevenLabsKey = encElevenLabsKey;
    if (encFalKey) updateData.falKey = encFalKey;
    if (encOpenAiKey) updateData.openAiKey = encOpenAiKey;

    const updatedSettings = await prisma.settings.upsert({
      where: { organizationId: ORG_ID },
      update: updateData,
      create: {
        organizationId: ORG_ID,
        ...updateData
      }
    });

    // Decrypt for runtime process.env overrides
    if (updatedSettings.heygenKey) process.env.NEXT_PUBLIC_HEYGEN_API_KEY = decryptApiKey(updatedSettings.heygenKey);
    if (updatedSettings.elevenLabsKey) process.env.ELEVENLABS_API_KEY = decryptApiKey(updatedSettings.elevenLabsKey);
    if (updatedSettings.falKey) process.env.FAL_KEY = decryptApiKey(updatedSettings.falKey);
    if (updatedSettings.openAiKey) process.env.OPENAI_API_KEY = decryptApiKey(updatedSettings.openAiKey);

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Settings POST Error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
