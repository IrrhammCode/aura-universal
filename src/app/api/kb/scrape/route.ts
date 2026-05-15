import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { chunkText } from '@/lib/vector';
import { decryptApiKey } from '@/lib/encryption';

const ORG_ID = "org_default";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    // 1. Fetch Org Settings for BYOK
    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
      include: { settings: true }
    });
    const rawKey = org?.settings?.openAiKey;
    const apiKey = rawKey ? decryptApiKey(rawKey) : process.env.OPENAI_API_KEY;

    // 2. Fetch content
    const res = await fetch(url);
    const html = await res.text();
    const cleanText = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 15000);

    const title = url.split('/').pop() || url;
    const chunks = chunkText(cleanText, 500);

    let chunkDataToSave = [];
    const isPlaceholder = !apiKey || apiKey.includes('your_openai_key');
    
    if (apiKey && !isPlaceholder) {
      const openai = new OpenAI({ apiKey });
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks,
      });
      chunkDataToSave = response.data.map((d, i) => ({
        content: chunks[i],
        embedding: JSON.stringify(d.embedding)
      }));
    } else {
      // Fallback random vectors for demo if no key
      chunkDataToSave = chunks.map(c => ({
        content: c,
        embedding: JSON.stringify(Array(1536).fill(0).map(() => Math.random()))
      }));
    }

    const savedDoc = await (prisma.document as any).create({
      data: {
        organizationId: ORG_ID,
        title: `Scraped: ${title}`,
        size: `${(cleanText.length / 1024).toFixed(1)} KB`,
        vectors: chunks.length,
        url: url,
        content: cleanText,
        chunks: { create: chunkDataToSave }
      }
    });

    return NextResponse.json({ success: true, document: savedDoc });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
  }
}
