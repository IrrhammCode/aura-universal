'use client'

import { Settings2, Key, Bell, Shield, Wallet, Globe, Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    heygenKey: '',
    elevenLabsKey: '',
    falKey: '',
    openAiKey: '',
    twoFactorAuth: true,
    restrictedRegions: 'None'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data)
      })
      .catch(err => console.error("Failed to load settings:", err))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save settings:", err)
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
         <SettingsGroup title="API Integration">
            <SettingsInput icon={<Key size={16}/>} label="HeyGen API Key" value={settings.heygenKey} onChange={(e: any) => updateSetting('heygenKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="ElevenLabs Key" value={settings.elevenLabsKey} onChange={(e: any) => updateSetting('elevenLabsKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="Fal.ai Key" value={settings.falKey} onChange={(e: any) => updateSetting('falKey', e.target.value)} type="password" />
            <SettingsInput icon={<Key size={16}/>} label="OpenAI API Key" value={settings.openAiKey} onChange={(e: any) => updateSetting('openAiKey', e.target.value)} type="password" />
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
            <SettingsInput icon={<Globe size={16}/>} label="Restricted Regions" value={settings.restrictedRegions} onChange={(e: any) => updateSetting('restrictedRegions', e.target.value)} />
         </SettingsGroup>
         
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className={`w-full py-5 font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all flex justify-center items-center gap-3 ${saved ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-zinc-200'}`}
         >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : null}
            {isSaving ? 'Synchronizing State...' : saved ? 'State Saved' : 'Save System State'}
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

function SettingsInput({ icon, label, value, onChange, type = "text" }: any) {
  return (
    <div className="px-8 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.01] transition-all gap-4">
       <div className="flex items-center gap-4 whitespace-nowrap">
          <div className="text-zinc-600">{icon}</div>
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{label}</span>
       </div>
       <input 
          type={type}
          value={value}
          onChange={onChange}
          placeholder="••••••••••••••••"
          className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 w-full md:w-64 transition-colors"
       />
    </div>
  )
}
