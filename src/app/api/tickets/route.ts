import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tickets = await prisma.serviceTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { ticketId, customerName, customerEmail, issueTitle, issueSummary, issueImage } = await req.json();

    // Get the first organization for the demo
    const org = await prisma.organization.findFirst();
    if (!org) return NextResponse.json({ error: "No organization found" }, { status: 404 });

    const ticket = await prisma.serviceTicket.create({
      data: {
        ticketId,
        customerName: customerName || "Guest User",
        customerEmail: customerEmail || "customer@example.com",
        issueTitle,
        issueSummary,
        issueImage,
        organizationId: org.id
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Ticket Creation Error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
