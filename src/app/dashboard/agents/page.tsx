'use client'

import { motion } from 'framer-motion'
import { Users, Plus, MoreVertical, Trash2, Edit, ExternalLink, Activity, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAura } from '@/context/AuraContext'

export default function AgentsPage() {
  const { agents, setAgents, setActiveAgent } = useAura()
  const [isLoading, setIsLoading] = useState(false)

  const deleteAgent = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this agent? All neural weights and logs will be lost.')) return
    try {
      // Mock delete for now since we don't have DELETE /api/agents yet
      // await fetch(`/api/agents?id=${id}`, { method: 'DELETE' })
      setAgents(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
             Fleet Command
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            My AI <span className="text-zinc-500 font-medium">Agents</span>
          </h1>
        </div>

        <Link 
          href="/dashboard/forge" 
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_10px_20px_-5px_rgba(6,182,212,0.3)]"
        >
          <Plus size={16} /> Deploy New Agent
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col gap-6 group hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl"
                    style={{ backgroundColor: agent.themeColor || '#06b6d4', color: '#000' }}
                  >
                     {agent.name.charAt(0)}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white tracking-tight">{agent.name}</h3>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{agent.templateType || 'Custom Agent'}</p>
                  </div>
               </div>
               <div className="relative group/menu">
                  <button className="p-2 rounded-full hover:bg-white/5 text-zinc-600 transition-colors">
                     <MoreVertical size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl py-2 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-10 overflow-hidden">
                     <Link 
                       href="/dashboard/forge" 
                       onClick={() => setActiveAgent(agent)}
                       className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                     >
                        <Edit size={14} /> Edit Configuration
                     </Link>
                     <button 
                       onClick={() => deleteAgent(agent.id)}
                       className="flex items-center gap-3 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
                     >
                        <Trash2 size={14} /> Decommission
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Sentiment Index</span>
                  <div className="flex items-center gap-2">
                     <Activity size={12} className="text-emerald-500" />
                     <span className="text-xs font-mono text-white">94%</span>
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Conversations</span>
                  <div className="flex items-center gap-2">
                     <MessageCircle size={12} className="text-cyan-500" />
                     <span className="text-xs font-mono text-white">1,240</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
               <Link 
                 href={`/embed/${agent.id}`}
                 target="_blank"
                 className="flex-1 py-3 text-center rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
               >
                 View Demo
               </Link>
               <button className="flex-1 py-3 text-center rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                 Analytics
               </button>
            </div>
          </motion.div>
        ))}

        {agents.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-6">
             <Users size={64} className="mx-auto text-zinc-800" />
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">No agents deployed</h3>
                <p className="text-zinc-500 max-w-sm mx-auto text-sm">Your fleet is currently offline. Start by forging your first AI agent.</p>
             </div>
             <Link href="/dashboard/forge" className="inline-block px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest">
                Start Forge
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
