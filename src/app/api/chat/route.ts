import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { captureEvent } from '@/lib/posthog';
import { prisma } from '@/lib/prisma';
import { decryptApiKey } from '@/lib/encryption';

import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { message, imageContext, tone, empathy, depth } = await req.json();

    
    // Fetch Organization Settings for API Key
    const ORG_ID = "org_default"; // Mock single tenant
    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
      include: { settings: true }
    });

    const rawKey = org?.settings?.openAiKey;
    const apiKey = rawKey ? decryptApiKey(rawKey) : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API Key not configured in Settings." }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // --- RAG / KNOWLEDGE BASE INJECTION ---
    let kbContext = "No knowledge base documents currently synced.";
    
    try {
      const { cosineSimilarity } = await import('@/lib/vector');
      
      // 1. Embed the user's message
      const queryEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: message,
      });
      const queryVector = queryEmbeddingResponse.data[0].embedding;

      // 2. Fetch all document chunks for the organization
      const chunks = await (prisma as any).documentChunk.findMany({
        where: { document: { organizationId: ORG_ID } },
        include: { document: true }
      });

      if (chunks.length > 0) {
        // 3. Compute similarities
        const scoredChunks = chunks.map((chunk: any) => {
          const chunkVector = JSON.parse(chunk.embedding);
          const score = cosineSimilarity(queryVector, chunkVector);
          return { ...chunk, score };
        });

        // 4. Sort by highest score and take top 3
        scoredChunks.sort((a: any, b: any) => b.score - a.score);
        const topChunks = scoredChunks.slice(0, 3).filter((c: any) => c.score > 0.3); // Threshold

        if (topChunks.length > 0) {
          const contextStrings = topChunks.map((c: any) => `[Source: ${c.document.title}] ${c.content}`);
          kbContext = `You have retrieved the following highly relevant information from the company's Knowledge Base based on the user's query:\\n\\n${contextStrings.join('\\n\\n')}\\n\\nUse this information to answer the user accurately.`;
        } else {
           // Fallback to general list if no specific match is strong enough
           const docs = await prisma.document.findMany({ where: { organizationId: ORG_ID } });
           const docNames = docs.map((d: any) => `- ${d.title} (Size: ${d.size})`).join('\\n');
           kbContext = `The Knowledge Base contains these documents, but none perfectly match the query:\\n${docNames}\\nIf the user asks about them, you can mention them.`;
        }
      }
    } catch (e) {
      console.error("Failed to execute Semantic RAG search", e);
    }

    const systemPrompt = `You are Aura, an advanced multimodal AI agent. You have real-time vision capabilities and emotional intelligence.
    
    Current Neural Configuration:
    - Vocal Tone / Resonance: ${tone ?? 50}% (Higher = more commanding/professional, Lower = more casual/approachable)
    - Empathy Quotient: ${empathy ?? 50}% (Higher = highly sympathetic and emotionally supportive, Lower = purely logical and stoic)
    - Reasoning Depth: ${depth ?? 50}% (Higher = highly detailed, philosophical, and analytical, Lower = concise and direct)

    You must adapt your "spoken_response" length, tone, and complexity strictly based on these neural configuration parameters.
    
    KNOWLEDGE BASE CONTEXT:
    ${kbContext}

    You will receive the user's spoken message and potentially a description or an image of what you are seeing through the camera right now.
    You must respond strictly in JSON format with the following structure:
    {
      "thought_process": "Your internal reasoning for this response. If an image is provided, analyze it here first.",
      "spoken_response": "The exact words you will speak to the user. Make it natural, conversational, and helpful.",
      "elevenlabs_emotion_tag": "Must be exactly one of: cheerful, empathetic, professional, apologetic",
      "posthog_event": {
        "intent_detected": "Brief 1-3 word description of user's intent",
        "user_sentiment": "positive, negative, or neutral",
        "resolution_offered": boolean
      }
    }`;

    // Handle Multimodal User Message
    const userContent: any = imageContext 
       ? [
           { type: "text", text: message || "Analyze this image." },
           { type: "image_url", image_url: { url: imageContext } }
         ]
       : message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Optimized for low latency, supports vision
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content;
    
    if (!rawContent) {
      throw new Error("Empty response from OpenAI");
    }

    const aiResponse = JSON.parse(rawContent);

    // Track the interaction backend telemetry
    if (aiResponse.posthog_event) {
      await captureEvent('backend-agent-forge', 'agent_interaction', {
        intent_detected: aiResponse.posthog_event.intent_detected,
        user_sentiment: aiResponse.posthog_event.user_sentiment,
        resolution_offered: aiResponse.posthog_event.resolution_offered,
        tone_config: tone,
        empathy_config: empathy,
        depth_config: depth
      });
    }

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

