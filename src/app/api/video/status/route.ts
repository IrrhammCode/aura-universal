import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fetch from 'node-fetch';

const ORG_ID = "org_default";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    // 1. Fetch from local DB
    const job = await prisma.videoJob.findUnique({
      where: { id: jobId, organizationId: ORG_ID }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.heygenId) {
       return NextResponse.json({ error: "Invalid Job: No HeyGen Reference" }, { status: 400 });
    }

    // If already completed or failed, return from local DB
    if (job.status === "COMPLETED" || job.status === "FAILED") {
       return NextResponse.json({ success: true, job });
    }

    // 2. Fetch from HeyGen API
    const settings = await prisma.settings.findUnique({ where: { organizationId: ORG_ID } });
    const apiKey = settings?.heygenKey || process.env.HEYGEN_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "HeyGen API Key is missing." }, { status: 400 });
    }

    const heygenRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${job.heygenId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      }
    });

    const heygenData = await heygenRes.json();

    if (!heygenRes.ok || heygenData.error) {
       console.error("HeyGen Status Error:", heygenData);
       return NextResponse.json({ error: "Failed to poll rendering engine" }, { status: 500 });
    }

    const statusObj = heygenData.data;
    const currentStatus = statusObj.status; // pending, processing, completed, failed

    let newDbStatus = "PROCESSING";
    let videoUrl = null;
    let duration = job.duration;

    if (currentStatus === "completed") {
       newDbStatus = "COMPLETED";
       videoUrl = statusObj.video_url;
       duration = `${Math.round(statusObj.duration || 30)}s`;
    } else if (currentStatus === "failed") {
       newDbStatus = "FAILED";
    }

    // 3. Update DB if status changed
    if (newDbStatus !== job.status || videoUrl) {
      const updatedJob = await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          status: newDbStatus,
          videoUrl: videoUrl,
          duration: duration
        }
      });
      return NextResponse.json({ success: true, job: updatedJob });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Video Status Poll Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
