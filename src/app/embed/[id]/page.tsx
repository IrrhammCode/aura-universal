'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Send, Loader2, User, Sparkles, Image as ImageIcon, X, Phone, Mic, Calendar, Video } from 'lucide-react'

export default function EmbedChat() {
  const params = useParams()
  const agentId = params.id as string
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string, sources?: any[], type?: 'chat' | 'calendly'}[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agent, setAgent] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isVideoCallMode, setIsVideoCallMode] = useState(false)
  const [isAIPaused, setIsAIPaused] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load agent config and auto-initialize simulation
    const init = async () => {
      try {
        const res = await fetch(`/api/agents/${agentId}`)
        const data = await res.json()
        setAgent(data)
        
        // Auto-Start HeyGen Simulation
        setIsLoading(true)
        const { HeyGenManager } = await import('@/lib/heygen')
        const manager = HeyGenManager.getInstance()
        
        // Use saved avatar or fallback
        const avatarToUse = data.avatarId || 'fc9c1f9f-bc99-4fd9-a6b2-8b4b5669a046'
        const voiceToUse = data.voiceId || undefined
        
        const embed = await manager.createLiveAvatarEmbed(avatarToUse, voiceToUse, true)
        setEmbedUrl(embed.url)
        setSessionId(embed.session_id)
        setIsVideoCallMode(true) // Open simulation immediately
        
        toast.success(`Neural Link Established: ${data.name} is Online`)
      } catch (err) {
        console.error("Simulation failed to auto-start:", err)
        toast.error("Failed to establish live neural link.")
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [agentId])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() && !selectedImage) return

    const userMsg = input
    const userImg = selectedImage
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setSelectedImage(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          imageContext: userImg,
          agentId: agentId,
          sessionId: sessionId,
          tone: agent?.tone || 50,
          empathy: agent?.empathy || 50,
          depth: agent?.depth || 50
        })
      })
      const data = await res.json()
      if (data.spoken_response) {
        setMessages(prev => [...prev, { role: 'agent', text: data.spoken_response, sources: data.sources }])
        
        // Handle Scheduled Meeting Action
        if (data.action_taken?.type === 'SCHEDULE_MEETING') {
           setMessages(prev => [...prev, { role: 'agent', text: '', type: 'calendly' }])
        }

        // Auto-show WhatsApp if lead captured or high urgency detected
        if (data.action_taken?.type === 'LEAD_CAPTURED' || data.posthog_event?.intent_detected === 'escalation') {
           setShowWhatsApp(true)
        }
      }
    } catch (err) {
      console.error("Chat failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVoiceMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return alert("Voice not supported")
    
    if (isVoiceMode) {
      setIsVoiceMode(false)
      return
    }

    setIsVoiceMode(true)
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onresult = (e: any) => {
       const text = e.results[0][0].transcript
       setInput(text)
       // Auto-send voice
       setTimeout(() => handleSendMessage(), 500)
    }
    recognition.onend = () => setIsVoiceMode(false)
    recognition.start()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.onload = (event) => setSelectedImage(event.target?.result as string);
     reader.readAsDataURL(file);
  }

  const themeColor = agent?.themeColor || '#06b6d4'

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      {/* Mini Header */}
      <div className="h-14 border-b border-white/10 flex items-center px-4 justify-between bg-zinc-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
           {agent?.logoUrl ? (
             <img src={agent.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
           ) : (
             <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: themeColor, backgroundColor: themeColor }} />
           )}
           <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              {agent?.name || 'Aura Assistant'}
           </span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsVideoCallMode(true)}
             className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-cyan-500 transition-all"
           >
              <Video size={16} />
           </button>
           <Sparkles size={14} className="text-zinc-600" />
        </div>
      </div>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {isVideoCallMode && (
           <motion.div 
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.1 }}
             className="absolute inset-0 z-50 bg-black flex flex-col"
           >
              <div className="flex-1 relative overflow-hidden">
                 {/* HeyGen Interactive Streaming Mock/Iframe */}
                 <iframe 
                   src={embedUrl || "https://app.heygen.com/embed/interactive-avatar"}
                   className="w-full h-full"
                   allow="autoplay; camera; microphone; fullscreen"
                 />
                 
                 <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center backdrop-blur-md">
                       <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Neural Stream Active</p>
                       <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-tighter">Latency: 240ms</p>
                    </div>
                 </div>

                 <button 
                    onClick={() => setIsVideoCallMode(false)}
                    className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-400 transition-all"
                 >
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 bg-zinc-950 border-t border-white/5 flex flex-col items-center gap-6">
                 <div className="flex gap-4">
                    <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 transition-all">
                       <Mic size={24} />
                    </button>
                    <button 
                      onClick={() => setIsVideoCallMode(false)}
                      className="w-20 h-14 rounded-3xl bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-500/20 hover:bg-red-400 transition-all"
                    >
                       <Phone size={24} className="rotate-[135deg]" />
                    </button>
                 </div>
                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Face-to-Face Neural Experience</p>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              {agent?.welcomeVideoUrl ? (
                 <div className="w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                    <iframe 
                      src={agent.welcomeVideoUrl.replace('app.heygen.com/share/', 'app.heygen.com/embed/')} 
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                 </div>
              ) : (
                 <>
                  <Sparkles size={32} className="opacity-30" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Aura is online.<br/>How can I help you today?</p>
                 </>
              )}
           </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] space-y-1.5`}>
              {msg.type === 'calendly' ? (
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                   <iframe 
                     src="https://calendly.com/d/cp9-89b-qjy" // Mock Calendly
                     className="w-full h-full"
                     frameBorder="0"
                   />
                </div>
              ) : (
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'text-black rounded-br-none font-medium' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'}`}
                  style={msg.role === 'user' ? { backgroundColor: themeColor } : {}}
                >
                  {msg.text}
                </div>
              )}
              {msg.sources && msg.sources.length > 0 && (
                 <div className="flex flex-wrap gap-1">
                    {msg.sources.map((s, si) => (
                       <span key={si} className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[7px] font-bold text-zinc-500 uppercase">
                          {s.title}
                       </span>
                    ))}
                 </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none">
                <Loader2 size={14} className="animate-spin text-zinc-500" />
             </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Action */}
      <AnimatePresence>
        {showWhatsApp && (
           <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="px-4 pb-0 pt-2"
           >
              <a 
                href="https://wa.me/628123456789" // Mock number
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-xl"
              >
                 Chat with a Human on WhatsApp
              </a>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 bg-zinc-900/50 border-t border-white/10 shrink-0">
        {selectedImage && (
           <div className="mb-3 relative inline-block">
              <img src={selectedImage} className="h-12 w-12 object-cover rounded-lg border border-white/20" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5">
                 <X size={10} />
              </button>
           </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            onClick={toggleVoiceMode}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isVoiceMode ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-zinc-400'}`}
          >
             {isVoiceMode ? <Mic size={18} /> : <Phone size={18} />}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isVoiceMode ? "Listening..." : "Ask anything..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none transition-all"
              style={{ borderColor: `${themeColor}20` }} // Subtle theme border
            />
            <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600 hover:text-zinc-400 transition-colors">
               <ImageIcon size={16} />
               <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="w-11 h-11 text-black rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30"
            style={{ backgroundColor: themeColor }}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest text-center mt-3">
           Powered by Aura AI Platform
        </p>
      </div>
    </div>
  )
}
