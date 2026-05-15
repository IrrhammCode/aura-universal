import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { mode, documentId, documentTitle, targetProfile, agentId, empathy, instruction, ticketId, issueImage } = await req.json();

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
    } else if (mode === 'resolution') {
      newHtml = `<div id="root" data-composition-id="service-resolution" data-width="1920" data-height="1080" style="display: flex; width: 1920px; height: 1080px; background: #000; font-family: sans-serif; overflow: hidden;">
  <!-- Track 0: Avatar background -->
  <div class="clip" data-start="0" data-duration="20" data-track-index="0" style="flex: 1; position: relative; overflow: hidden; background: #111;">
    <heygen-avatar agent="${agentId || 'aura-x'}" voice-empathy="${empathy || 70}" style="width: 100%; height: 100%; object-fit: cover;"></heygen-avatar>
    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 300px; background: linear-gradient(transparent, rgba(0,0,0,0.8));"></div>
  </div>

  <!-- Track 1: Information Overlay -->
  <div id="info-side" class="clip" data-start="0" data-duration="20" data-track-index="1" style="flex: 1; background: #090b14; display: flex; flex-direction: column; justify-content: center; padding: 100px; color: white; border-left: 2px solid ${primaryColor}; position: relative;">
    <div id="badge" style="position: absolute; top: 50px; right: 50px; opacity: 0.1;">
       <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>

    <div id="header-text" style="margin-bottom: 60px;">
       <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 10px;">
          <div style="width: 40px; height: 2px; background: ${primaryColor};"></div>
          <span style="text-transform: uppercase; letter-spacing: 5px; font-size: 18px; color: ${primaryColor}; font-weight: 900;">Official Resolution</span>
       </div>
       <h1 style="font-size: 100px; margin: 0; font-weight: 900; letter-spacing: -4px;">#${ticketId || 'TCK-9901'}</h1>
       <p style="font-size: 24px; color: #71717a; margin-top: 10px;">Case Status: <span style="color: #10b981;">Processing Repair</span></p>
    </div>

    <div id="evidence-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
       <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #52525b; margin-bottom: 20px; font-weight: bold;">Analyzed Evidence:</p>
       <div id="image-container" style="position: relative; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <img src="${issueImage || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'}" style="width: 100%; display: block;" />
          <div style="position: absolute; inset: 0; box-shadow: inset 0 0 100px rgba(0,0,0,0.5);"></div>
       </div>
       <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 16px; color: #a1a1aa;">Verified via AURA Vision</div>
          <div style="padding: 10px 20px; background: ${primaryColor}20; border-radius: 12px; color: ${primaryColor}; font-size: 14px; font-weight: bold;">CERTIFIED</div>
       </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    // Hyperframes requires a paused GSAP timeline registered on window.__timelines
    const tl = gsap.timeline({ paused: true });
    
    tl.from("#info-side", { x: 200, opacity: 0, duration: 1.2, ease: "power4.out" }, 0.5);
    tl.from("#header-text h1", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, 1);
    tl.from("#evidence-box", { scale: 0.9, opacity: 0, duration: 1, ease: "back.out(1.2)" }, 1.5);
    tl.from("#image-container img", { filter: "blur(20px)", duration: 1.5 }, 1.5);

    window.__timelines = window.__timelines || {};
    window.__timelines["service-resolution"] = tl;
  </script>
</div>`;
      jobTitle = `Resolution_${ticketId}.mp4`;
    } else if (mode === 'batch') {
      // Mock logic for Batch CSV mode
      newHtml = `<!-- BATCH JOB TRIGGERED -->\n<!-- 100 HyperFrames HTML templates queued in background -->`;
      jobTitle = `Batch_Outreach_List_${Date.now()}.zip`;
    }

    const jobId = "VID-" + Date.now().toString();
    const jobResult = {
      id: jobId,
      title: jobTitle,
      duration: mode === 'resolution' ? "00:20" : (mode === 'knowledge' ? "00:45" : (mode === 'batch' ? "BATCH" : "00:30")),
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
