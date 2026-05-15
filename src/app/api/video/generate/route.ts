import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptApiKey } from '@/lib/encryption';
import fetch from 'node-fetch';

const ORG_ID = "org_default";

export async function POST(req: Request) {
  try {
    const { title, script, avatarId, voiceId } = await req.json();
    
    // Get organization API Key
    const settings = await prisma.settings.findUnique({ where: { organizationId: ORG_ID } });
    const rawKey = settings?.heygenKey;
    const apiKey = rawKey ? decryptApiKey(rawKey) : process.env.HEYGEN_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "HeyGen API Key is missing. Configure it in settings." }, { status: 400 });
    }

    // Default Avatar for B2B if none provided
    const targetAvatarId = avatarId || process.env.HEYGEN_AVATAR_ID || "josh_lite_20230714";

    // Call HeyGen Generate API
    // Doc: https://docs.heygen.com/reference/generate-video-v2
    const heygenRes = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: targetAvatarId,
              avatar_style: "normal"
            },
            voice: {
              type: "text",
              input_text: script || "Welcome to our platform. We look forward to working with you.",
              voice_id: voiceId || "1bd001e7e50f421d891986aad5158bc8" // Default voice
            }
          }
        ],
        test: false // Set to true to avoid deducting credits in development
      })
    });

    const heygenData = await heygenRes.json();

    if (!heygenRes.ok || heygenData.error) {
      console.error("HeyGen API Error:", heygenData);
      return NextResponse.json({ error: "Failed to communicate with rendering engine" }, { status: 500 });
    }

    const heygenVideoId = heygenData.data.video_id;

    // Create a local video job record
    const job = await prisma.videoJob.create({
      data: {
        organizationId: ORG_ID,
        title: title || "New B2B Outreach Video",
        duration: "00:30", // Placeholder until finished
        heygenId: heygenVideoId,
        status: "PROCESSING"
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Video Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
