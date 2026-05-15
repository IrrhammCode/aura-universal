import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.HEYGEN_API_KEY || process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  try {
    const { session_id, text } = await req.json();

    if (!session_id || !text) {
      return NextResponse.json({ error: 'session_id and text are required' }, { status: 400 });
    }

    console.log(`🗣️ [LiveAvatar] Speak Task: "${text.substring(0, 50)}..."`);

    // Try the LiveAvatar task API to make the avatar speak
    const response = await fetch(`https://api.liveavatar.com/v1/sessions/${session_id}/task`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task_type: "REPEAT",
        task_params: { text }
      })
    });

    const data = await response.json();
    console.log('📥 [LiveAvatar] Speak Response:', JSON.stringify(data));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('🔥 [LiveAvatar] Speak Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
