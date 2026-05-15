'use client'

import { Video, Sparkles, Play, Download, Clock, Layers, Book, Users, Wand2, Loader2 } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useState } from 'react'

export default function VideoStudio() {
  const { documents, activeAgent } = useAura()
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [htmlCode, setHtmlCode] = useState('<!-- Awaiting AI Generation -->\n<div class="hyperframe-scene" data-duration="30s">\n  <heygen-avatar agent="aura-x" />\n</div>')

  const handleSynthesize = () => {
    setIsSynthesizing(true)
    setTimeout(() => {
      setHtmlCode(`<!-- Synthesized by Aura Brain -->\n<div class="hyperframe-scene" data-duration="45s">\n  <video src="bg_tech.mp4" layer="-1" />\n  <div class="glass-panel" data-in="fade 0.5s">\n    <h1>Knowledge Synthesis: ${documents[0]?.title || 'Safety Protocol'}</h1>\n  </div>\n  <heygen-avatar agent="${activeAgent?.id || 'aura-default'}" voice-empathy="${activeAgent?.empathy || 50}" />\n</div>`)
      setIsSynthesizing(false)
    }, 2000)
  }
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Video <span className="text-zinc-500 font-medium">Studio</span></h1>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">
           Powered by HeyGen <span className="text-cyan-500">HyperFrames</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Production Lab */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-cyan-400" />
                    <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Production Lab</h3>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
                 </div>
              </div>
              
              <div className="space-y-6">
                 {/* Mode Selector */}
                 <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 rounded-2xl bg-white text-black font-bold text-[9px] uppercase tracking-widest flex flex-col items-center gap-2">
                       <Book size={16} />
                       Knowledge-to-Video
                    </button>
                    <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 font-bold text-[9px] uppercase tracking-widest flex flex-col items-center gap-2 hover:border-white/20 hover:text-white transition-all">
                       <Users size={16} />
                       Personalized Outreach
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Select Knowledge Source</label>
                       <select className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-4 text-xs text-white appearance-none focus:outline-none">
                         {documents.map(doc => <option key={doc.id}>{doc.title}</option>)}
                         {documents.length === 0 && <option>No Documents Available in KB</option>}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Synthesis Goal</label>
                       <textarea 
                          rows={4}
                          placeholder="e.g. Summarize the 'Safety Protocol' into a 1-minute explainer for new employees."
                          className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 resize-none transition-all"
                       />
                    </div>
                 </div>

                 <button 
                    onClick={handleSynthesize}
                    className="w-full py-5 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_15px_30px_-10px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2"
                 >
                    {isSynthesizing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                    {isSynthesizing ? 'Synthesizing...' : 'Synthesize Video'}
                 </button>
              </div>
           </div>

           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <Layers size={16} className="text-zinc-500" />
                 <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Generated HTML/CSS</h3>
              </div>
              <div className="h-48 bg-black/80 rounded-xl border border-white/5 p-4 overflow-y-auto font-mono text-[9px] text-zinc-500 whitespace-pre">
                 {htmlCode}
              </div>
           </div>
        </div>

        {/* Renderer Preview */}
        <div className="lg:col-span-7 space-y-8 flex flex-col">
           <div className="flex-1 glass-card p-4 rounded-3xl flex flex-col">
              <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 mb-4">
                 <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">HyperFrames Renderer</h3>
                 <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Engine Idle
                 </div>
              </div>
              
              <div className="flex-1 bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
                 {/* Empty State */}
                 <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-700 group-hover:text-cyan-500 transition-colors">
                       <Video size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No Composition Loaded</p>
                 </div>
              </div>

              <div className="mt-4 px-4 py-3 bg-white/5 rounded-xl flex justify-between items-center">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Render Queue</p>
                    <p className="text-[9px] font-mono text-zinc-600">0 Active Jobs</p>
                 </div>
                 <button className="px-6 py-2 bg-zinc-800 text-zinc-400 font-bold text-[9px] uppercase tracking-widest rounded-lg cursor-not-allowed">
                    Render MP4
                 </button>
              </div>
           </div>

           {/* Recent Renders */}
           <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Recent Exports</h3>
              </div>
              <div className="divide-y divide-white/5">
                 <ExportRow title="Q3_Security_Update.mp4" duration="00:45" date="Today, 14:22" />
                 <ExportRow title="Onboarding_Welcome.mp4" duration="01:12" date="Yesterday" />
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

function ExportRow({ title, duration, date }: any) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-cyan-400 transition-colors">
             <Video size={16} />
          </div>
          <div>
             <p className="text-[11px] font-bold text-zinc-300">{title}</p>
             <p className="text-[9px] font-mono text-zinc-600 flex items-center gap-2 mt-1">
                <Clock size={10} /> {duration} • {date}
             </p>
          </div>
       </div>
       <button className="p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
          <Download size={14} className="text-zinc-400" />
       </button>
    </div>
  )
}
