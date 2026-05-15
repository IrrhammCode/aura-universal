import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY || process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

  if (!apiKey) {
    console.error('❌ [LiveAvatar] API Key missing in environment');
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  console.log(`📡 [LiveAvatar] Fetching avatars with key: ${apiKey.substring(0, 10)}...`);

  try {
    const response = await fetch('https://api.liveavatar.com/v1/avatars/public', {
      headers: {
        'X-API-KEY': apiKey,
        'accept': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json();
    console.log(`📥 [LiveAvatar] API Response Code: ${data.code}`);

    // Some endpoints return 100, others return 1000 for success
    if (data.code !== 100 && data.code !== 1000) {
      console.warn('⚠️ [LiveAvatar] Primary endpoint failed, trying HeyGen V2 backup...', data);
      
      const backupRes = await fetch('https://api.heygen.com/v2/avatars', {
        headers: { 'X-API-KEY': apiKey, 'accept': 'application/json' }
      });
      const backupData = await backupRes.json();
      
      if (backupRes.ok && backupData.data?.avatars) {
        console.log('✅ [LiveAvatar] Backup HeyGen V2 success');
        return NextResponse.json(backupData.data.avatars.map((a: any) => ({
          id: a.avatar_id,
          name: a.avatar_name,
          preview_url: a.preview_image_url,
          status: 'active'
        })));
      }

      console.warn('❌ [LiveAvatar] Both endpoints failed, using hardcoded fallback');
      return NextResponse.json([
        { 
          id: 'fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046', 
          name: 'Ann Doctor (Fallback)', 
          preview_url: 'https://files2.heygen.ai/avatar/v3/26de369b2d4443e586dedf27af1e0c1d_45570/preview_talk_1.webp', 
          status: 'active' 
        },
        { 
          id: '7b888024-f8c9-4205-95e1-78ce01497bda', 
          name: 'Shawn Therapist (Fallback)', 
          preview_url: 'https://files2.heygen.ai/avatar/v3/db2fb7fd0d044b908395a011166ab22d_45680/preview_target.webp', 
          status: 'active' 
        }
      ]);
    }

    const avatars = data.data?.results?.map((a: any) => ({
      id: a.id,
      name: a.name,
      preview_url: a.preview_url,
      status: 'active'
    })) || [];

    console.log(`✅ [LiveAvatar] Successfully loaded ${avatars.length} avatars`);
    return NextResponse.json(avatars);
  } catch (error: any) {
    console.error('🔥 [LiveAvatar] Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
