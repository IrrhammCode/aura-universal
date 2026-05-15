'use client'

import { Settings2, Key, Bell, Shield, Wallet, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Settings</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Infrastructure Configuration</p>
      </header>

      <div className="space-y-6">
         <SettingsGroup title="API Integration">
            <SettingsItem icon={<Key size={16}/>} label="HeyGen API Key" value="••••••••••••••••" />
            <SettingsItem icon={<Key size={16}/>} label="ElevenLabs Key" value="••••••••••••••••" />
            <SettingsItem icon={<Key size={16}/>} label="Fal.ai Key" value="••••••••••••••••" />
         </SettingsGroup>

         <SettingsGroup title="Security">
            <SettingsItem icon={<Shield size={16}/>} label="Two-Factor Auth" value="Enabled" active />
            <SettingsItem icon={<Globe size={16}/>} label="Restricted Regions" value="None" />
         </SettingsGroup>
         
         <button className="w-full py-5 bg-white text-black font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-zinc-200 transition-all">
            Save System State
         </button>
      </div>
    </div>
  )
}

function SettingsGroup({ title, children }: any) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
      <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02]">
         <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{title}</h3>
      </div>
      <div className="divide-y divide-white/5">
         {children}
      </div>
    </div>
  )
}

function SettingsItem({ icon, label, value, active }: any) {
  return (
    <div className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.01] transition-all cursor-pointer">
       <div className="flex items-center gap-4">
          <div className="text-zinc-600">{icon}</div>
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{label}</span>
       </div>
       <span className={`text-[10px] font-mono ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>{value}</span>
    </div>
  )
}
