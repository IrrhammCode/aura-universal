import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ORG_ID = "org_default";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({ where: { organizationId: ORG_ID } });
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let agent;
    if (body.id) {
       agent = await prisma.agent.update({
         where: { id: body.id },
         data: {
           name: body.name,
           avatarId: body.avatarId,
           voiceId: body.voiceId,
           tone: body.tone,
           empathy: body.empathy,
           depth: body.depth
         }
       });
    } else {
       agent = await prisma.agent.create({
         data: {
           organizationId: ORG_ID,
           name: body.name,
           avatarId: body.avatarId,
           voiceId: body.voiceId,
           tone: body.tone || 50,
           empathy: body.empathy || 50,
           depth: body.depth || 50
         }
       });
    }
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save agent' }, { status: 500 });
  }
}
