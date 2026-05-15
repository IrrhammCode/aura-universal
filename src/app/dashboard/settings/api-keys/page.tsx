'use client'

import { motion } from 'framer-motion'
import { Key, Shield, Zap, Save, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function ApiKeysPage() {
  const [keys, setKeys] = useState({
    openAiKey: '',
    heygenKey: '',
    elevenLabsKey: '',
    falKey: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setKeys({
          openAiKey: data.openAiKey || '',
          heygenKey: data.heygenKey || '',
          elevenLabsKey: data.elevenLabsKey || '',
          falKey: data.falKey || ''
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  const saveKeys = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys)
      })
      if (res.ok) {
        toast.success("Neural Infrastructure Updated", {
          description: "Your custom API keys are now active for all agents."
        })
      }
    } catch (err) {
      toast.error("Update Failed", { description: "Check your network connection." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-[1000px] mx-auto space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">
           <Lock size={12} /> Secure Infrastructure
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter">
          Neural <span className="text-zinc-500 font-medium">Config</span>
        </h1>
        <p className="text-sm text-zinc-500 max-w-xl">
           Aura follows a "Bring Your Own Key" (BYOK) model. Your keys are encrypted at rest and used only to power your dedicated agents.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
         <div className="glass-card p-8 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-white">
                  <Shield size={20} className="text-cyan-500" />
                  <h3 className="text-lg font-bold">API Integration</h3>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Encrypted</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <KeyInput 
                  label="OpenAI API Key" 
                  description="Powers brain, reasoning, and vision."
                  value={keys.openAiKey}
                  onChange={(v) => setKeys(prev => ({ ...prev, openAiKey: v }))}
               />
               <KeyInput 
                  label="HeyGen API Key" 
                  description="Powers interactive video avatars."
                  value={keys.heygenKey}
                  onChange={(v) => setKeys(prev => ({ ...prev, heygenKey: v }))}
               />
               <KeyInput 
                  label="ElevenLabs Key" 
                  description="Powers neural vocal synthesis."
                  value={keys.elevenLabsKey}
                  onChange={(v) => setKeys(prev => ({ ...prev, elevenLabsKey: v }))}
               />
               <KeyInput 
                  label="Fal.ai Key" 
                  description="Backup for ultra-fast vision tasks."
                  value={keys.falKey}
                  onChange={(v) => setKeys(prev => ({ ...prev, falKey: v }))}
               />
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-2 text-zinc-600">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Keys are hidden for security</span>
               </div>
               <button 
                  onClick={saveKeys}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all disabled:opacity-50"
               >
                  {isSaving ? 'Encrypting...' : <><Save size={16} /> Deploy Configuration</>}
               </button>
            </div>
         </div>

         {/* Usage Warning */}
         <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex gap-4 items-start">
            <Zap size={24} className="text-cyan-500 shrink-0 mt-1" />
            <div className="space-y-1">
               <h4 className="text-xs font-bold text-white uppercase tracking-widest">Neural Performance Tip</h4>
               <p className="text-xs text-zinc-400 leading-relaxed">
                  Using your own keys unlocks higher rate limits and allows for "Interactive Video Call" mode using the HeyGen Streaming API. Make sure your OpenAI key has access to <code className="text-cyan-500 bg-cyan-500/10 px-1 rounded">gpt-4o</code> for the best experience.
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}

function KeyInput({ label, description, value, onChange }: any) {
   const [show, setShow] = useState(false)
   return (
      <div className="space-y-3">
         <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
            <p className="text-[10px] text-zinc-600">{description}</p>
         </div>
         <div className="relative">
            <input 
               type={show ? "text" : "password"}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all"
               placeholder="sk-••••••••••••••••"
            />
            <button 
               onClick={() => setShow(!show)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
            >
               {show ? <Lock size={14} /> : <Key size={14} />}
            </button>
         </div>
      </div>
   )
}
