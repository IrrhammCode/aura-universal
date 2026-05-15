import { NextResponse } from 'next/server';

export async function GET() {
  const status = {
    neural: !!process.env.GROQ_API_KEY,
    avatar: !!process.env.HEYGEN_API_KEY,
    voice: !!process.env.ELEVENLABS_API_KEY,
    vision: !!process.env.FAL_KEY,
    knowledge: !!process.env.OPENAI_API_KEY,
    telemetry: !!process.env.NEXT_PUBLIC_POSTHOG_KEY
  };

  return NextResponse.json(status);
}
