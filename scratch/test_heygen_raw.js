
const API_KEY = "sk_V2_hgu_kcV61kpDQMX_W95bcOtO07u8tWcZi7uAp78kAjuZN6lR";

async function testHeyGen() {
  console.log("Testing api.heygen.com v1/streaming.avatars.list (Text)...");
  try {
    const res = await fetch('https://api.heygen.com/v1/streaming.avatars.list', {
      headers: { 'X-API-KEY': API_KEY }
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body snippet:", text.substring(0, 500));
  } catch (e) {
    console.log("Failed:", e.message);
  }
}

testHeyGen();
