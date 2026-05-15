import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'ElevenLabs API Key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices from ElevenLabs');
    }

    const data = await response.json();
    
    // Simplify the response for the frontend
    const voices = data.voices.map((v: any) => ({
      id: v.voice_id,
      name: v.name,
      preview_url: v.preview_url,
      category: v.category,
      description: v.description || v.labels?.accent || 'Neural voice'
    }));

    return NextResponse.json(voices);
  } catch (error: any) {
    console.error('ElevenLabs Voices Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
