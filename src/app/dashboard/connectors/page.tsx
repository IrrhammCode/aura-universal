'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Send, Smartphone, Globe, ExternalLink, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'telegram'>('whatsapp')

  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">
           <Globe size={12} /> Omnichannel Deployment
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter">
          Agent <span className="text-zinc-500 font-medium">Connectors</span>
        </h1>
        <p className="text-sm text-zinc-500 max-w-xl">
           Extend Aura's reach beyond the web. Deploy your agent's intelligence to major messaging platforms with a single webhook.
        </p>
      </header>

      <div className="flex gap-4">
         <TabButton active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} label="WhatsApp" icon={<MessageSquare size={16}/>} />
         <TabButton active={activeTab === 'telegram'} onClick={() => setActiveTab('telegram')} label="Telegram" icon={<Send size={16}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 space-y-8">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-white">Webhook Integration</h3>
                     <p className="text-xs text-zinc-500">Configure your {activeTab} provider to point to this endpoint.</p>
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-500 uppercase tracking-widest">
                     Primary Endpoint
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aura Webhook URL</label>
                     <div className="flex gap-2">
                        <input 
                           readOnly
                           value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${activeTab}`}
                           className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-400 font-mono"
                        />
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Copy</button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connection Secret</label>
                     <input 
                        readOnly
                        value="aura_sec_••••••••••••••••••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-400 font-mono"
                     />
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 space-y-6">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Channels</h3>
               <div className="divide-y divide-white/5">
                  <ChannelItem name="Official Business Line" status="CONNECTED" platform={activeTab} />
                  <ChannelItem name="Support Queue" status="OFFLINE" platform={activeTab} />
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="glass-card p-8 space-y-6">
               <div className="flex items-center gap-2 text-cyan-500">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Setup Guide</span>
               </div>
               <div className="space-y-4">
                  <Step num="1" text={`Create a ${activeTab} Business account.`} />
                  <Step num="2" text="Generate a Permanent Access Token." />
                  <Step num="3" text="Configure the Webhook URL from Aura." />
                  <Step num="4" text="Verify your phone number." />
               </div>
               <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Read Documentation <ExternalLink size={12} />
               </button>
            </div>

            <div className="glass-card p-8 bg-cyan-500/5 border-cyan-500/20 space-y-4">
                <div className="flex items-center gap-2 text-cyan-500">
                   <AlertCircle size={16} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Multi-Agent Routing</h4>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                   You can route specific channels to specific Aura agents by appending <code className="text-cyan-500">?agentId=ID</code> to your webhook URL.
                </p>
            </div>
         </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label, icon }: any) {
   return (
      <button 
         onClick={onClick}
         className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-xs transition-all ${active ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
      >
         {icon} {label}
      </button>
   )
}

function ChannelItem({ name, status, platform }: any) {
   return (
      <div className="py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <Smartphone size={18} className="text-zinc-500" />
            </div>
            <div>
               <p className="text-xs font-bold text-white">{name}</p>
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{platform}</p>
            </div>
         </div>
         <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-600 border border-zinc-500/20'}`}>
            {status}
         </div>
      </div>
   )
}

function Step({ num, text }: any) {
   return (
      <div className="flex gap-4 items-start">
         <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-cyan-500 shrink-0">
            {num}
         </div>
         <p className="text-[11px] text-zinc-400 leading-snug">{text}</p>
      </div>
   )
}
