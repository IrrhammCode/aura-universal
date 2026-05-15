// ElevenLabs Voice Utility
export async function generateSpeechUrl(text: string, voiceId: string = "pNInz6obpg8ndclQU7Nc") {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY missing in environment variables.");
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
      }),
    });

    if (!response.ok) throw new Error("ElevenLabs API failed");

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("ElevenLabs Error:", error);
    return null;
  }
}

// Map Aura traits to ElevenLabs Voice IDs
export const AURA_VOICES = {
  adam: "pNInz6obpg8ndclQU7Nc", // Professional
  rachel: "21m00Tcm4TlvDq8ikWAM", // Empathetic
  antoni: "ErXw6No9o9v8X0XkDMm8" // Casual
};
