import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message, imageContext } = await req.json();

    // --- LIVE MODE IMPLEMENTATION ---
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API Key not configured." }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are Aura, an advanced multimodal AI agent. You have real-time vision capabilities and emotional intelligence.
    
    You will receive the user's spoken message and potentially a description of what you are seeing through the camera right now.
    You must respond strictly in JSON format with the following structure:
    {
      "thought_process": "Your internal reasoning for this response.",
      "spoken_response": "The exact words you will speak to the user. Make it natural, conversational, and helpful.",
      "elevenlabs_emotion_tag": "Must be exactly one of: cheerful, empathetic, professional, apologetic",
      "posthog_event": {
        "intent_detected": "Brief 1-3 word description of user's intent",
        "user_sentiment": "positive, negative, or neutral",
        "resolution_offered": boolean
      }
    }
    
    Current Vision Context: ${imageContext || "No visual data available right now."}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Optimized for low latency
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content;
    
    if (!rawContent) {
      throw new Error("Empty response from OpenAI");
    }

    const aiResponse = JSON.parse(rawContent);

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

