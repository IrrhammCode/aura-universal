import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ORG_ID = "org_default";

// GET: Retrieve chat history for an agent session
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId') || 'aura-01';
    const limit = parseInt(searchParams.get('limit') || '50');

    const history = await (prisma as any).chatMessage.findMany({
      where: { organizationId: ORG_ID, agentId },
      orderBy: { createdAt: 'asc' },
      take: limit
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Chat history GET error:', error);
    return NextResponse.json([]);
  }
}

// POST: Persist a new chat message
export async function POST(req: Request) {
  try {
    const { agentId, role, content, hasImage } = await req.json();

    const msg = await (prisma as any).chatMessage.create({
      data: {
        organizationId: ORG_ID,
        agentId: agentId || 'aura-01',
        role,      // 'user' or 'agent'
        content,
        hasImage: hasImage || false
      }
    });

    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    console.error('Chat history POST error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// DELETE: Clear chat history for an agent (reset memory)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId') || 'aura-01';

    await (prisma as any).chatMessage.deleteMany({
      where: { organizationId: ORG_ID, agentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat history DELETE error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
