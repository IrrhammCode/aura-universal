import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { mode, documentId, documentTitle, targetProfile, agentId, empathy, instruction } = await req.json();

    if (mode === 'knowledge' && !documentTitle) {
      return NextResponse.json({ error: "No document provided for synthesis" }, { status: 400 });
    }
    if (mode === 'outreach' && !targetProfile) {
      return NextResponse.json({ error: "No target profile provided for outreach" }, { status: 400 });
    }

    // Load Brand Kit Settings
    let primaryColor = '#06b6d4'; // Default cyan
    let companyLogo = '';
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsPath)) {
       const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
       if (settings.primaryColor) primaryColor = settings.primaryColor;
       if (settings.companyLogo) companyLogo = settings.companyLogo;
    }

    let newHtml = "";
    let jobTitle = "";

    if (mode === 'knowledge') {
      newHtml = `<div id="root" data-composition-id="knowledge-synthesis" data-start="0" data-width="1920" data-height="1080">
  <div id="bg" class="clip" data-start="0" data-duration="45" data-track-index="0" style="width: 100%; height: 100%; background: #000;">
    <heygen-avatar agent="${agentId || 'aura-default'}" voice-empathy="${empathy || 50}" style="width: 100%; height: 100%; object-fit: cover;"></heygen-avatar>
  </div>
  <div id="overlay" class="clip" data-start="2" data-duration="43" data-track-index="1" style="position: absolute; bottom: 10%; left: 5%; background: rgba(0,0,0,0.8); padding: 40px; border-radius: 20px; color: white; border-left: 8px solid ${primaryColor};">
    ${companyLogo ? `<img src="${companyLogo}" style="height: 60px; margin-bottom: 20px;" />` : ''}
    <h1 style="font-size: 64px; color: ${primaryColor}; margin: 0; font-family: sans-serif;">Knowledge Synthesis: ${documentTitle}</h1>
    <p style="font-size: 32px; color: #a1a1aa; margin-top: 20px; font-family: sans-serif;">${instruction || 'General Overview'}</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#overlay", { opacity: 0, y: 50, duration: 1 }, 2);
    window.__timelines = window.__timelines || {};
    window.__timelines["knowledge-synthesis"] = tl;
  </script>
</div>`;
      jobTitle = `${documentTitle.replace(/\.[^/.]+$/, "")}_Synthesis.mp4`;
    } else if (mode === 'outreach') {
      newHtml = `<div id="root" data-composition-id="personalized-outreach" data-start="0" data-width="1920" data-height="1080" style="display: flex;">
  <div id="avatar" class="clip" data-start="0" data-duration="30" data-track-index="0" style="flex: 1; background: #111;">
    <heygen-avatar agent="${agentId || 'aura-default'}" voice-empathy="${empathy || 50}" style="width: 100%; height: 100%; object-fit: cover;"></heygen-avatar>
  </div>
  <div id="content" class="clip" data-start="0" data-duration="30" data-track-index="1" style="flex: 1; background: #000; display: flex; flex-direction: column; justify-content: center; padding: 100px; color: white; font-family: sans-serif; border-left: 4px solid ${primaryColor};">
    ${companyLogo ? `<img src="${companyLogo}" style="height: 80px; margin-bottom: 40px; object-fit: contain;" />` : ''}
    <h2 id="greeting" style="font-size: 80px; color: ${primaryColor}; margin: 0;">Hi ${targetProfile.name}!</h2>
    <p id="pitch" style="font-size: 40px; color: #a1a1aa; margin-top: 40px; line-height: 1.5;">Aura noticed your work at ${targetProfile.company}. ${instruction || 'We should connect.'}</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#greeting", { opacity: 0, x: -50, duration: 1 }, 1);
    tl.from("#pitch", { opacity: 0, x: -50, duration: 1 }, 2);
    window.__timelines = window.__timelines || {};
    window.__timelines["personalized-outreach"] = tl;
  </script>
</div>`;
      jobTitle = `Outreach_${targetProfile.name.replace(/\s+/g, '_')}.mp4`;
    } else if (mode === 'batch') {
      // Mock logic for Batch CSV mode
      newHtml = `<!-- BATCH JOB TRIGGERED -->\n<!-- 100 HyperFrames HTML templates queued in background -->`;
      jobTitle = `Batch_Outreach_List_${Date.now()}.zip`;
    }

    const jobId = "VID-" + Date.now().toString();
    const jobResult = {
      id: jobId,
      title: jobTitle,
      duration: mode === 'knowledge' ? "00:45" : (mode === 'batch' ? "BATCH" : "00:30"),
      date: new Date().toLocaleTimeString(),
      html: newHtml,
      funnelUrl: `http://localhost:3000/v/${jobId}`
    };

    return NextResponse.json(jobResult);

  } catch (error) {
    console.error("Studio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
