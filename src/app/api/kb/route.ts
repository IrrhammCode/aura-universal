import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file-based DB path for Knowledge Base metadata
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'kb.json');

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
    const docs = JSON.parse(fileData);
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error reading KB DB:', error);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newDoc = await req.json();
    
    const fileData = fs.readFileSync(dbPath, 'utf8');
    const docs = JSON.parse(fileData);
    
    // Simulate Vectorization delay and metadata enrichment
    const enrichedDoc = {
      ...newDoc,
      id: newDoc.id || "DOC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      vectors: Math.floor(Math.random() * 50000) + 10000, // Simulated vector count
      uploadedAt: new Date().toISOString()
    };
    
    docs.unshift(enrichedDoc);
    
    fs.writeFileSync(dbPath, JSON.stringify(docs, null, 2));
    
    return NextResponse.json({ success: true, document: enrichedDoc });
  } catch (error) {
    console.error('Error writing to KB DB:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}
