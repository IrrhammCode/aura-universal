import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const avatarId = searchParams.get('avatar_id') || 'aura-x';

  // High-fidelity MP4 video loops for a premium interactive feel
  const avatarVideos: Record<string, string> = {
    'fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046': 'https://files2.heygen.ai/avatar/v3/26de369b2d4443e586dedf27af1e0c1d_45570/preview_target.mp4',
    '7b888024-f8c9-4205-95e1-78ce01497bda': 'https://files2.heygen.ai/avatar/v3/db2fb7fd0d044b908395a011166ab22d_45680/preview_target.mp4',
  };

  const videoUrl = avatarVideos[avatarId] || 'https://files2.heygen.ai/avatar/v3/26de369b2d4443e586dedf27af1e0c1d_45570/preview_target.mp4';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: black; font-family: sans-serif; }
        .container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .video-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.4)); }
        .status { position: absolute; top: 20px; left: 20px; display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .text { color: white; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
        .hud { position: absolute; bottom: 40px; left: 40px; border-left: 2px solid #06b6d4; padding-left: 20px; }
        .hud-title { color: #06b6d4; font-size: 12px; font-weight: 900; margin-bottom: 4px; }
        .hud-desc { color: rgba(255,255,255,0.5); font-size: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <video autoplay loop muted playsinline class="video-bg">
          <source src="${videoUrl}" type="video/mp4">
        </video>
        <div class="overlay"></div>
        <div class="status">
          <div class="dot"></div>
          <div class="text">Neural Sync: Active</div>
        </div>
        <div class="hud">
          <div class="hud-title">AURA-X INTERACTIVE</div>
          <div class="hud-desc">ENCRYPTED STREAM • LOW LATENCY • NEURAL ENGINE 4.0</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
