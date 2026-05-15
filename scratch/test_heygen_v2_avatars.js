
const API_KEY = "sk_V2_hgu_kcV61kpDQMX_W95bcOtO07u8tWcZi7uAp78kAjuZN6lR";

async function testHeyGenV2() {
  console.log("Testing api.heygen.com v2/avatars...");
  try {
    const res = await fetch('https://api.heygen.com/v2/avatars', {
      headers: { 'X-API-KEY': API_KEY }
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Failed:", e.message);
  }
}

testHeyGenV2();
