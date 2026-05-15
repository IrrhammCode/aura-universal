
const API_KEY = "sk_V2_hgu_kcV61kpDQMX_W95bcOtO07u8tWcZi7uAp78kAjuZN6lR";

async function testHeyGen() {
  console.log("Testing api.heygen.com v1/streaming.avatars.list...");
  try {
    const res = await fetch('https://api.heygen.com/v1/streaming.avatars.list', {
      headers: { 'X-API-KEY': API_KEY }
    });
    const data = await res.json();
    console.log("Streaming List Status:", res.status);
    console.log("Streaming List Body:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Failed:", e.message);
  }
}

testHeyGen();
