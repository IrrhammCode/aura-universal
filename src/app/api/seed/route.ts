import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const ORG_ID = "org_default";
  
  try {
    // 1. Clear existing logs (optional, but good for demo)
    await (prisma as any).interactionLog.deleteMany({ where: { organizationId: ORG_ID } });

    // 2. Generate realistic historical logs
    const mockData = [
      { input: "Tell me about your safety protocols.", response: "We adhere to ISO 27001 and SOC2 Type II standards...", hasVision: false, time: "10:45 AM" },
      { input: "Can you analyze this server rack layout?", response: "Analysis complete. I recommend moving Node 4 for better airflow.", hasVision: true, time: "11:02 AM" },
      { input: "Draft a summary of the compliance PDF.", response: "Summary generated: 98% compliance reached, 2 areas for improvement.", hasVision: false, time: "11:30 AM" },
      { input: "What is the warranty period for hardware?", response: "The standard warranty is 36 months for all enterprise nodes.", hasVision: false, time: "12:15 PM" },
      { input: "Show me the latency charts.", response: "Displaying real-time telemetry. Current average is 14ms.", hasVision: false, time: "01:05 PM" },
      { input: "Analyze the security perimeter logs.", response: "0 anomalies detected in the last 24 hours.", hasVision: true, time: "02:40 PM" },
    ];

    await (prisma as any).interactionLog.createMany({
      data: mockData.map(d => ({
        ...d,
        organizationId: ORG_ID
      }))
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
