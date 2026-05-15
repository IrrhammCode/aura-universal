'use client'

import { ChevronDown, Zap, Activity, Shield, Smile, Terminal, Globe, Cpu, MoreHorizontal, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="p-8 lg:p-12 max-w-[1700px] mx-auto space-y-12 selection:bg-cyan-500/30">
      
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
            System Operational
          </motion.div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Command <span className="text-zinc-500 font-medium">Center</span>
          </h1>
        </div>

        <div className="flex bg-[#0c101a] p-1.5 rounded-full border border-white/5 shadow-2xl">
          {['Overview', 'Nodes', 'Security', 'Logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === tab.toLowerCase() 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[180px]"
          >
            {/* KPI: Active Instances */}
            <StatCard className="md:col-span-3" title="Active Instances" value="12" sub="+2.4%" icon={<Cpu size={16}/>} accent="cyan" />
            <StatCard className="md:col-span-3" title="Resolution Velocity" value="85.2%" sub="Optimal" icon={<Zap size={16}/>} accent="emerald" />

            {/* Liquid Chart Card */}
            <div className="md:col-span-6 md:row-span-2 glass-card p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <ArrowUpRight size={18} className="text-zinc-400" />
                 </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Neural Resonance</h3>
                <p className="text-2xl font-bold text-white tracking-tight">Active Synthesis</p>
              </div>
              <div className="h-48 w-full mt-8 relative">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30 V100 H0 Z" fill="url(#chart-grad)" />
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30" fill="none" stroke="#06b6d4" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <StatCard className="md:col-span-3" title="Sentiment Sync" value="4.82" sub="Resonant" icon={<Smile size={16}/>} accent="purple" />
            <StatCard className="md:col-span-3" title="System Integrity" value="99.9%" sub="Secured" icon={<Shield size={16}/>} accent="blue" />

            {/* Deployment Matrix */}
            <div className="md:col-span-4 md:row-span-3 glass-card p-8 space-y-8">
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Quick Deploy</h3>
              <div className="space-y-6">
                <DeploymentInput label="Agent Identifier" placeholder="e.g. Aura-X" />
                <DeploymentInput label="Target Persona" placeholder="Professional" isSelect />
                <button className="w-full py-5 bg-white text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl">
                  Initiate Node
                </button>
              </div>
            </div>

            {/* Interaction Log (Ultra-Dense) */}
            <div className="md:col-span-8 md:row-span-3 glass-card overflow-hidden flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Live Telemetry</h3>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-white/5 text-zinc-400">
                    <LogRow event="Refund Processed" logic="Validated receipt via Fal.ai." time="12:45" />
                    <LogRow event="Identity Verified" logic="Biometric handshake successful." time="12:42" />
                    <LogRow event="Sentiment Alert" logic="User frustration detected." time="12:35" />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'nodes' && (
          <motion.div 
            key="nodes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
             {[1, 2, 3].map(i => (
               <div key={i} className="glass-card p-10 space-y-6 border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between items-center">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                        <Globe size={24} />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500 uppercase">Online</p>
                        <p className="text-[9px] font-mono text-zinc-600">US-EAST-1</p>
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Cluster Beta-{i}00</h3>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>CPU Load</span>
                        <span>{Math.floor(Math.random() * 40 + 20)}%</span>
                     </div>
                     <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                     </div>
                  </div>
               </div>
             ))}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-12 border border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center text-center space-y-6"
          >
             <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <Shield size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Security Perimeter</h3>
                <p className="text-sm text-zinc-500 max-w-sm">Active threat mitigation system is scanning for anomalies. No unauthorized handshakes detected in the last 24h.</p>
             </div>
             <button className="px-8 py-3 bg-red-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all">
                Run Deep Scan
             </button>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card overflow-hidden border border-white/5"
          >
             <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">System Telemetry Feed</h3>
             </div>
             <table className="w-full text-left">
                <thead className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest border-b border-white/5 bg-black/20">
                   <tr>
                      <th className="px-8 py-4">Event Source</th>
                      <th className="px-8 py-4">Payload Trace</th>
                      <th className="px-8 py-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   <TelemetryRow source="AVATAR_ENGINE" trace="Initializing WebRTC handshake..." status="SUCCESS" />
                   <TelemetryRow source="VISION_FAL" trace="Parsing image stream (720p)..." status="PROCESSING" />
                   <TelemetryRow source="TTS_ELEVEN" trace="Synthesizing emotional voice: Rachel" status="SUCCESS" />
                   <TelemetryRow source="KNOWLEDGE_RAG" trace="Vector search: 'Refund Policy'" status="SUCCESS" />
                   <TelemetryRow source="CORE_PIPELINE" trace="Dispatching response to client" status="SUCCESS" />
                </tbody>
             </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ title, value, sub, icon, className, accent }: any) {
  const accentColors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400'
  }
  return (
    <div className={`glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{title}</h3>
        <div className="text-zinc-600 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${accentColors[accent as keyof typeof accentColors]}`}>{sub}</span>
      </div>
    </div>
  )
}

function DeploymentInput({ label, placeholder, isSelect }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
      <div className="relative">
        {isSelect ? (
          <select className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-xs text-white appearance-none focus:outline-none focus:border-white/20">
            <option>Professional / Analytical</option>
            <option>Casual / Empathic</option>
          </select>
        ) : (
          <input type="text" placeholder={placeholder} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20" />
        )}
        {isSelect && <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />}
      </div>
    </div>
  )
}

function LogRow({ event, logic, time }: any) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors cursor-default group">
      <td className="px-8 py-6 font-bold text-zinc-300 group-hover:text-cyan-400 transition-colors">{event}</td>
      <td className="px-8 py-6 text-zinc-600 italic text-[11px]">{logic}</td>
      <td className="px-8 py-6 text-right font-mono text-zinc-600 text-[10px]">{time}</td>
    </tr>
  )
}

function TelemetryRow({ source, trace, status }: any) {
  return (
    <tr className="hover:bg-white/[0.01] transition-colors group">
      <td className="px-8 py-5">
        <span className="text-[10px] font-mono font-bold text-cyan-500/70">{source}</span>
      </td>
      <td className="px-8 py-5">
        <span className="text-[11px] text-zinc-400 group-hover:text-white transition-colors">{trace}</span>
      </td>
      <td className="px-8 py-5 text-right">
        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-tighter ${status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-500 animate-pulse'}`}>
          {status}
        </span>
      </td>
    </tr>
  )
}
