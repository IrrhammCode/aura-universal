'use client'

import { Settings2, Key, Bell, Shield, Wallet, Globe, Loader2, CheckCircle2, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { useAura } from '@/context/AuraContext'

export default function SettingsPage() {
  const { agents, setAgents } = useAura()
  const [settings, setSettings] = useState({
    heygenKey: '',
    elevenLabsKey: '',
    falKey: '',
    openAiKey: '',
    twoFactorAuth: true,
    restrictedRegions: 'None',
    companyLogo: '',
    primaryColor: '#06b6d4',
    calendlyUrl: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Ensure all fields have string fallbacks to avoid controlled/uncontrolled warnings
          setSettings({
            heygenKey: data.heygenKey || '',
            elevenLabsKey: data.elevenLabsKey || '',
            falKey: data.falKey || '',
            openAiKey: data.openAiKey || '',
            twoFactorAuth: data.twoFactorAuth ?? true,
            restrictedRegions: data.restrictedRegions || 'None',
            companyLogo: data.companyLogo || '',
            primaryColor: data.primaryColor || '#06b6d4',
            calendlyUrl: data.calendlyUrl || ''
          })
        }
      })
      .catch(err => console.error("Failed to load settings:", err))
  }, [])

  const handleAgentUpdate = (id: string, field: string, value: string) => {
    setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, [field]: value } : agent))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save global settings
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      // Save all active agents
      for (const agent of agents) {
         await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agent)
         })
      }

      toast.success("System state synchronized successfully", {
        description: "All configurations and agent settings have been saved.",
      })
    } catch (err) {
      console.error("Failed to save settings:", err)
      toast.error("Failed to synchronize state")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Settings</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Infrastructure Configuration</p>
      </header>

      <div className="space-y-6">
          <SettingsGroup title="Workspace Authentication">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Shield size={14} className="text-emerald-500" /> Multi-Tenant Workspace</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Your data is isolated in Workspace: <span className="text-cyan-500 font-mono">AURA-ORG-99X</span></p>
               </div>
               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                 Manage Members
               </button>
            </div>
         </SettingsGroup>

         <SettingsGroup title="Neural Infrastructure (BYOK)">
            <div className="p-6 m-8 mt-0 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex gap-4 items-start">
               <Zap size={20} className="text-cyan-500 shrink-0 mt-1" />
               <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                  Aura uses a <b>Bring Your Own Key</b> model. Your keys are encrypted at rest. Use <code className="text-cyan-500">gpt-4o</code> for optimal reasoning and vision performance.
               </p>
            </div>
            <SettingsInput icon={<Key size={16}/>} label="HeyGen API Key" value={settings.heygenKey || ''} onChange={(e: any) => updateSetting('heygenKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="ElevenLabs Key" value={settings.elevenLabsKey || ''} onChange={(e: any) => updateSetting('elevenLabsKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="Fal.ai Key" value={settings.falKey || ''} onChange={(e: any) => updateSetting('falKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="OpenAI API Key" value={settings.openAiKey || ''} onChange={(e: any) => updateSetting('openAiKey', e.target.value)} type="password" />
         </SettingsGroup>

         <SettingsGroup title="Security">
            <div className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.01] transition-all cursor-pointer" onClick={() => updateSetting('twoFactorAuth', !settings.twoFactorAuth)}>
               <div className="flex items-center gap-4">
                  <div className="text-zinc-600"><Shield size={16}/></div>
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Two-Factor Auth</span>
               </div>
               <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${settings.twoFactorAuth ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.twoFactorAuth ? 'translate-x-4' : 'translate-x-0'}`} />
               </div>
            </div>
            <SettingsInput icon={<Globe size={16}/>} label="Restricted Regions" value={settings.restrictedRegions || ''} onChange={(e: any) => updateSetting('restrictedRegions', e.target.value)} />
         </SettingsGroup>

         <SettingsGroup title="Enterprise Brand Kit (B2B)">
            <SettingsInput icon={<Globe size={16}/>} label="Company Logo URL" value={settings.companyLogo || ''} onChange={(e: any) => updateSetting('companyLogo', e.target.value)} placeholder="https://example.com/logo.png" />
            <SettingsInput icon={<Wallet size={16}/>} label="Brand Hex Color" value={settings.primaryColor || ''} onChange={(e: any) => updateSetting('primaryColor', e.target.value)} placeholder="#06b6d4" />
            <SettingsInput icon={<Bell size={16}/>} label="Calendly Link" value={settings.calendlyUrl || ''} onChange={(e: any) => updateSetting('calendlyUrl', e.target.value)} placeholder="https://calendly.com/your-org" />
         </SettingsGroup>

         {agents.length > 0 && (
            <SettingsGroup title="Agent Configuration">
               {agents.map(agent => (
                  <div key={agent.id} className="p-8 border-b border-white/5 space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-cyan-500/10 text-cyan-500 rounded-lg flex items-center justify-center font-bold">
                           {agent.name.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest">{agent.name}</h4>
                           <p className="text-[10px] text-zinc-500 font-mono">{agent.id}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingsInput 
                           icon={<Key size={16} />} 
                           label="HeyGen Avatar ID" 
                           value={agent.avatarId || ''} 
                           onChange={(e: any) => handleAgentUpdate(agent.id, 'avatarId', e.target.value)} 
                           placeholder="josh_lite_20230714" 
                        />
                        <SettingsInput 
                           icon={<Key size={16} />} 
                           label="ElevenLabs Voice ID" 
                           value={agent.voiceId || ''} 
                           onChange={(e: any) => handleAgentUpdate(agent.id, 'voiceId', e.target.value)} 
                           placeholder="1bd001e7e50f421d8919..." 
                        />
                     </div>
                  </div>
               ))}
            </SettingsGroup>
         )}
         
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="w-full py-5 font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all flex justify-center items-center gap-3 bg-white text-black hover:bg-zinc-200"
         >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSaving ? 'Synchronizing State...' : 'Save System State'}
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

function SettingsInput({ icon, label, value, onChange, type = "text", placeholder = "••••••••••••••••" }: any) {
  return (
    <div className="px-8 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.01] transition-all gap-4">
       <div className="flex items-center gap-4 whitespace-nowrap">
          <div className="text-zinc-600">{icon}</div>
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{label}</span>
       </div>
       <input 
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 w-full md:w-64 transition-colors"
       />
    </div>
  )
}
