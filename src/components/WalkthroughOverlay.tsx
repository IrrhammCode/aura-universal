import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, X, Volume2, Info, Target, Zap, Bot, Book, Activity, Video, Box } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    id: 0,
    title: "Introducing AURA",
    text: "Aura is an Autonomous Neural Workforce System. We bridge the gap between AI and human-like interaction by combining Video Avatars, Neural Voices, and real-time Knowledge RAG into a single, seamless platform.",
    target: "/dashboard",
    icon: <Box className="text-white" />,
    audio: "Welcome to Aura. Aura is an Autonomous Neural Workforce System. We bridge the gap between AI and human-like interaction by combining Video Avatars, Neural Voices, and real-time Knowledge into a single, seamless platform.",
    highlightPos: { top: '50%', left: '50%', width: '300px', height: '300px' } // Center
  },
  {
    id: 1,
    title: "Neural Command Center",
    text: "This is your mission control. Monitor every heartbeat of your AI fleet, from global node activity to real-time interaction logs and sentiment analysis.",
    target: "/dashboard",
    icon: <Zap className="text-cyan-400" />,
    audio: "This is your mission control. Monitor every heartbeat of your AI fleet, from global node activity to real-time interaction logs and sentiment analysis.",
    highlightPos: { top: '160px', left: '128px', width: '220px', height: '48px' } // Sidebar Command Center
  },
  {
    id: 2,
    title: "Agent Forge",
    text: "Craft your digital employees here. In the Forge, you can customize neural traits, voice profiles, and specialized personas for your agents.",
    target: "/dashboard/forge",
    icon: <Bot className="text-purple-400" />,
    audio: "Craft your digital employees here. In the Forge, you can customize neural traits, voice profiles, and specialized personas for your agents.",
    highlightPos: { top: '256px', left: '128px', width: '220px', height: '48px' } // Sidebar Forge
  },
  {
    id: 3,
    title: "Knowledge Matrix",
    text: "Train your agents with your company data. Upload PDFs or crawl your website to ensure Aura has the intelligence it needs to represent your business accurately.",
    target: "/dashboard/kb",
    icon: <Book className="text-emerald-400" />,
    audio: "Train your agents with your company data. Upload PDFs or crawl your website to ensure Aura has the intelligence it needs to represent your business accurately.",
    highlightPos: { top: '445px', left: '128px', width: '220px', height: '48px' } // Sidebar KB
  },
  {
    id: 4,
    title: "Neural Analytics",
    text: "Data-driven growth. Track customer sentiment, capture leads automatically, and analyze the performance of your entire AI workforce at a glance.",
    target: "/dashboard/analytics",
    icon: <Activity className="text-pink-400" />,
    audio: "Data-driven growth. Track customer sentiment, capture leads automatically, and analyze the performance of your entire AI workforce at a glance.",
    highlightPos: { top: '590px', left: '128px', width: '220px', height: '48px' } // Sidebar Analytics
  },
  {
    id: 5,
    title: "Interactive Video Studio",
    text: "Our breakthrough technology. Aura enables face-to-face AI interactions using HeyGen's live avatar streaming. It's not just a chatbot; it's a digital presence.",
    target: "/dashboard/studio",
    icon: <Video className="text-red-400" />,
    audio: "Our breakthrough technology. Aura enables face-to-face AI interactions using live avatar streaming. It is not just a chatbot; it is a digital presence.",
    highlightPos: { top: '540px', left: '128px', width: '220px', height: '48px' } // Sidebar Studio
  }
]

export function WalkthroughOverlay() {
  const { walkthroughStep, setWalkthroughStep, isWalkthroughActive, setIsWalkthroughActive } = useAura()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const router = useRouter()

  const speak = (text: string) => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1.05
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (isWalkthroughActive && walkthroughStep >= 0 && walkthroughStep < steps.length) {
      const step = steps[walkthroughStep]
      // Auto-navigate to the correct page
      router.push(step.target)
      // Speak the description
      speak(step.audio)
    }
  }, [walkthroughStep, isWalkthroughActive, router])

  if (!isWalkthroughActive || walkthroughStep < 0) return null

  const currentStep = steps[walkthroughStep]

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Dynamic Neural Spotlight Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]">
        <motion.div
          animate={{
            top: currentStep.highlightPos.top,
            left: currentStep.highlightPos.left,
            width: currentStep.highlightPos.width,
            height: currentStep.highlightPos.height,
            opacity: 1
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        />

        {/* Animated Arrow Pointer */}
        <motion.div
          animate={{
            top: currentStep.highlightPos.top,
            left: `calc(${currentStep.highlightPos.left} + ${currentStep.highlightPos.width}/2 + 20px)`,
            opacity: walkthroughStep === 0 ? 0 : 1
          }}
          className="absolute z-20 flex items-center gap-3 -translate-y-1/2"
        >
          <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
          <div className="px-3 py-1 bg-cyan-500 text-black text-[9px] font-black uppercase rounded-full tracking-widest shadow-lg">
            Focus Here
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={walkthroughStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[600px] pointer-events-auto z-30"
        >
          <div className="glass-card p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-8 bg-zinc-950/80">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  {currentStep.icon}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-1.5 opacity-70">Aura Neural Guide · Step {walkthroughStep + 1}</h3>
                  <h2 className="text-2xl font-bold text-white tracking-tighter">{currentStep.title}</h2>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsWalkthroughActive(false)
                  window.speechSynthesis.cancel()
                }}
                className="p-2 text-zinc-700 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-base text-zinc-300 leading-relaxed font-medium">
              {currentStep.text}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-cyan-500 animate-pulse shadow-[0_0_12px_cyan]' : 'bg-zinc-800'}`} />
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  {isSpeaking ? 'Aura is speaking...' : 'Voice Ready'}
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (walkthroughStep > 0) setWalkthroughStep(walkthroughStep - 1)
                  }}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${walkthroughStep > 0 ? 'bg-white/5 text-white hover:bg-white/10' : 'opacity-0 pointer-events-none'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (walkthroughStep < steps.length - 1) {
                      setWalkthroughStep(walkthroughStep + 1)
                    } else {
                      setIsWalkthroughActive(false)
                      window.speechSynthesis.cancel()
                    }
                  }}
                  className="px-8 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-3"
                >
                  {walkthroughStep < steps.length - 1 ? 'Continue Analysis' : 'Finish Induction'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
