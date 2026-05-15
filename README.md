# 🌌 AURA: Neural Agent Orchestration Platform

## 🏆 HeyGen Hackathon Submission
* **Track:** Agent Track 
* **Live Demo:** [Insert Vercel Deployment Link Here]
* **Demo Video:** [Insert YouTube/Loom Link Here]

## 💡 The Problem & Solution (B2B AI Automation)
Most businesses want "Digital Employees," but standard chatbots lack human presence, and video AI lacks real-time visual context. **AURA** bridges this gap. We provide a white-label B2B framework where companies can deploy multimodal agents that **see** user problems, **speak** with empathy, and **sync** with high-fidelity avatars.

### 👁️ Visual Perception (Fal.ai)
*   **Vision Engine**: Processes user-uploaded images (e.g., broken products, technical errors) to provide visual context to the LLM before the avatar responds.

### 📈 Analytics & Evolution (Posthog)
*   **Telemetry**: Tracks agent interaction duration, visual triggers, and user sentiment.
*   **A/B Persona Testing**: Logs data to optimize which ElevenLabs voice tone yields the highest resolution rate.

## ⚙️ The Multimodal Pipeline
1. **Input:** User sends text + image.
2. **Perception:** Fal.ai extracts context from the image.
3. **Cognition:** OpenAI processes text + visual context to generate the response and determine the emotional state.
4. **Synthesis:** ElevenLabs generates audio based on the determined emotion.
5. **Presence:** HeyGen Streaming API renders the final lip-synced video response in real-time.

---

## 🚀 Technical Core Modules

AURA is built on a "Bring Your Own Key" (BYOK) infrastructure, integrating best-in-class AI engines:

### 👤 Interactive Video (HeyGen)
*   **Logic Engine**: Implementation of the Streaming API and Live Avatar initialization.
    *   [src/lib/heygen.ts](file:///Users/irham/Documents/code/aura-platform/src/lib/heygen.ts)
*   **API Layer**: Endpoints for avatar listing and session embedding.
    *   [/api/heygen/avatars](file:///Users/irham/Documents/code/aura-platform/src/app/api/heygen/avatars/route.ts)
    *   [/api/heygen/embed](file:///Users/irham/Documents/code/aura-platform/src/app/api/heygen/embed/route.ts)

### 🎙️ Neural Vocal Synthesis (ElevenLabs)
*   **Voice Integration**: Fetches and manages high-quality neural voices.
    *   [/api/voices](file:///Users/irham/Documents/code/aura-platform/src/app/api/voices/route.ts)

### 📹 Hyperframe Video Rendering
*   **Studio Engine**: HTML-to-Video synthesis for automated resolution receipts.
    *   [/api/studio](file:///Users/irham/Documents/code/aura-platform/src/app/api/studio/route.ts)
*   **Resolution Workflow**: Side-by-side video template with GSAP animations.
    *   [Resolution Mode Logic](file:///Users/irham/Documents/code/aura-platform/src/app/api/studio/route.ts#L64)

### 🧠 Knowledge & Memory (Prisma + RAG)
*   **Schema**: Multi-tenant organization and agent data models.
    *   [prisma/schema.prisma](file:///Users/irham/Documents/code/aura-platform/prisma/schema.prisma)
*   **KB Engine**: Semantic search and document vectorization logic.
    *   [/api/kb](file:///Users/irham/Documents/code/aura-platform/src/app/api/kb/route.ts)

---

## 🔍 Proof of Implementation (Code References)

For internal review or hackathon judging, here is the source code proof for our core multimodal integrations:

### ⚡ HeyGen Streaming Engine
The core logic for real-time lip-sync and session management is encapsulated in the `HeyGenManager` class.
*   **Implementation**: [`src/lib/heygen.ts`](file:///Users/irham/Documents/code/aura-platform/src/lib/heygen.ts)
*   **Live Simulation Trigger**: See the `handleStartSimulation` function in [`src/app/dashboard/forge/page.tsx`](file:///Users/irham/Documents/code/aura-platform/src/app/dashboard/forge/page.tsx).

### 🎙️ ElevenLabs Vocal Engine
We utilize ElevenLabs for high-fidelity vocal synthesis, including emotion-aware voice selection.
*   **Integration Point**: The voice listing and retrieval logic is found in [`src/app/api/voices/route.ts`](file:///Users/irham/Documents/code/aura-platform/src/app/api/voices/route.ts).
*   **Voice Processing**: Logic for determined vocal output during chat is in [`src/app/api/chat/route.ts`](file:///Users/irham/Documents/code/aura-platform/src/app/api/chat/route.ts).

### 👁️ Fal.ai Visual Intelligence
Our multimodal agents "see" user problems through Fal.ai's vision processing engine.
*   **Image Analysis Logic**: Found within the chat route handler at [`src/app/api/chat/route.ts`](file:///Users/irham/Documents/code/aura-platform/src/app/api/chat/route.ts).

### 📹 Deterministic Studio (Hyperframes)
The automated resolution receipts are rendered using a side-by-side side HUD template.
*   **Rendering Logic**: Managed in [`src/app/api/studio/route.ts`](file:///Users/irham/Documents/code/aura-platform/src/app/api/studio/route.ts).
*   **HTML Template**: The dynamic video scene structure is defined in the Studio API's prompt/template section.

---

## ☁️ Vercel Deployment Guide

To deploy AURA on Vercel, follow these steps:

### 1. Environment Variables
Configure the following variables in your Vercel Dashboard:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connection string for your production database (PostgreSQL/MySQL/SQLite). |
| `HEYGEN_API_KEY` | Your HeyGen API Key (Enterprise key for Streaming API). |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API Key. |
| `FAL_KEY` | Fal.ai Key for vision and fast processing. |
| `OPENAI_API_KEY` | OpenAI Key for the neural brain (GPT-4o). |
| `NEXT_PUBLIC_HEYGEN_AVATAR_ID` | Default Avatar ID for the simulation environment. |

### 2. Database Initialization
Before the first deployment, run the following command to sync your production database:
```bash
npx prisma db push
```

### 3. Production Build
Vercel will automatically run:
```bash
npm run build
```

---

## 🛠️ Local Development

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/IrrhammCode/aura-platform.git
    cd aura-platform
    npm install
    ```
2.  **Run Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Prisma Studio**:
    ```bash
    npx prisma studio
    ```

---

## 💎 Design Philosophy
AURA utilizes a **Neural Dark Aesthetic**, featuring:
*   **Glassmorphism**: High-transparency cards with subtle border glows.
*   **Deterministic GSAP**: Precise timeline-based animations for video rendering.
*   **Fluid HUDs**: Real-time telemetry and interaction logs.

Built with ⚡ by the **AURA Engineering Team**.
