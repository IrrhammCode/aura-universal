'use client'

import { useEffect, useState } from 'react'
import { Search, Command, ArrowRight, LayoutDashboard, Users, Eye, Book, Video, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const COMMANDS = [
  { label: 'Go to Dashboard', icon: <LayoutDashboard size={14} />, route: '/dashboard' },
  { label: 'Configure Agent Identity', icon: <Users size={14} />, route: '/dashboard/forge' },
  { label: 'View Interaction Logs', icon: <Eye size={14} />, route: '/dashboard/logs' },
  { label: 'Manage Knowledge Base', icon: <Book size={14} />, route: '/dashboard/kb' },
  { label: 'Open Video Studio', icon: <Video size={14} />, route: '/dashboard/studio' },
  { label: 'System Settings', icon: <Settings size={14} />, route: '/dashboard/settings' },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (route: string) => {
    router.push(route)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#0c101a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center px-4 py-4 border-b border-white/5">
                <Search size={18} className="text-zinc-500 mr-3" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-zinc-600"
                />
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 border border-white/5 px-2 py-1 rounded bg-black/50">
                  <Command size={10} /> K
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto py-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(cmd.route)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-zinc-600 group-hover:text-cyan-400">{cmd.icon}</div>
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </div>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-zinc-500" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-zinc-600 text-sm">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
