export class HeyGenManager {
  private static instance: HeyGenManager;

  private constructor() {}

  public static getInstance(): HeyGenManager {
    if (!HeyGenManager.instance) {
      HeyGenManager.instance = new HeyGenManager();
    }
    return HeyGenManager.instance;
  }

  async speak(sessionId: string, text: string) {
    console.log(`🗣️ [LiveAvatar] Agent is speaking: ${text.substring(0, 30)}...`);
    try {
      const apiKey = process.env.HEYGEN_API_KEY || process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      await fetch(`https://api.liveavatar.com/v1/sessions/${sessionId}/task`, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_type: "REPEAT",
          task_params: { text: text }
        })
      });
    } catch (err) {
      console.error("❌ [LiveAvatar] Speak task failed:", err);
    }
  }

  async createLiveAvatarEmbed(avatarId: string, voiceId?: string, isSandbox: boolean = true, knowledge?: string, instructions?: string) {
    console.log("🚀 [LiveAvatar] Initializing Neural Knowledge Stream for:", avatarId);
    
    try {
      const response = await fetch('/api/heygen/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          avatar_id: avatarId,
          knowledge: knowledge,
          instructions: instructions
        })
      });

      const data = await response.json();
      
      if (!data.url) {
        throw new Error("Failed to obtain LiveAvatar embed URL");
      }

      return { 
        url: data.url,
        session_id: data.session_id 
      };
    } catch (err) {
      console.error("LiveAvatar Interactive Error:", err);
      throw err;
    }
  }
}
