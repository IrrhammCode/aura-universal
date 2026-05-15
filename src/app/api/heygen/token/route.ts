import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY || process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  try {
    // Calling the official HeyGen Streaming Token endpoint
    const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.code !== 100) {
      console.error('❌ [HeyGen] Token Error:', data);
      return NextResponse.json(data, { status: 401 });
    }

    console.log('✅ [HeyGen] Streaming Token Generated Successfully');
    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error('🔥 [HeyGen] Token Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
