import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { captureEvent } from '@/lib/posthog';
import { prisma } from '@/lib/prisma';
import { decryptApiKey } from '@/lib/encryption';

const ORG_ID = "org_default"; // Mock single tenant

export async function POST(req: Request) {
  try {
    const { message, imageContext, agentId, sessionId, tone, empathy, depth } = await req.json();

    if (!sessionId) return NextResponse.json({ error: 'Session ID required' }, { status: 400 });

    // --- HUMAN TAKEOVER CHECK ---
    const activeLead = await (prisma as any).lead.findFirst({
      where: { sessionId, organizationId: ORG_ID }
    });
    
    if (activeLead?.isPaused) {
      return NextResponse.json({ 
        spoken_response: "A human agent is currently joining this conversation. Please wait a moment...",
        action_taken: { type: "HUMAN_TAKEOVER_ACTIVE" }
      });
    }

    // --- FETCH INFRASTRUCTURE & AGENT ---
    const [agent, org] = await Promise.all([
      agentId ? prisma.agent.findUnique({ where: { id: agentId } }) : Promise.resolve(null),
      prisma.organization.findUnique({
        where: { id: ORG_ID },
        include: { settings: true }
      })
    ]);

    // Use Groq for Chat (Free & Fast)
    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const isOpenAiValid = openAiKey && !openAiKey.includes('your_openai_key');

    if (!groqKey) {
      return NextResponse.json({ error: "Groq API Key not configured." }, { status: 500 });
    }

    const groq = new Groq({ apiKey: groqKey });
    const openai = isOpenAiValid ? new OpenAI({ apiKey: openAiKey }) : null;

    // --- RAG / KNOWLEDGE BASE ---
    let kbContext = "No specific knowledge base context found.";
    try {
      if (openai) {
        const { cosineSimilarity } = await import('@/lib/vector');
        const queryEmbeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: message || "General query",
        });
        const queryVector = queryEmbeddingResponse.data[0].embedding;

        const chunks = await (prisma as any).documentChunk.findMany({
          where: { document: { organizationId: ORG_ID } },
          include: { document: true }
        });

        if (chunks.length > 0) {
          const scoredChunks = chunks.map((chunk: any) => ({
            ...chunk,
            score: cosineSimilarity(queryVector, JSON.parse(chunk.embedding))
          }));
          scoredChunks.sort((a: any, b: any) => b.score - a.score);
          const topChunks = scoredChunks.slice(0, 3).filter((c: any) => c.score > 0.25);

          if (topChunks.length > 0) {
            const contextStrings = topChunks.map((c: any) => `[Source: ${c.document.title}] ${c.content}`);
            kbContext = `RELEVANT CONTEXT:\n${contextStrings.join('\n\n')}`;
          }
        }
      }
    } catch (e) { console.error("RAG error:", e); }

    // --- VISION PERCEPTION ---
    let visionAnalysis = "";
    if (imageContext && groqKey) {
      try {
        console.log("👁️ [Aura Vision] Analyzing image context...");
        const visionCompletion = await groq.chat.completions.create({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe this image in detail, focus on technical elements or anything related to customer support." },
                { type: "image_url", image_url: { url: imageContext } }
              ]
            }
          ]
        });
        visionAnalysis = `USER HAS SENT AN IMAGE. VISUAL ANALYSIS: ${visionCompletion.choices[0].message.content}`;
        console.log("✅ [Aura Vision] Analysis complete.");
      } catch (e) { console.error("Vision error:", e); }
    }

    // --- CONVERSATIONAL MEMORY ---
    let history: any[] = [];
    try {
      const pastMessages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      // Reverse to get chronological order
      history = pastMessages.reverse().map((m: any) => ({
        role: m.role,
        content: m.content
      }));
    } catch (e) { console.error("Memory fetch error:", e); }

    // --- NEURAL PROMPT ---
    const systemPrompt = `
      You are an advanced AI agent named ${agent?.name || 'Aura'}. 
      YOUR MISSION: Be the ultimate customer success representative for ${org?.name}.
      
      ${visionAnalysis ? `IMPORTANT VISUAL CONTEXT: ${visionAnalysis}` : ""}
      
      CORE BEHAVIORS:
      1. PERSISTENCE: If you don't know an answer, check the context. If still unknown, capture a lead or offer WhatsApp escalation.
      2. MULTILINGUAL: Respond in the SAME LANGUAGE as the user.
      3. CONVERSION: Capture leads and schedule meetings for high-intent users.
      
      NEURAL CONFIG:
      - Tone: ${tone ?? 50}/100, Empathy: ${empathy ?? 50}/100, Depth: ${depth ?? 50}/100
      
      ${agent?.instructions ? `AGENT SPECIFIC INSTRUCTIONS:\n${agent.instructions}` : ''}

      ${kbContext}

      OUTPUT FORMAT: You MUST respond in valid JSON format.
      {
        "thought_process": "Internal reasoning",
        "spoken_response": "Natural conversational response",
        "elevenlabs_emotion_tag": "cheerful | empathetic | professional | apologetic",
        "posthog_event": { "intent_detected": "...", "user_sentiment": "...", "resolution_offered": true }
      }
    `;

    // Note: Groq supports Tool Calling in Llama 3 models
    const tools: any[] = [
      {
        type: "function",
        function: {
          name: "schedule_meeting",
          description: "Book a call or demo via Calendly.",
          parameters: { type: "object", properties: { reason: { type: "string" } } }
        }
      },
      {
        type: "function",
        function: {
          name: "capture_lead",
          description: "Save prospect contact information.",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              interest: { type: "string" }
            },
            required: ["email"]
          }
        }
      }
    ];

    // When vision analysis is present, skip tools and focus on describing the image
    const useTools = !visionAnalysis;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message || "Analyze the image I just sent." }
      ],
      ...(useTools ? { tools, tool_choice: "auto" as const } : {}),
      temperature: 0.7,
      ...(!useTools ? { response_format: { type: "json_object" as const } } : {})
    });

    let aiResponse: any = {};
    const choice = completion.choices[0].message;

    if (choice.tool_calls) {
      const toolCall = choice.tool_calls[0] as any;
      const args = JSON.parse(toolCall.function.arguments);
      
      if (toolCall.function.name === 'schedule_meeting') {
        aiResponse = {
          thought_process: "Scheduling meeting via Calendly.",
          spoken_response: "I'd love to get you on the calendar! I'm opening my availability for you below.",
          elevenlabs_emotion_tag: "helpful",
          posthog_event: { intent_detected: "scheduling", user_sentiment: "positive", resolution_offered: true },
          action_taken: { type: "SCHEDULE_MEETING", details: args }
        };
      } else if (toolCall.function.name === 'capture_lead') {
        await (prisma as any).lead.upsert({
          where: { id: activeLead?.id || 'new' },
          update: { name: args.name, email: args.email, phone: args.phone, lastMessage: args.interest },
          create: { 
            organizationId: ORG_ID, 
            name: args.name, 
            email: args.email, 
            phone: args.phone, 
            lastMessage: args.interest,
            sessionId,
            sourceAgentId: agentId
          }
        });

        const { sendLeadNotification } = await import('@/lib/email');
        sendLeadNotification(args).catch(console.error);

        aiResponse = {
          thought_process: "Capturing lead info.",
          spoken_response: `Perfect ${args.name || ''}! I've saved your details. Our team will reach out about ${args.interest || 'your request'} soon.`,
          elevenlabs_emotion_tag: "cheerful",
          posthog_event: { intent_detected: "lead_captured", user_sentiment: "positive", resolution_offered: true },
          action_taken: { type: "LEAD_CAPTURED", details: args }
        };
      }
    } else {
      try {
        aiResponse = JSON.parse(choice.content || '{}');
      } catch (e) {
        aiResponse = {
          thought_process: "Error parsing JSON",
          spoken_response: choice.content || "I'm sorry, I had trouble processing that.",
          elevenlabs_emotion_tag: "apologetic"
        };
      }
    }

    // --- PERSISTENCE ---
    if (agentId) {
      await (prisma as any).chatMessage.createMany({
        data: [
          { organizationId: ORG_ID, agentId, sessionId, role: 'user', content: message || "[Interaction]" },
          { organizationId: ORG_ID, agentId, sessionId, role: 'agent', content: aiResponse.spoken_response }
        ]
      });
    }

    if (aiResponse.posthog_event) {
      captureEvent(sessionId, 'agent_interaction', { ...aiResponse.posthog_event, agent_id: agentId });
    }

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Neural processing failed." }, { status: 500 });
  }
}
