// ElevenLabs Voice Utility
export async function generateSpeechUrl(text: string, voiceId: string = "pNInz6obpg8ndclQU7Nc") {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.warn("ELEVENLABS_API_KEY missing, using browser default voice fallback.");
    return null; // Frontend will use SpeechSynthesis if null
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
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
