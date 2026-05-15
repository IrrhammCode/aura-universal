import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.HEYGEN_API_KEY || process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { avatar_id, knowledge, instructions } = body;

    console.log(`🚀 [LiveAvatar] Injecting Knowledge for: ${avatar_id}`);

    // STEP 1: Create a Dynamic Context with the Knowledge Base content
    // This makes the avatar "read" your .md file
    const contextResponse = await fetch('https://api.liveavatar.com/v1/contexts', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Aura Neural Sync - ${new Date().getTime()}`,
        prompt: `
          System Instructions: ${instructions || 'You are Aura, a professional AI assistant.'}
          
          NEURAL CAPABILITIES:
          - VISION: You have a Neural Vision Uplink. You CAN see and analyze images sent by the user through the chat interface.
          - KNOWLEDGE: You have access to the uploaded Knowledge Matrix assets.
          
          KNOWLEDGE BASE CONTENT:
          ${knowledge || 'No specific knowledge provided.'}
          
          Guidelines:
          - Use the provided Knowledge Base to answer questions.
          - If information is not in the knowledge base, state that you don't have that specific data.
          - Maintain a professional and helpful tone.
        `,
        opening_text: "Neural synchronization complete. I have loaded your knowledge matrix. How can I assist you today?"
      })
    });

    const contextData = await contextResponse.json();
    
    if (contextData.code !== 100 && contextData.code !== 1000) {
      console.error('❌ [LiveAvatar] Context Creation Failed:', contextData);
      throw new Error('Failed to create neural context');
    }

    const context_id = contextData.data.id;
    console.log(`🧠 [LiveAvatar] Neural Context Created: ${context_id}`);

    // STEP 2: Create the Embedding using the NEW "Smart" Context
    const embedResponse = await fetch('https://api.liveavatar.com/v2/embeddings', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar_id: avatar_id,
        context_id: context_id,
        type: "DEFAULT",
        is_sandbox: false
      })
    });

    const embedData = await embedResponse.json();
    
    if (embedData.code !== 100 && embedData.code !== 1000) {
      console.warn('❌ [LiveAvatar] Embedding failed:', embedData);
      return NextResponse.json(embedData, { status: 401 });
    }

    return NextResponse.json({
      url: embedData.data.url,
      session_id: embedData.data.session_id, // Important for the speak task!
      avatar_id: avatar_id,
      context_id: context_id
    });
  } catch (error: any) {
    console.error('🔥 [LiveAvatar] Neural Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
