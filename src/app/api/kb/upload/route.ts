import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'kb.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    // Prepare Document Metadata
    const newDoc = {
      id: "DOC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      vectors: Math.floor(Math.random() * 50000) + 10000,
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${uniqueFileName}` // The path to view the file
    };

    // Save to Database
    const fileData = fs.readFileSync(dbPath, 'utf8');
    const docs = JSON.parse(fileData);
    docs.unshift(newDoc);
    fs.writeFileSync(dbPath, JSON.stringify(docs, null, 2));

    return NextResponse.json({ success: true, document: newDoc });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
