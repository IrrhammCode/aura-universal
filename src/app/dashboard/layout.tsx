'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Eye, Book, Activity, Settings, Video, Mail, Smartphone, Lock, Network, Server, LogOut, RotateCw } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { AuraLogo } from '@/components/AuraLogo'
import { useAura } from '@/context/AuraContext'
import { CommandPalette } from '@/components/CommandPalette'
import { Toaster } from 'sonner'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { UserPanel } from '@/components/UserPanel'
import { WalkthroughOverlay } from '@/components/WalkthroughOverlay'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setIsWalkthroughActive, setWalkthroughStep } = useAura()
  const [systemStatus, setSystemStatus] = useState({
    neural: false,
    avatar: false,
    voice: false,
    vision: false,
    knowledge: false,
    telemetry: false
  })

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setSystemStatus(data)
    } catch (e) {
      console.error("Failed to fetch system status", e)
    }
  }

  useEffect(() => {
    // Neural Status is now manual-only via refresh button to save resources and improve demo control
  }, [])

  useEffect(() => {
    const shouldStartTour = localStorage.getItem('aura_start_tour') === 'true'
    if (shouldStartTour) {
       localStorage.removeItem('aura_start_tour')
       setTimeout(() => {
         setIsWalkthroughActive(true)
         setWalkthroughStep(0)
       }, 2000)
    }
  }, [setIsWalkthroughActive, setWalkthroughStep])

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-300 font-sans flex relative">
      <BackgroundEffects />
      <WalkthroughOverlay />
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0c101a] flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/50">
          <AuraLogo className="w-8 h-8" />
          <span className="text-xl font-bold text-white tracking-wide">AURA</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-2">Core Interface</div>
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Command Center" />
          <NavLink href="/dashboard/agents" icon={<Users size={18} />} label="Fleet Command" />
          <NavLink href="/dashboard/forge" icon={<LayoutDashboard size={18} />} label="Agent Forge" />
          <NavLink href="/dashboard/connectors" icon={<Smartphone size={18} />} label="Agent Connectors" />
          
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mt-6 mb-2">Intelligence & Data</div>
          <NavLink href="/dashboard/kb" icon={<Book size={18} />} label="Knowledge Matrix" />
          <NavLink href="/dashboard/leads" icon={<Mail size={18} />} label="Inbox / Leads" />
          <NavLink href="/dashboard/logs" icon={<Eye size={18} />} label="Neural Traces" />
          
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mt-6 mb-2">Creative & Scale</div>
          <NavLink href="/dashboard/studio" icon={<Video size={18} />} label="Video Studio" />
          <NavLink href="/dashboard/analytics" icon={<Activity size={18} />} label="Neural Analytics" />
          <NavLink href="/dashboard/settings" icon={<Settings size={18} />} label="Platform Config" />
          
          <div className="pt-4 mt-4 border-t border-white/5">
             <button 
               onClick={() => signOut({ callbackUrl: '/login' })}
               className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all group"
             >
                <LogOut size={18} />
                <span className="text-sm font-medium">Neural Logout</span>
             </button>
          </div>
        </nav>

        {/* Global Connection Status - Fixed at bottom */}
        <div className="p-6 border-t border-slate-800/50 space-y-2 bg-[#0c101a]">
           <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                 <Network size={12} /> System Status
              </div>
              <button 
                onClick={async () => {
                  const btn = document.getElementById('status-refresh-icon');
                  btn?.classList.add('animate-spin');
                  await fetchStatus();
                  setTimeout(() => btn?.classList.remove('animate-spin'), 1000);
                }}
                className="text-zinc-600 hover:text-cyan-400 transition-colors"
                title="Refresh Neural Status"
              >
                 <RotateCw id="status-refresh-icon" size={10} />
              </button>
           </div>
           <StatusIndicator label="Neural Engine" active={systemStatus.neural} />
           <StatusIndicator label="Avatar Stream" active={systemStatus.avatar} />
           <StatusIndicator label="Vocal Synth" active={systemStatus.voice} />
           <StatusIndicator label="Vision Neural" active={systemStatus.vision} />
           <StatusIndicator label="Knowledge RAG" active={systemStatus.knowledge} />
           <StatusIndicator label="Telemetry" active={systemStatus.telemetry} />
        </div>

        <UserPanel />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#0c101a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }} />
        <CommandPalette />
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
      <div className="group-hover:text-cyan-400 transition-colors">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

function StatusIndicator({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between group py-1">
       <span className="text-[9px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
       <div className="flex items-center gap-2">
          <span className={`text-[8px] font-mono uppercase ${active ? 'text-emerald-500/50' : 'text-red-500/50'}`}>{active ? 'Online' : 'Offline'}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`} />
       </div>
    </div>
  )
}
