'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Mic, Brain, Sparkles, Wand2, Settings2, Waves, Play, Send, X, MessageSquare, Activity, CheckCircle, Video, Image as ImageIcon, Cpu, Zap, Fingerprint, Book } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAura } from '@/context/AuraContext'
import { toast } from 'sonner'

export default function AgentForge() {
  const { documents, setActiveAgent, activeAgent, addAgent, addInteractionLog } = useAura()
  const [tone, setTone] = useState(70)
  const [empathy, setEmpathy] = useState(85)
  const [depth, setDepth] = useState(90)
  const [voice, setVoice] = useState('Adam')
  const [avatar, setAvatar] = useState(process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID || 'fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046')
  const [isTesting, setIsTesting] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [lastEvidenceImage, setLastEvidenceImage] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', text: string, image?: string, sources?: { title: string, score: number }[] }[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isInitializingLiveAvatar, setIsInitializingLiveAvatar] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [templateType, setTemplateType] = useState('CUSTOM')
  const [themeColor, setThemeColor] = useState('#06b6d4')
  const [logoUrl, setLogoUrl] = useState('')
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('')
  const [isListening, setIsListening] = useState(false)

  const templates = [
    { id: 'CUSTOM', name: 'Custom Logic', desc: 'Raw control.', prompt: '' },
    { id: 'ECOMMERCE', name: 'Sales Agent', desc: 'Conversion focused.', prompt: 'You are an e-commerce customer support agent. Your goal is to help customers with order tracking and product recommendations.' },
    { id: 'SAAS', name: 'Growth Bot', desc: 'Onboarding specialist.', prompt: 'You are a SaaS success agent. Help new users understand product features.' },
    { id: 'HOTEL', name: 'Concierge', desc: 'Service elite.', prompt: 'You are a luxury hotel concierge. Maintain a professional, warm tone.' },
  ]

  const applyTemplate = (t: any) => {
    setTemplateType(t.id)
    setInstructions(t.prompt)
  }

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => setInputMessage(event.results[0][0].transcript)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const [voiceList, setVoiceList] = useState<any[]>([]);
  const [avatarList, setAvatarList] = useState<any[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetch('/api/heygen/avatars')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setAvatarList(data)
          if (!avatar) setAvatar(data[0].id)
        } else {
          setAvatarList([
            {
              id: 'fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046',
              name: 'Ann Doctor',
              preview_url: 'https://files2.heygen.ai/avatar/v3/26de369b2d4443e586dedf27af1e0c1d_45570/preview_talk_1.webp'
            },
            {
              id: '7b888024-f8c9-4205-95e1-78ce01497bda',
              name: 'Shawn Therapist',
              preview_url: 'https://files2.heygen.ai/avatar/v3/db2fb7fd0d044b908395a011166ab22d_45680/preview_target.webp'
            },
            {
              id: '0930fd59-c8ad-434d-ad53-b391a1768720',
              name: 'Dexter Lawyer',
              preview_url: 'https://files2.heygen.ai/avatar/v3/e20ac0c902184ff793e75ae4e139b7dc_45600/preview_target.webp'
            }
          ])
          if (!avatar) setAvatar('fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046')
        }
      } catch (err) { console.error(err); }
    };

    const fetchVoices = async () => {
      try {
        const res = await fetch('/api/voices')
        const data = await res.json()
        if (Array.isArray(data)) {
          setVoiceList(data.slice(0, 10))
          if (data.length > 0 && !voice) setVoice(data[0].id)
        }
      } catch (err) { console.error(err); }
    }

    fetchAvatars();
    fetchVoices();
  }, []);

  const playVoicePreview = (url: string, id: string) => {
    if (playingVoiceId === id) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);
    audioRef.current.play();
    setPlayingVoiceId(id);
    audioRef.current.onended = () => setPlayingVoiceId(null);
  }

  const startSimulation = async () => {
    setIsTesting(true);
    setEmbedUrl(null);
    setSessionId(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      if (apiKey && apiKey !== '••••••••••••••••') {
        setIsInitializingLiveAvatar(true);
        const { HeyGenManager } = await import('@/lib/heygen');
        const manager = HeyGenManager.getInstance();
        
        const knowledgeContent = documents
          .filter(d => selectedDocs.includes(d.id))
          .map(d => `SOURCE: ${d.title}\nCONTENT: ${d.content}`)
          .join('\n\n---\n\n');

        const embed = await manager.createLiveAvatarEmbed(
          avatar, 
          undefined, 
          true, 
          knowledgeContent, 
          instructions
        );
        
        setEmbedUrl(embed.url);
        setSessionId(embed.session_id);
      }
    } catch (err: any) { 
      console.error("Simulation Start Error:", err); 
      toast.error(err.message?.includes("ConnectTimeoutError") || err.message?.includes("fetch failed")
        ? "⚠️ Network Error: Failed to reach HeyGen server. Check your internet connection."
        : `❌ LiveAvatar Error: ${err.message || "Failed to launch session. Check your HeyGen API key."}`
      );
    }
    finally { setIsInitializingLiveAvatar(false); }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return
    const msg = inputMessage || (selectedImage ? '📸 Analyze this image' : '')
    const img = selectedImage
    if (img) setLastEvidenceImage(img)
    setMessages(prev => [...prev, { role: 'user', text: msg, image: img || undefined }])
    setInputMessage('')
    setSelectedImage(null)

    if (img) {
      setMessages(prev => [...prev, { role: 'agent', text: '👁️ Neural Vision processing image...' }])
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg, 
          imageContext: img, 
          sessionId: sessionId || "demo-session", 
          tone, 
          empathy, 
          depth 
        })
      })
      const data = await res.json()
      if (data.spoken_response) {
        setMessages(prev => {
          const filtered = img 
            ? prev.filter(m => m.text !== '👁️ Neural Vision processing image...') 
            : prev;
          return [...filtered, { role: 'agent', text: data.spoken_response, sources: data.sources }]
        })
        addInteractionLog({ input: msg, response: data.spoken_response, vision: data.posthog_event?.intent_detected || '-', hasImage: !!img })
        
        if (sessionId && data.spoken_response) {
          fetch('/api/heygen/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, text: data.spoken_response })
          }).catch(err => console.error('Speak error:', err));
        }
      }
    } catch (error) { console.error(error); }
  }

  const selectedAvatarObj = avatarList.find(a => a.id === avatar)
  const previewImage = selectedAvatarObj?.preview_url || "/avatar.png"

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleResolveCase = async () => {
    setIsResolving(true)
    const ticketId = "TCK-" + Math.floor(1000 + Math.random() * 9000)
    
    toast.promise(
      fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticketId,
          issueTitle: "Screen/Hardware Damage Report",
          issueSummary: "Customer reported physical damage to the device. Screen is cracked as per visual evidence.",
          issueImage: lastEvidenceImage,
          customerName: "Valued Customer",
          customerEmail: "customer@aura-demo.com"
        })
      }).then(res => res.json()),
      {
        loading: 'Saving Case Data to Neural Studio...',
        success: (data) => {
          setIsResolving(false)
          setIsTesting(false)
          return `Ticket #${ticketId} archived. Review in Video Studio.`
        },
        error: 'Failed to archive ticket.'
      }
    )
  }

  const [selectedDocs, setSelectedDocs] = useState<string[]>([])

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-2">
            <Fingerprint className="text-cyan-500" size={24} />
            Agent <span className="text-zinc-500 font-medium">Forge</span>
          </h1>
          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Powered by Groq Neural Engine V4.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] font-black text-zinc-600 uppercase">Neural Engine</p>
            <p className="text-xs font-mono text-cyan-500">Llama 3.3-70b</p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <button onClick={() => setMessages([])} className="p-2.5 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: Identity Synthesis (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden relative min-h-[550px] border border-white/5 group shadow-2xl">
            <img
              src={previewImage}
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

            {/* Overlay HUD */}
            <div className="absolute top-8 left-8 flex gap-3">
              <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Neural Link: Stable</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Identity: AURA-99</span>
              </div>
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Project <br /> Obsidian</h2>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Zap size={10} /> High Fidelity Synthetic Presence
                </p>
              </div>

              {!isTesting ? (
                <motion.button
                  onClick={startSimulation}
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-5 rounded-full bg-white text-black flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                >
                  <Play size={16} fill="currentColor" /> Initialize Simulation
                </motion.button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setIsTesting(false)} className="px-6 py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Terminate
                  </button>
                </div>
              )}
            </div>

            {/* Simulation Overlay */}
            <AnimatePresence>
              {isTesting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#06070d] z-[999] overflow-y-auto custom-scrollbar"
                >
                  <div className="max-w-5xl mx-auto w-full px-6 py-12 lg:py-20 space-y-12">
                    
                    {/* Header HUD */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Neural Stream Active</h2>
                        </div>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Identity Authentication: Aura-99 Stable</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {lastEvidenceImage && (
                          <button
                            onClick={handleResolveCase}
                            disabled={isResolving}
                            className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                          >
                            <Zap size={14} className="animate-pulse" /> {isResolving ? 'Processing...' : 'Generate Resolution'}
                          </button>
                        )}
                        <button
                          onClick={() => setIsTesting(false)}
                          className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-red-500/5"
                        >
                          <X size={14} /> Terminate
                        </button>
                      </div>
                    </div>

                    {/* 🎥 THE STREAM (FULL SIZE) */}
                    <div className="w-full relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[32px] blur-xl opacity-50" />
                      <div className="relative w-full aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        {isInitializingLiveAvatar ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">Syncing Synapse...</p>
                          </div>
                        ) : embedUrl ? (
                          <iframe
                            src={embedUrl}
                            allow="microphone; camera; display-capture"
                            className="w-full h-full border-none"
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <Video size={48} className="text-zinc-800" />
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Awaiting Video Handshake...</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ⌨️ THE COMMAND (INPUT) */}
                    <div className="flex gap-4 items-center bg-white/[0.03] p-4 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
                      <button onClick={startListening} className={`p-4 rounded-2xl border transition-all ${isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-zinc-500 border-white/10'}`}>
                        <Mic size={22} />
                      </button>
                      <div className="flex-1 relative">
                        <AnimatePresence>
                          {selectedImage && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute bottom-full mb-8 left-0 z-50"
                            >
                              <div className="relative group p-1.5 bg-cyan-500 rounded-2xl shadow-3xl">
                                <img src={selectedImage} className="w-40 h-40 object-cover rounded-xl" />
                                <button
                                  onClick={() => setSelectedImage(null)}
                                  className="absolute top-2 right-2 p-2 bg-black/80 rounded-full text-white shadow-xl"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a neural directive..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700"
                        />
                      </div>
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (f) => setSelectedImage(f.target?.result as string)
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <button 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className={`p-4 rounded-2xl border transition-all ${selectedImage ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white'}`}
                      >
                        <ImageIcon size={22} />
                      </button>
                      <button onClick={handleSendMessage} className="p-4 rounded-2xl bg-cyan-500 text-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Send size={22} />
                      </button>
                    </div>

                    {/* 📜 THE TRACE (LOGS) */}
                    <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                      <div className="px-8 py-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <Activity size={14} className="text-cyan-500" />
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Synaptic Interaction Logs</p>
                        </div>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                      </div>
                      <div className="p-8 space-y-8 min-h-[300px]" ref={chatRef}>
                        {messages.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <Brain size={48} className="text-zinc-600 mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Awaiting Neural Activity...</p>
                          </div>
                        )}
                        {messages.map((m, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-6 border-b border-white/[0.03] pb-8 last:border-0"
                          >
                            <div className={`mt-1 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest h-fit ${
                              m.role === 'user' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {m.role === 'user' ? 'USER' : 'AURA'}
                            </div>
                            <div className="flex-1 space-y-4">
                              {m.image && (
                                <div className="w-72 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                  <img src={m.image} className="w-full aspect-video object-cover" />
                                </div>
                              )}
                              <p className="text-sm text-zinc-300 font-medium leading-relaxed max-w-3xl">
                                {m.text}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="h-20" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Configuration (5 COLS) */}
        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

          {/* Traits & Core */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Settings2 size={16} className="text-cyan-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Neural Parameters</h3>
            </div>
            <div className="space-y-5">
              <CompactSlider label="Resonance" value={tone} onChange={setTone} />
              <CompactSlider label="Empathy" value={empathy} onChange={setEmpathy} />
              <CompactSlider label="Reasoning" value={depth} onChange={setDepth} />
            </div>
          </div>

          {/* Visual & Vocal Selection */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Video size={16} className="text-purple-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Visual & Vocal</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {avatarList.slice(0, 3).map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAvatar(a.id)}
                    className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all duration-500 ${avatar === a.id
                        ? 'border-cyan-500 scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : 'border-white/5 hover:border-white/20'
                      }`}
                  >
                    {a.preview_url ? (
                      <img src={a.preview_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center justify-center p-2 space-y-2 relative">
                        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center relative z-10 ${avatar === a.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600 bg-white/5'}`}>
                          <Fingerprint size={16} />
                        </div>
                        <span className={`text-[7px] font-black uppercase tracking-[0.2em] text-center relative z-10 ${avatar === a.id ? 'text-white' : 'text-zinc-600'}`}>
                          {a.name}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/2 w-full animate-scan pointer-events-none opacity-20" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                {voiceList.map(v => (
                  <div
                    key={v.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${voice === v.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-zinc-500'}`}
                  >
                    <button
                      onClick={() => setVoice(v.id)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <Waves size={14} className={voice === v.id ? 'text-cyan-400' : 'text-zinc-600'} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest">{v.name}</span>
                        <span className="text-[7px] font-bold text-zinc-600 uppercase truncate max-w-[150px]">{v.description}</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      {v.preview_url && (
                        <button
                          onClick={() => playVoicePreview(v.preview_url, v.id)}
                          className={`p-2 rounded-lg transition-all ${playingVoiceId === v.id ? 'bg-cyan-500 text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}
                        >
                          <Play size={12} fill={playingVoiceId === v.id ? 'currentColor' : 'none'} />
                        </button>
                      )}
                      <CheckCircle size={12} className={voice === v.id ? 'text-cyan-500 opacity-100' : 'opacity-0'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Behavior & Deployment */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Brain size={16} className="text-yellow-500" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Logic & Action</h3>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black text-emerald-500 uppercase">{selectedDocs.length} Neural Docs Linked</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Knowledge Selector */}
              <div className="space-y-2">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Select Knowledge Matrix Assets</p>
                <div className="max-h-[120px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                  {documents.length > 0 ? documents.map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-all ${selectedDocs.includes(doc.id) ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Book size={10} className={selectedDocs.includes(doc.id) ? 'text-cyan-400' : 'text-zinc-600'} />
                        <span className={`text-[9px] font-bold truncate max-w-[180px] ${selectedDocs.includes(doc.id) ? 'text-white' : 'text-zinc-500'}`}>{doc.title}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full border ${selectedDocs.includes(doc.id) ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'border-white/20'}`} />
                    </button>
                  )) : (
                    <p className="text-[8px] text-zinc-600 italic">No assets vectorized in Knowledge Matrix.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={`p-3 rounded-xl border text-left transition-all ${templateType === t.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                  >
                    <p className="text-[9px] font-black text-white uppercase tracking-tighter">{t.name}</p>
                    <p className="text-[7px] text-zinc-600 font-bold uppercase">{t.desc}</p>
                  </button>
                ))}
              </div>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Define neural boundaries..."
                className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] text-zinc-400 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <button
                onClick={async () => {
                  const id = "AURA-" + Math.floor(1000 + Math.random() * 9000)
                  
                  toast.promise(
                    addAgent({
                      name: id,
                      avatarId: avatar,
                      voiceId: voice,
                      instructions: instructions,
                      templateType: templateType,
                      tone: tone,
                      empathy: empathy,
                      depth: depth
                    }),
                    {
                      loading: 'Archiving Neural Identity...',
                      success: 'Identity Deployed to Fleet Command!',
                      error: 'Deployment Failed.'
                    }
                  )
                  setIsDeployed(true)
                }}
                className="w-full py-4 rounded-xl bg-cyan-500 text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                {isDeployed ? 'Neural Sync Complete' : 'Deploy Identity'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function CompactSlider({ label, value, onChange }: any) {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
        <span className="text-cyan-400">{value}%</span>
      </div>
      <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${value}%` }} className="h-full bg-cyan-500" />
        <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
    </div>
  )
}
