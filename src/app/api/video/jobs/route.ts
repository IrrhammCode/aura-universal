import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ORG_ID = "org_default";

export async function GET() {
  try {
    const jobs = await prisma.videoJob.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Video Jobs GET Error:', error);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}
