import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, imageContext } = await req.json();

    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

    if (isMockMode) {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      let mockSpokenResponse = `Saya menerima pesan Anda: "${message}".`;
      let mockEmotion = 'cheerful';

      if (imageContext) {
         mockSpokenResponse += ` Dan saya melihat gambar yang Anda kirimkan: ${imageContext}.`;
      }

      if (message.toLowerCase().includes('marah') || message.toLowerCase().includes('kecewa')) {
          mockEmotion = 'apologetic';
          mockSpokenResponse = 'Saya minta maaf jika Anda merasa kecewa. Mari kita perbaiki masalah ini bersama.';
      }

      return NextResponse.json({
        thought_process: "Mock mode active. Analyzed user text and image context.",
        spoken_response: mockSpokenResponse,
        elevenlabs_emotion_tag: mockEmotion,
        posthog_event: {
          intent_detected: "mock_interaction",
          user_sentiment: mockEmotion === 'apologetic' ? 'negative' : 'positive',
          resolution_offered: true
        }
      });
    }

    // TODO: Implement actual LLM call (e.g., to Gemini/OpenAI) using the prompt
    // For now, if not in mock mode but no keys, just return a default error.
    return NextResponse.json({ error: "API Keys not configured yet." }, { status: 500 });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
