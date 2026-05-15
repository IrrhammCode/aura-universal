
const API_KEY = "sk_V2_hgu_kcV61kpDQMX_W95bcOtO07u8tWcZi7uAp78kAjuZN6lR";

async function testHeyGen() {
  console.log("Testing HeyGen API with X-API-KEY...");
  try {
    const res = await fetch('https://api.liveavatar.com/v1/avatars', {
      headers: { 'X-API-KEY': API_KEY }
    });
    const data = await res.json();
    console.log("X-API-KEY Status:", res.status);
    console.log("X-API-KEY Body:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("X-API-KEY Failed:", e.message);
  }

  console.log("\nTesting HeyGen API with Authorization Bearer...");
  try {
    const res = await fetch('https://api.liveavatar.com/v1/avatars', {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const data = await res.json();
    console.log("Bearer Status:", res.status);
    console.log("Bearer Body:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Bearer Failed:", e.message);
  }
}

testHeyGen();
