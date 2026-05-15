'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Mic, Brain, Sparkles, Wand2, Settings2, Waves, Play, Send, X, MessageSquare, Activity, CheckCircle, Video } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAura } from '@/context/AuraContext'

export default function AgentForge() {
  const { documents, setActiveAgent, addInteractionLog } = useAura()
  const [tone, setTone] = useState(70)
  const [empathy, setEmpathy] = useState(85)
  const [depth, setDepth] = useState(90)
  const [voice, setVoice] = useState('Adam')
  const [avatar, setAvatar] = useState('aura-x')
  const [isTesting, setIsTesting] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [isInitializingLiveAvatar, setIsInitializingLiveAvatar] = useState(false)

  const startSimulation = async () => {
    setIsTesting(true);
    setEmbedUrl(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      if (apiKey && apiKey !== '••••••••••••••••') {
         setIsInitializingLiveAvatar(true);
         const { HeyGenManager } = await import('@/lib/heygen');
         const manager = HeyGenManager.getInstance();
         const embed = await manager.createLiveAvatarEmbed(avatar, undefined, true);
         setEmbedUrl(embed.url);
      }
    } catch (err) {
      console.error("Failed to start LiveAvatar:", err);
      // Fallback to text mode handled implicitly by embedUrl === null
    } finally {
      setIsInitializingLiveAvatar(false);
    }
  }

  const [avatarList, setAvatarList] = useState<any[]>([
    { id: 'aura-x', name: 'Aura-X', preview_url: null },
    { id: 'josh_lite_20230714', name: 'Josh', preview_url: null },
    { id: 'sarah_pro', name: 'Sarah', preview_url: null }
  ])

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
        if (!apiKey || apiKey === '••••••••••••••••') return;
        
        const res = await fetch('https://api.liveavatar.com/v1/avatars/public', {
          headers: { 'X-API-KEY': apiKey }
        });
        const json = await res.json();
        if (json.code === 100 || json.code === 1000) {
           if (json.data && json.data.results && json.data.results.length >= 3) {
             setAvatarList(json.data.results.slice(0, 3));
             setAvatar(json.data.results[0].id);
           }
        }
      } catch (err) {
        console.error("Failed to fetch LiveAvatar avatars:", err);
      }
    };
    fetchAvatars();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    const msg = inputMessage
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInputMessage('')
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg, 
          imageContext: null,
          tone,
          empathy,
          depth
        })
      })
      const data = await res.json()
      if (data.spoken_response) {
        setMessages(prev => [...prev, { role: 'agent', text: data.spoken_response }])
        
        // Add to global Interaction Logs
        addInteractionLog({
          input: msg,
          response: data.spoken_response,
          vision: data.posthog_event?.intent_detected || '-',
          hasImage: false
        })
      }
    } catch (error) {
      console.error('Forge Chat Error:', error)
      setMessages(prev => [...prev, { role: 'agent', text: "ERROR: Communication with brain failed." }])
    }
  }

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Agent <span className="text-zinc-500 font-medium">Forge</span></h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Synthetic Identity Architect</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Avatar Synthesis Preview */}
        <div className="lg:col-span-7 glass-card rounded-3xl overflow-hidden relative min-h-[600px] group">
          <img 
            src="/avatar.png" 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <div className="space-y-4">
               <div className="flex gap-2">
                  <Badge label="ID: AURA-99" />
                  <Badge label="STABLE" color="bg-emerald-500" />
               </div>
               <h2 className="text-5xl font-bold text-white tracking-tighter uppercase">Project <br /> Obsidian</h2>
            </div>
            
            {!isTesting && !isDeployed && (
              <motion.button 
                onClick={startSimulation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-full bg-white text-black flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest shadow-2xl"
              >
                <MessageSquare size={16} /> Test Identity
              </motion.button>
            )}
            
            {isDeployed && (
              <div className="px-6 py-4 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest backdrop-blur-md">
                <CheckCircle size={16} /> Identity Deployed
              </div>
            )}
          </div>

          {/* Chat Interface Overlay */}
          <AnimatePresence>
            {isTesting && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl z-20 flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-cyan-500 overflow-hidden">
                         <img src="/avatar.png" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Aura Test Instance</h3>
                         <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400">
                            <Activity size={10} /> Live Simulation
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setIsTesting(false)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <X size={16} className="text-white" />
                   </button>
                </div>

                {/* Dynamic Content: LiveAvatar Embed OR Text Fallback */}
                {isInitializingLiveAvatar ? (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <div className="space-y-2 text-center">
                         <p className="text-[12px] font-bold text-cyan-500 uppercase tracking-widest animate-pulse">Initializing Neural Link</p>
                         <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Establishing secure WebRTC stream...</p>
                      </div>
                   </div>
                ) : embedUrl ? (
                   <div className="flex-1 flex flex-col">
                      <iframe 
                         src={embedUrl}
                         allow="microphone; camera"
                         className="flex-1 w-full border-none bg-black/50"
                      />
                   </div>
                ) : (
                   <>
                     {/* Chat Log (Fallback) */}
                     <div ref={chatRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                        {messages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-500 text-black rounded-br-none' : 'glass-card text-white rounded-bl-none'}`}>
                                {msg.text}
                             </div>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                             <MessageSquare size={32} />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Text Fallback Mode.<br/>Start typing to test the agent's logic.</p>
                          </div>
                        )}
                     </div>

                     {/* Input Area */}
                     <div className="p-6 border-t border-white/10 bg-black">
                        <div className="relative">
                           <input 
                              type="text" 
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Send a test message..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                           />
                           <button 
                              onClick={handleSendMessage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-colors"
                           >
                              <Send size={16} />
                           </button>
                        </div>
                     </div>
                   </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanner Overlay */}
          {!isTesting && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/30 animate-scan pointer-events-none" />}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 space-y-8">
            <SectionHeader icon={<Settings2 size={16}/>} title="Neural Configuration" />
            
            <div className="space-y-8">
               <TraitSlider label="Vocal Tone / Resonance" value={tone} onChange={setTone} />
               <TraitSlider label="Empathy Quotient" value={empathy} onChange={setEmpathy} />
               <TraitSlider label="Reasoning Depth" value={depth} onChange={setDepth} />
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <SectionHeader icon={<Video size={16}/>} title="Visual Identity (HeyGen)" />
            <div className="grid grid-cols-3 gap-4">
               {avatarList.map((a) => (
                 <div 
                   key={a.id}
                   onClick={() => setAvatar(a.id)}
                   className={`p-4 rounded-2xl border cursor-pointer transition-all text-center space-y-2 flex flex-col items-center justify-center ${avatar === a.id ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                 >
                    <div className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${avatar === a.id ? 'border-cyan-500' : 'border-transparent'}`}>
                       {a.preview_url ? (
                         <img src={a.preview_url} alt={a.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600">
                            {a.name.charAt(0)}
                         </div>
                       )}
                    </div>
                    <div>
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${avatar === a.id ? 'text-cyan-400' : 'text-white'}`}>{a.name}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <SectionHeader icon={<Waves size={16}/>} title="Vocal Synthesis (ElevenLabs)" />
            <div className="space-y-3">
               {[
                 { id: 'Adam', name: 'Adam - Professional', desc: 'Deep, authoritative, stable resonance.' },
                 { id: 'Rachel', name: 'Rachel - Warm', desc: 'Approachable, clear, and empathetic.' },
                 { id: 'Domi', name: 'Domi - Dynamic', desc: 'Energetic, fast-paced, and engaging.' }
               ].map((v) => (
                 <div 
                   key={v.id}
                   onClick={() => setVoice(v.id)}
                   className={`flex items-center gap-6 p-4 rounded-2xl border cursor-pointer transition-all ${voice === v.id ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                 >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${voice === v.id ? 'bg-cyan-500 text-black shadow-cyan-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                       <Play size={20} fill="currentColor" />
                    </div>
                    <div className="flex-1 space-y-1">
                       <p className={`text-xs font-bold uppercase tracking-widest ${voice === v.id ? 'text-cyan-400' : 'text-white'}`}>{v.name}</p>
                       <p className="text-[10px] text-zinc-500 italic">{v.desc}</p>
                    </div>
                    {voice === v.id && <CheckCircle size={16} className="text-cyan-500" />}
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <SectionHeader icon={<Brain size={16}/>} title="Knowledge Matrix" />
            <div className="grid grid-cols-2 gap-4">
               {documents.map((doc, idx) => (
                 <KnowledgeTile key={doc.id} label={doc.title.replace('.pdf', '').replace('.md', '')} size={doc.size} active={idx === 0} />
               ))}
               {documents.length === 0 && <p className="text-xs text-zinc-500">No documents synced.</p>}
            </div>
          </div>

          <button 
             onClick={() => {
                setActiveAgent({ id: 'aura-01', name: 'Aura / Alpha', tone, empathy })
                setIsDeployed(true)
             }}
             disabled={isDeployed}
             className={`w-full py-6 font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all flex justify-center items-center gap-3 ${isDeployed ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed border border-emerald-500/50' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]'}`}
          >
             {isDeployed ? <><CheckCircle size={16}/> Identity Synchronized</> : <><Sparkles size={16} /> Deploy Configuration</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-cyan-500">{icon}</div>
      <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</h3>
    </div>
  )
}

function TraitSlider({ label, value, onChange }: any) {
  return (
    <div className="space-y-4 relative group">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono text-white group-hover:text-cyan-400 transition-colors">{value}%</span>
      </div>
      <div className="relative h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-white group-hover:bg-cyan-500 transition-colors rounded-full" 
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        />
      </div>
    </div>
  )
}

function KnowledgeTile({ label, size, active }: any) {
  return (
    <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-white/10 border-white/20' : 'border-white/5 hover:border-white/10'}`}>
       <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</p>
       <p className="text-[9px] font-mono text-zinc-600">{size}</p>
    </div>
  )
}

function Badge({ label, color = "bg-white/10" }: any) {
  return (
    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-white ${color}`}>
      {label}
    </span>
  )
}
