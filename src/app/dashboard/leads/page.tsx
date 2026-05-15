'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, Phone, Calendar, ArrowRight, Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<any[]>([])
  const [isConvLoading, setIsConvLoading] = useState(false)

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const fetchConversation = async (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsConvLoading(true)
    try {
      const res = await fetch(`/api/chat/history/session?sessionId=${sessionId}`)
      const data = await res.json()
      setConversation(data)
    } catch (err) {
      console.error("Failed to fetch conversation:", err)
    } finally {
      setIsConvLoading(false)
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
             Growth Pipeline
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Incoming <span className="text-zinc-500 font-medium">Leads</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" placeholder="Search prospects..." className="bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all w-64" />
           </div>
           <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
           <thead>
              <tr className="border-b border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                 <th className="px-8 py-6">Prospect</th>
                 <th className="px-8 py-6">Contact Info</th>
                 <th className="px-8 py-6">Interest / Context</th>
                 <th className="px-8 py-6">Status</th>
                 <th className="px-8 py-6 text-right">Captured</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <motion.tr 
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => lead.sessionId && fetchConversation(lead.sessionId)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-cyan-500 font-bold text-xs">
                            {lead.name?.charAt(0) || '?'}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white tracking-tight">{lead.name || 'Anonymous'}</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ID: {lead.id.slice(-6)}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6 space-y-1">
                      {lead.email && (
                         <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Mail size={12} className="text-zinc-600" />
                            {lead.email}
                         </div>
                      )}
                      {lead.phone && (
                         <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Phone size={12} className="text-zinc-600" />
                            {lead.phone}
                         </div>
                      )}
                   </td>
                   <td className="px-8 py-6">
                      <p className="text-xs text-zinc-500 italic max-w-xs truncate">
                         "{lead.lastMessage || 'Interested in Aura'}"
                      </p>
                   </td>
                   <td className="px-8 py-6">
                      <select 
                        value={lead.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
                          await fetch('/api/leads', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: lead.id, status: newStatus })
                          });
                        }}
                        className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest focus:outline-none transition-all ${
                          lead.status === 'NEW' ? 'text-emerald-500 border-emerald-500/20' : 
                          lead.status === 'CONTACTED' ? 'text-cyan-500 border-cyan-500/20' : 
                          'text-zinc-500 border-white/5'
                        }`}
                      >
                         <option value="NEW" className="bg-zinc-900 text-emerald-500">NEW</option>
                         <option value="CONTACTED" className="bg-zinc-900 text-cyan-500">CONTACTED</option>
                         <option value="QUALIFIED" className="bg-zinc-900 text-white">QUALIFIED</option>
                         <option value="ARCHIVED" className="bg-zinc-900 text-zinc-600">ARCHIVED</option>
                      </select>
                   </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={async (e) => {
                                 e.stopPropagation();
                                 const newPaused = !lead.isPaused;
                                 setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, isPaused: newPaused } : l));
                                 await fetch('/api/leads', {
                                   method: 'PATCH',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({ id: lead.id, isPaused: newPaused })
                                 });
                               }}
                               className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                 lead.isPaused 
                                 ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                                 : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                               }`}
                             >
                                {lead.isPaused ? 'AI PAUSED' : 'TAKEOVER'}
                             </button>
                             <button 
                               onClick={() => lead.sessionId && fetchConversation(lead.sessionId)}
                               className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-cyan-500 transition-all"
                             >
                                <ArrowRight size={14} />
                             </button>
                          </div>
                          <p className="text-[9px] font-mono text-zinc-700">
                             {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                    </td>
                </motion.tr>
              ))}
              {leads.length === 0 && !isLoading && (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center space-y-4">
                       <Users size={48} className="mx-auto text-zinc-800" />
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Pipeline Empty</p>
                          <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-bold">Deploy your agent to start capturing leads</p>
                       </div>
                    </td>
                 </tr>
              )}
           </tbody>
        </table>
      </div>

      {/* Conversation Modal */}
      <AnimatePresence>
        {selectedSessionId && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
             onClick={() => setSelectedSessionId(null)}
           >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl h-[80vh] glass-card overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                 <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                       <Users size={20} className="text-cyan-500" />
                       <div>
                          <h3 className="text-sm font-bold text-white tracking-tight">Conversation History</h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Session: {selectedSessionId}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedSessionId(null)} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-black/40">
                    {isConvLoading ? (
                       <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse text-xs uppercase font-bold tracking-widest">
                          Reconstructing memory...
                       </div>
                    ) : conversation.map((msg, idx) => (
                       <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] space-y-1`}>
                             <p className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-right text-zinc-600' : 'text-cyan-500/50'}`}>
                                {msg.role}
                             </p>
                             <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-zinc-800 text-white rounded-br-none' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-bl-none'}`}>
                                {msg.content}
                             </div>
                             <p className="text-[8px] font-mono text-zinc-700">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
