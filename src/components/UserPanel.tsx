'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function UserPanel() {
  const { data: session } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  if (!session?.user) {
    return (
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-2 w-28 bg-zinc-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const initials = (session.user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="p-4 border-t border-slate-800/50 relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-2 w-full hover:bg-white/5 rounded-lg py-2 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
          {initials}
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
          <p className="text-[9px] text-zinc-600 truncate">{session.user.email}</p>
        </div>
        <ChevronDown size={14} className={`text-zinc-600 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {(session.user as any).organizationName || 'Organization'}
            </p>
            <p className="text-[8px] font-mono text-zinc-700 mt-0.5">
              {(session.user as any).role || 'MEMBER'}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={14} />
            <span className="text-xs font-bold">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
