'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Download, ExternalLink, Image as ImageIcon, MessageSquare, Inbox } from 'lucide-react'
import { useState } from 'react'

export default function InteractionLogs() {
  const [logs, setLogs] = useState<any[]>([])
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Interaction <span className="text-zinc-500 font-medium">Logs</span></h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Historical Telemetry Database</p>
        </div>

        <div className="flex gap-4">
           <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" placeholder="SEARCH TRACES..." className="bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-white/20 transition-all w-64" />
           </div>
           <button className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/5 transition-all">
              <Filter size={14} className="text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Filter</span>
           </button>
        </div>
      </header>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
            <tr>
              <th className="px-10 py-6">ID / Timestamp</th>
              <th className="px-10 py-6">Input Matrix</th>
              <th className="px-10 py-6">Agent Response</th>
              <th className="px-10 py-6">Vision Parse</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px] font-medium text-zinc-400">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                 <LogRow key={i} {...log} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                   <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                         <Inbox size={24} className="text-zinc-600" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[11px] font-bold text-white uppercase tracking-widest">No Interaction Traces Found</p>
                         <p className="text-[10px] text-zinc-500">The agent has not recorded any conversations yet.</p>
                      </div>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LogRow({ id, time, input, response, vision, hasImage }: any) {
  return (
    <tr className="hover:bg-white/[0.01] transition-colors group">
      <td className="px-10 py-8">
        <div className="space-y-1">
          <p className="font-mono text-white font-bold tracking-tighter">{id}</p>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{time} UTC</p>
        </div>
      </td>
      <td className="px-10 py-8 max-w-sm">
        <div className="flex items-start gap-3">
          {hasImage ? <ImageIcon size={14} className="text-cyan-500 mt-0.5 flex-shrink-0" /> : <MessageSquare size={14} className="text-zinc-600 mt-0.5 flex-shrink-0" />}
          <p className="truncate line-clamp-2 text-zinc-300 font-bold tracking-tight">{input}</p>
        </div>
      </td>
      <td className="px-10 py-8 max-w-md">
        <p className="line-clamp-2 italic text-zinc-500">{response}</p>
      </td>
      <td className="px-10 py-8">
        <span className={`px-2 py-1 rounded-[4px] text-[9px] font-black uppercase tracking-widest ${vision !== '-' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-900 text-zinc-700'}`}>
          {vision}
        </span>
      </td>
      <td className="px-10 py-8 text-right">
        <button className="p-3 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
           <ExternalLink size={14} className="text-zinc-500" />
        </button>
      </td>
    </tr>
  )
}
