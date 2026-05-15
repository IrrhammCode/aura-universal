import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptApiKey } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // 1. Fetch Organization API Key
    const org = await prisma.organization.findUnique({
      where: { id: "org_default" },
      include: { settings: true }
    });

    const rawKey = org?.settings?.elevenLabsKey;
    const apiKey = rawKey ? decryptApiKey(rawKey) : process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured." }, { status: 500 });
    }

    // 2. Default Voice ID fallback (Adam)
    const targetVoiceId = voiceId || "pNInz6obpgDQGcFmaJgB";

    // 3. Make request to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs API Error:", err);
      return NextResponse.json({ error: "Failed to generate voice" }, { status: response.status });
    }

    // 4. Return the audio buffer as a blob
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"'
      }
    });

  } catch (error) {
    console.error("TTS generation failed:", error);
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
