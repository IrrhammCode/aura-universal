import { LayoutDashboard, Users, Eye, Book, Activity, Settings, Video } from 'lucide-react'
import Link from 'next/link'
import { AuraLogo } from '@/components/AuraLogo'
import { AuraProvider } from '@/context/AuraContext'
import { CommandPalette } from '@/components/CommandPalette'
import { Network, Server } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090b14] text-slate-300 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0c101a] flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/50">
          <AuraLogo className="w-8 h-8" />
          <span className="text-xl font-bold text-white tracking-wide">AURA</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavLink href="/dashboard/forge" icon={<Users size={18} />} label="Agent Forge" />
          <NavLink href="/dashboard/studio" icon={<Video size={18} />} label="Video Studio" />
          <NavLink href="/dashboard/logs" icon={<Eye size={18} />} label="Interaction Logs" />
          <NavLink href="/dashboard/kb" icon={<Book size={18} />} label="Knowledge Base" />
          <NavLink href="/dashboard/analytics" icon={<Activity size={18} />} label="Posthog Analytics" />
          <NavLink href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* Global Connection Status */}
        <div className="p-6 border-t border-slate-800/50 space-y-4">
           <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
              <Network size={12} /> System Status
           </div>
           <StatusIndicator label="HeyGen Avatar" active />
           <StatusIndicator label="ElevenLabs TTS" active />
           <StatusIndicator label="Fal.ai Vision" active />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AuraProvider>
          <CommandPalette />
          {children}
        </AuraProvider>
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
    <div className="flex items-center justify-between group">
       <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white transition-colors">{label}</span>
       <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-zinc-600 uppercase">{active ? 'Online' : 'Offline'}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`} />
       </div>
    </div>
  )
}
