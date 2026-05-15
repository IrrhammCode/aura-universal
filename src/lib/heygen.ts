/**
 * Aura Platform - LiveAvatar Integration (Powered by HeyGen)
 * This module interfaces with the new api.liveavatar.com endpoints to generate
 * LITE mode interactive embeds as per the latest documentation.
 */

export interface LiveAvatarEmbed {
  url: string;
  script: string;
}

export class HeyGenManager {
  private static instance: HeyGenManager;

  private constructor() {}

  public static getInstance(): HeyGenManager {
    if (!HeyGenManager.instance) {
      HeyGenManager.instance = new HeyGenManager();
    }
    return HeyGenManager.instance;
  }

  /**
   * Create a LiveAvatar Embed (LITE Mode)
   * This uses the /v2/embeddings endpoint to generate an iframe URL for immediate deployment.
   * 
   * @param avatarId The HeyGen Avatar ID
   * @param contextId Optional context/knowledge base ID
   * @param isSandbox Run in sandbox mode for testing
   */
  async createLiveAvatarEmbed(avatarId: string, contextId?: string, isSandbox: boolean = true): Promise<LiveAvatarEmbed> {
    const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
    
    if (!apiKey || apiKey === '••••••••••••••••') {
       throw new Error("Missing valid LiveAvatar (HeyGen) API Key in settings.");
    }

    const payload: any = {
      avatar_id: avatarId,
      is_sandbox: isSandbox
    };

    if (contextId) {
      payload.context_id = contextId;
    }

    const response = await fetch('https://api.liveavatar.com/v2/embeddings', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.code !== 1000) {
      throw new Error(data.message || "Failed to generate LiveAvatar embed.");
    }

    return {
      url: data.data.url,
      script: data.data.script
    };
  }
}
