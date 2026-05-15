import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { chunkText } from '@/lib/vector';

const ORG_ID = "org_default";

export async function GET() {
  try {
    const docs = await prisma.document.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error reading KB DB:', error);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newDoc = await req.json();
    
    let org = await prisma.organization.findUnique({ where: { id: ORG_ID } });
    if (!org) {
      org = await prisma.organization.create({ data: { id: ORG_ID, name: "Default Org" } });
    }
    
    const content = newDoc.content || `This is a mock document content for ${newDoc.title}. It contains standard enterprise procedures and policy information.`;
    
    // Chunk the text
    const chunks = chunkText(content, 300);
    
    // Create embeddings if OpenAI Key is available
    const settings = await prisma.settings.findUnique({ where: { organizationId: ORG_ID } });
    const apiKey = settings?.openAiKey || process.env.OPENAI_API_KEY;
    
    let chunkDataToSave: { content: string, embedding: string }[] = [];
    
    if (apiKey) {
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
      // Mock embeddings for testing if no key provided
      chunkDataToSave = chunks.map(c => ({
        content: c,
        embedding: JSON.stringify(Array(1536).fill(0).map(() => Math.random() - 0.5))
      }));
    }
    
    const savedDoc = await prisma.document.create({
      data: {
        organizationId: ORG_ID,
        title: newDoc.title,
        size: newDoc.size || `${(content.length / 1024).toFixed(1)} KB`,
        vectors: chunks.length,
        url: newDoc.url,
        content: content,
        chunks: {
          create: chunkDataToSave
        }
      }
    });

    return NextResponse.json({ success: true, document: savedDoc });
  } catch (error) {
    console.error('Error writing to KB DB:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Prisma cascades deletes if configured, but let's delete chunks manually just in case,
    // actually Prisma `DocumentChunk` relation has `onDelete: Cascade` in schema.
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from KB DB:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
