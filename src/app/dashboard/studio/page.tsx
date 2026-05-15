'use client'

import { Video, Sparkles, Play, Download, Clock, Layers, Book, Users, Wand2, Loader2, Globe, Phone, X, Mic, Send, MessageSquare, Activity } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function VideoStudio() {
  const { documents, activeAgent, addTelemetryLog } = useAura()
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [studioMode, setStudioMode] = useState<'knowledge' | 'outreach' | 'live' | 'resolution'>('live')
  const [synthesisGoal, setSynthesisGoal] = useState('')
  const [targetName, setTargetName] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  
  // Live Call States
  const [isInCall, setIsInCall] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  
  useEffect(() => {
    if (studioMode === 'resolution') {
      fetch('/api/tickets')
        .then(res => res.json())
        .then(data => setTickets(data))
        .catch(err => console.error("Failed to fetch tickets", err))
    }
  }, [studioMode])

  const handleGenerateResolution = async () => {
    if (!selectedTicket || !synthesisGoal) {
      toast.error("Please select a ticket and provide a resolution prompt.");
      return;
    }

    setIsSynthesizing(true);
    addTelemetryLog({ source: 'HYPERFRAME', trace: `Generating Resolution Video for ${selectedTicket.ticketId}...`, status: 'PROCESSING' });

    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'resolution',
          agentId: activeAgent?.id || 'aura-x',
          ticketId: selectedTicket.ticketId,
          issueImage: selectedTicket.issueImage,
          instruction: synthesisGoal,
          empathy: 90
        })
      });
      const data = await res.json();
      toast.success(`Hyperframe Rendered! Sent to ${selectedTicket.customerEmail}`);
      addTelemetryLog({ source: 'HYPERFRAME', trace: `Resolution Video Ready: ${data.id}`, status: 'SUCCESS' });
    } catch (err) {
      toast.error("Failed to generate resolution video.");
    } finally {
      setIsSynthesizing(false);
    }
  }

  const handleStartCall = async () => {
    setIsConnecting(true)
    addTelemetryLog({ source: 'LIVE_STREAM', trace: 'Initializing Neural Link for Live Video...', status: 'PROCESSING' })
    
    try {
      const { HeyGenManager } = await import('@/lib/heygen')
      const manager = HeyGenManager.getInstance()
      const avatarId = activeAgent?.avatarId || 'aura-x'
      const embed = await manager.createLiveAvatarEmbed(avatarId, undefined, true)
      setEmbedUrl(embed.url)
      setIsInCall(true)
      addTelemetryLog({ source: 'LIVE_STREAM', trace: 'Neural Link Established. Call Active.', status: 'SUCCESS' })
    } catch (err) {
      console.error("Failed to start Live Call", err)
      toast.error("Failed to establish video link.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Neural <span className="text-zinc-500 font-medium">Studio</span></h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">
             Interactive Avatar & Video Engine
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
           <div className="text-right">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Agent</p>
              <p className="text-xs font-bold text-white uppercase">{activeAgent?.name || 'AURA / ALPHA'}</p>
           </div>
           <div className="w-10 h-10 rounded-full border border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Users size={20} />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        
        {/* SIDEBAR CONFIG (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 space-y-8 h-full flex flex-col">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <Wand2 size={16} className="text-cyan-400" />
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Studio Mode</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 <ModeButton 
                   icon={<Phone size={18} />} 
                   title="Neural Live Call" 
                   desc="Real-time Face-to-Face" 
                   active={studioMode === 'live'} 
                   onClick={() => setStudioMode('live')} 
                 />
                 <ModeButton 
                   icon={<Book size={18} />} 
                   title="Knowledge Summary" 
                   desc="Doc-to-Video Synthesis" 
                   active={studioMode === 'knowledge'} 
                   onClick={() => setStudioMode('knowledge')} 
                 />
                 <ModeButton 
                   icon={<Users size={18} />} 
                   title="Hyper Outreach" 
                   desc="Personalized AI Pitch" 
                   active={studioMode === 'outreach'} 
                   onClick={() => setStudioMode('outreach')} 
                 />
                 <ModeButton 
                   icon={<Activity size={18} />} 
                   title="Resolution Video" 
                   desc="Post-Service Follow-up" 
                   active={studioMode === 'resolution'} 
                   onClick={() => setStudioMode('resolution')} 
                 />
              </div>

              <div className="flex-1 overflow-hidden">
                {studioMode === 'live' ? (
                  <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-4">
                       <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                         Initiate a direct neural link for real-time interaction. Aura will use its active Knowledge Matrix to answer questions via live video avatar.
                       </p>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" />
                          <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">WebRTC Link Ready</span>
                       </div>
                    </div>
                    <button 
                      onClick={handleStartCall}
                      disabled={isConnecting || isInCall}
                      className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3"
                    >
                      {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                      {isConnecting ? 'Establishing Link...' : 'Start Video Call'}
                    </button>
                  </div>
                ) : studioMode === 'resolution' ? (
                  <div className="space-y-6 pt-6 animate-in fade-in h-full flex flex-col">
                    <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                       <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Active Resolution Queue</label>
                       <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                          {tickets.length > 0 ? tickets.map((t) => (
                            <button 
                              key={t.id}
                              onClick={() => {
                                setSelectedTicket(t);
                                setSynthesisGoal(`Hi ${t.customerName}, this is Aura. I've personally reviewed your case regarding ${t.issueTitle}.`);
                              }}
                              className={`w-full p-4 rounded-xl border text-left transition-all group ${selectedTicket?.id === t.id ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black text-white group-hover:text-cyan-400">{t.ticketId}</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[9px] font-bold text-zinc-300 uppercase leading-none">{t.customerName}</p>
                                  <p className="text-[8px] text-zinc-500 font-mono">{t.customerEmail}</p>
                               </div>
                               <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5">
                                  <p className="text-[8px] text-zinc-400 font-medium italic line-clamp-2">" {t.issueSummary} "</p>
                               </div>
                            </button>
                          )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                               <Clock size={32} />
                               <p className="text-[10px] font-bold uppercase mt-4">Queue is empty</p>
                            </div>
                          )}
                       </div>
                    </div>

                    {selectedTicket && (
                      <div className="space-y-4 pt-4 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-500">
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Neural Response Prompt</label>
                            <textarea 
                              value={synthesisGoal}
                              onChange={(e) => setSynthesisGoal(e.target.value)}
                              className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-zinc-800"
                              placeholder="Write your final solution message here..."
                            />
                         </div>
                         <button 
                           onClick={handleGenerateResolution}
                           disabled={isSynthesizing}
                           className="w-full py-5 bg-cyan-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 active:scale-95"
                         >
                           {isSynthesizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                           {isSynthesizing ? 'Rendering Hyperframe...' : 'Generate & Send Video'}
                         </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 pt-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Context & Goals</label>
                       <textarea 
                         value={synthesisGoal}
                         onChange={(e) => setSynthesisGoal(e.target.value)}
                         placeholder="What should Aura talk about?"
                         className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/30 transition-all"
                       />
                    </div>
                    <button className="w-full py-5 bg-zinc-800 text-zinc-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] cursor-not-allowed">
                      Batch Rendering Offline
                    </button>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* MAIN DISPLAY (8 COLS) */}
        <div className="lg:col-span-8 relative">
           <div className="glass-card rounded-3xl overflow-hidden h-full border border-white/5 bg-[#090b14] flex flex-col">
              
              {/* Call Overlay UI */}
              <AnimatePresence>
                {isInCall ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col"
                  >
                    {/* Call Header */}
                    <div className="p-8 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                       <div className="flex items-center gap-4">
                          <div className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-full animate-pulse">Live Call</div>
                          <div className="text-white">
                             <p className="text-lg font-bold tracking-tighter uppercase">{activeAgent?.name || 'AURA / ALPHA'}</p>
                             <p className="text-[10px] font-mono text-zinc-400">Secure Neural Stream • 1080p</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => { setIsInCall(false); setEmbedUrl(null); }}
                         className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-2xl"
                       >
                          <X size={24} />
                       </button>
                    </div>

                    {/* The Video Embed */}
                    <div className="flex-1 bg-black">
                       {embedUrl && (
                         <iframe 
                           src={embedUrl} 
                           allow="microphone; camera" 
                           className="w-full h-full border-none"
                         />
                       )}
                    </div>

                    {/* Call Controls Bar */}
                    <div className="p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6">
                       <ControlButton icon={<Mic size={20} />} active={true} />
                       <ControlButton icon={<Video size={20} />} active={true} />
                       <button 
                         onClick={() => { setIsInCall(false); setEmbedUrl(null); }}
                         className="px-10 py-4 bg-red-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-3"
                       >
                          End Session
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-8">
                     <div className="relative">
                        <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-500/5">
                           <Video size={40} className="text-cyan-500/40" />
                        </div>
                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Neural Stream Ready</h3>
                        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                          Aura is waiting for a secure connection. Select a mode on the left to begin face-to-face interaction or video synthesis.
                        </p>
                     </div>
                     <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 w-full">
                        <StatusMetric label="Bandwidth" value="1.2 Gbps" />
                        <StatusMetric label="Latency" value="48ms" />
                        <StatusMetric label="Encryption" value="AES-256" />
                     </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Background Scanner Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150" />
           </div>
        </div>
      </div>
    </div>
  )
}

function ModeButton({ icon, title, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl border text-left transition-all space-y-4 group ${active ? 'bg-white border-white' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
    >
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-black text-white' : 'bg-white/5 text-zinc-500 group-hover:text-white'}`}>
          {icon}
       </div>
       <div>
          <h4 className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-black' : 'text-white'}`}>{title}</h4>
          <p className={`text-[9px] font-bold uppercase mt-1 ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>{desc}</p>
       </div>
    </button>
  )
}

function ControlButton({ icon, active }: any) {
  return (
    <button className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' : 'bg-zinc-800 text-zinc-500'}`}>
       {icon}
    </button>
  )
}

function StatusMetric({ label, value }: any) {
  return (
    <div className="space-y-1">
       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
       <p className="text-sm font-bold text-white tracking-tight">{value}</p>
    </div>
  )
}
