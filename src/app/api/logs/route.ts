import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file-based DB path
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'logs.json');

// Ensure data directory and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

export async function GET() {
  try {
    const fileData = fs.readFileSync(dbPath, 'utf8');
    const logs = JSON.parse(fileData);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error reading logs DB:', error);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newLog = await req.json();
    
    // Read current
    const fileData = fs.readFileSync(dbPath, 'utf8');
    const logs = JSON.parse(fileData);
    
    // Append new log (at the beginning to show newest first)
    const enrichedLog = {
      ...newLog,
      id: newLog.id || "TRC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      time: newLog.time || new Date().toLocaleTimeString()
    };
    
    logs.unshift(enrichedLog);
    
    // Keep only last 100 to avoid massive files
    const trimmedLogs = logs.slice(0, 100);
    
    // Save back to file
    fs.writeFileSync(dbPath, JSON.stringify(trimmedLogs, null, 2));
    
    return NextResponse.json({ success: true, log: enrichedLog });
  } catch (error) {
    console.error('Error writing to logs DB:', error);
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }
}
