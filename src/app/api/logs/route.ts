import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ORG_ID = "org_default";

export async function GET() {
  try {
    const logs = await prisma.interactionLog.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error reading logs DB:', error);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newLog = await req.json();
    
    // Ensure mock org exists
    let org = await prisma.organization.findUnique({ where: { id: ORG_ID } });
    if (!org) {
      org = await prisma.organization.create({ data: { id: ORG_ID, name: "Default Org" } });
    }

    const enrichedLog = await prisma.interactionLog.create({
      data: {
        organizationId: ORG_ID,
        input: newLog.input,
        response: newLog.response,
        hasVision: newLog.hasVision || false,
        time: newLog.time || new Date().toLocaleTimeString()
      }
    });
    
    return NextResponse.json({ success: true, log: enrichedLog });
  } catch (error) {
    console.error('Error writing to logs DB:', error);
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }
}
