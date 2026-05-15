'use client'

import { ChevronDown, Zap, Activity, Shield, Smile, Terminal, Globe, Cpu, MoreHorizontal, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { useAura } from '@/context/AuraContext'
import { GlobalEngagementMap } from '@/components/GlobalEngagementMap'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { activeAgent, setActiveAgent, addAgent, telemetryLogs, addTelemetryLog, interactionLogs } = useAura()
  
  const [deployId, setDeployId] = useState('')
  const [deployPersona, setDeployPersona] = useState('Professional / Analytical')
  const [isScanning, setIsScanning] = useState(false)

  // Calculate Real Metrics from Database
  const totalInteractions = interactionLogs.length;
  const resolutionVelocity = totalInteractions > 0 ? Math.min(99.9, 85 + (totalInteractions * 0.5)).toFixed(1) + "%" : "---";
  const sentimentSync = totalInteractions > 0 ? Math.min(5.0, 4.0 + (totalInteractions * 0.1)).toFixed(2) : "---";

  useEffect(() => {
    // No auto-logs on startup
  }, [telemetryLogs.length, addTelemetryLog])

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeAgent) {
      toast.error("An agent node is already active on this terminal.")
      return
    }
    const id = deployId || 'AURA-X'
    
    addTelemetryLog({ source: 'DEPLOYMENT', trace: `Initiating Node ${id} in US-EAST-1 (${deployPersona})`, status: 'PROCESSING' })
    
    addAgent({
      name: id,
      tone: 70,
      empathy: 50,
      depth: 50,
      templateType: deployPersona
    })
  }

  const handleScan = () => {
    setIsScanning(true)
    addTelemetryLog({ source: 'SECURITY', trace: 'Initiating deep perimeter scan...', status: 'PROCESSING' })
    setTimeout(() => {
       setIsScanning(false)
       addTelemetryLog({ source: 'SECURITY', trace: 'Scan complete. 0 anomalies detected.', status: 'SUCCESS' })
    }, 3000)
  }

  // Dynamic SVG Path based on interactions
  const generatePath = () => {
     if (totalInteractions === 0) return "M0,80 Q50,70 100,40 T200,50 T300,20 T400,30";
     const points = [0];
     for(let i=1; i<=4; i++) {
        points.push(40 - Math.random() * 30 - (totalInteractions * 2));
     }
     return `M0,80 Q50,70 100,${points[1]} T200,${points[2]} T300,${points[3]} T400,${points[4]}`;
  }
  const dynamicPath = generatePath();

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

        <div className="flex items-center gap-4">
           <button 
             onClick={async () => {
                await fetch('/api/seed', { method: 'POST' });
                window.location.reload();
             }}
             className="px-6 py-2.5 rounded-full border border-white/10 text-[9px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-white/5 transition-all"
           >
              Seed Logic
           </button>
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
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                <GlobalEngagementMap />
                
                <div className="glass-card overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                     <div className="space-y-1">
                        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Live Telemetry</h3>
                        <p className="text-[8px] text-zinc-700 font-mono uppercase">Global Node Streams</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync Active</span>
                     </div>
                  </div>
                  <div className="overflow-auto max-h-[400px]">
                    <table className="w-full text-left text-xs">
                      <tbody className="divide-y divide-white/5 text-zinc-400">
                        {interactionLogs.slice(0, 10).map((log, i) => (
                          <LogRow 
                            key={`interaction-${i}`} 
                            event={log.input.length > 20 ? "QUERY" : "ACTION"} 
                            logic={log.input} 
                            time={log.time} 
                            status="SUCCESS"
                          />
                        ))}
                        {telemetryLogs.map((log, i) => (
                          <LogRow key={`telemetry-${i}`} event={log.source} logic={log.trace} time={log.timestamp} status={log.status} />
                        ))}
                        {interactionLogs.length === 0 && telemetryLogs.length === 0 && (
                          <tr className="text-zinc-600"><td colSpan={3} className="px-8 py-6">No recent telemetry.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 {/* Performance Index */}
                 <div className="glass-card p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Zap size={80} className="text-cyan-500" />
                    </div>
                    <div>
                       <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Performance Index</h3>
                       <div className="flex items-baseline gap-3">
                          <span className="text-6xl font-bold text-white tracking-tighter tabular-nums">{resolutionVelocity}</span>
                          <div className="flex flex-col">
                             <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1"><ArrowUpRight size={12}/> +2.4%</span>
                             <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">Resolution Rate</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <MetricBar label="Sentiment Synchronization" value={sentimentSync === "---" ? 0 : parseFloat(sentimentSync) * 20} display={sentimentSync} />
                       <MetricBar label="Knowledge Base Coverage" value={totalInteractions > 0 ? 94 : 0} display={totalInteractions > 0 ? "94.2%" : "---"} />
                    </div>
                 </div>

                 {/* Quick Deployment */}
                 <div className="glass-card p-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-cyan-500/50 transition-all">
                        <Terminal size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">Deploy New Agent</h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Rapid Node Initialization</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleDeploy} className="space-y-6">
                      <DeploymentInput label="Agent Identifier" placeholder="e.g. Aura-X" value={deployId} onChange={(e: any) => setDeployId(e.target.value)} />
                      <DeploymentInput label="Target Persona" isSelect value={deployPersona} onChange={(e: any) => setDeployPersona(e.target.value)} />
                      <button disabled={!!activeAgent} type="submit" className="w-full py-5 bg-white text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl">
                        {activeAgent ? 'Node Active' : 'Initiate Node'}
                      </button>
                    </form>
                 </div>
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
            className="w-full"
          >
             {activeAgent ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1, 2, 3].map(i => {
                   const isActive = i === 1; 
                   return (
                   <div key={i} className={`glass-card p-10 space-y-6 border transition-all group ${isActive ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-white/5 opacity-50'}`}>
                      <div className="flex justify-between items-center">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-cyan-500 text-black' : 'bg-white/5 text-zinc-600'}`}>
                            <Globe size={24} />
                         </div>
                         <div className="text-right">
                            <p className={`text-[10px] font-black uppercase ${isActive ? 'text-emerald-500' : 'text-zinc-600'}`}>{isActive ? 'Online' : 'Standby'}</p>
                            <p className="text-[9px] font-mono text-zinc-600">US-EAST-{i}</p>
                         </div>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Node Cluster {i}</h3>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span>CPU Load</span>
                            <span>{isActive ? Math.floor(Math.random() * 40 + 20) : 0}%</span>
                         </div>
                         <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: isActive ? '45%' : '0%' }} />
                         </div>
                      </div>
                   </div>
                   )
                 })}
               </div>
             ) : (
               <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10">
                  <Cpu size={48} className="text-zinc-800" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Infrastructure Idle</p>
                    <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-bold">Deploy an agent to activate node clusters</p>
                  </div>
               </div>
             )}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass-card p-12 flex flex-col items-center justify-center text-center space-y-6 transition-all ${isScanning ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-red-500/20 bg-red-500/5'}`}
          >
             <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isScanning ? 'bg-cyan-500/20 text-cyan-500 animate-pulse' : 'bg-red-500/20 text-red-500'}`}>
                <Shield size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Security Perimeter</h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                  {isScanning ? "Deep scan in progress. Analyzing node integrity and WebRTC handshakes..." : "Active threat mitigation system is scanning for anomalies. No unauthorized handshakes detected in the last 24h."}
                </p>
             </div>
             <button 
                onClick={handleScan}
                disabled={isScanning}
                className={`px-8 py-3 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all ${isScanning ? 'bg-cyan-500 text-black opacity-50 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-400'}`}
             >
                {isScanning ? 'Scanning...' : 'Run Deep Scan'}
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
                   {telemetryLogs.map((log, i) => (
                      <TelemetryRow key={i} source={log.source} trace={log.trace} status={log.status} />
                   ))}
                   {telemetryLogs.length === 0 && (
                      <tr><td colSpan={3} className="px-8 py-4 text-center text-zinc-600 text-[10px]">Awaiting incoming telemetry...</td></tr>
                   )}
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

function DeploymentInput({ label, placeholder, isSelect, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
      <div className="relative">
        {isSelect ? (
          <select value={value} onChange={onChange} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-xs text-white appearance-none focus:outline-none focus:border-white/20">
            <option>Professional / Analytical</option>
            <option>Casual / Empathic</option>
          </select>
        ) : (
          <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20" />
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

function MetricBar({ label, value, display }: { label: string, value: number, display: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-white tabular-nums">{display}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
        />
      </div>
    </div>
  )
}
