import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const settingsPath = path.join(dataDir, 'settings.json');

const defaultSettings = {
  heygenKey: '',
  elevenLabsKey: '',
  falKey: '',
  openAiKey: '',
  twoFactorAuth: true,
  restrictedRegions: 'None'
};

export async function GET() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
      return NextResponse.json(defaultSettings);
    }

    const fileData = fs.readFileSync(settingsPath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newSettings = await req.json();
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    // Merge with existing settings or defaults
    let currentSettings = { ...defaultSettings };
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }

    const updatedSettings = { ...currentSettings, ...newSettings };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2));

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
