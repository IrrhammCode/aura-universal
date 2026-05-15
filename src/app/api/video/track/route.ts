import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

    const job = await prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // We log the view as an interaction
    await prisma.interactionLog.create({
      data: {
        organizationId: job.organizationId,
        input: `Prospect opened video: ${job.title}`,
        response: "Video engagement tracked successfully.",
        hasVision: true, // Mark true to light up the dashboard
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
