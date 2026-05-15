import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { chunkText } from '@/lib/vector';
import { decryptApiKey } from '@/lib/encryption';
import path from 'path';
import fs from 'fs';

const ORG_ID = "org_default";
// Use /tmp for Vercel read-only filesystem compatibility
const uploadDir = '/tmp';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
      include: { settings: true }
    });
    const rawKey = org?.settings?.openAiKey;
    const apiKey = rawKey ? decryptApiKey(rawKey) : process.env.OPENAI_API_KEY;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString('utf8'); // Basic for TXT/MD

    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    const chunks = chunkText(content, 500);
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
      chunkDataToSave = chunks.map(c => ({
        content: c,
        embedding: JSON.stringify(Array(1536).fill(0).map(() => Math.random()))
      }));
    }

    const savedDoc = await (prisma.document as any).create({
      data: {
        organizationId: ORG_ID,
        title: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        vectors: chunks.length,
        url: `/uploads/${uniqueFileName}`,
        content: content,
        chunks: { create: chunkDataToSave }
      }
    });

    return NextResponse.json({ success: true, document: savedDoc });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
