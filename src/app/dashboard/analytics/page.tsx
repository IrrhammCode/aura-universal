'use client'

import { motion } from 'framer-motion'
import { Activity, Users, TrendingUp, Brain, MessageSquare, ShieldCheck, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts'

export default function AnalyticsPage() {
  const [leadsData, setLeadsData] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Mock trend data for visualization
  const trendData = [
    { name: 'Mon', leads: 4, sentiment: 88 },
    { name: 'Tue', leads: 7, sentiment: 92 },
    { name: 'Wed', leads: 5, sentiment: 85 },
    { name: 'Thu', leads: 12, sentiment: 94 },
    { name: 'Fri', leads: 9, sentiment: 90 },
    { name: 'Sat', leads: 15, sentiment: 96 },
    { name: 'Sun', leads: 18, sentiment: 98 },
  ]

  const sentimentData = [
    { name: 'Positive', value: 75, color: '#10b981' },
    { name: 'Neutral', value: 20, color: '#06b6d4' },
    { name: 'Negative', value: 5, color: '#ef4444' },
  ]

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
           Neural Intelligence Report
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter">
          Growth <span className="text-zinc-500 font-medium">Metrics</span>
        </h1>
      </header>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard icon={<Users className="text-cyan-500"/>} label="Total Captured Leads" value="1,428" change="+12% vs last week" />
         <MetricCard icon={<Brain className="text-emerald-500"/>} label="Neural Accuracy" value="98.2%" change="Optimal State" />
         <MetricCard icon={<MessageSquare className="text-blue-500"/>} label="Avg Resolution Time" value="1.4m" change="-20s improvement" />
         <MetricCard icon={<TrendingUp className="text-purple-500"/>} label="Conversion Rate" value="32%" change="+5% vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 glass-card p-8 space-y-8">
            <div className="flex justify-between items-center">
               <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">Lead Capture Velocity</h3>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Real-time session monitoring</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-cyan-500" />
                     <span className="text-[9px] font-bold text-zinc-500 uppercase">Leads</span>
                  </div>
               </div>
            </div>

            <div className="h-[350px] w-full">
               {isMounted && (
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                       <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '10px' }}
                          itemStyle={{ color: '#06b6d4' }}
                       />
                       <Area type="monotone" dataKey="leads" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                 </ResponsiveContainer>
               )}
            </div>
         </div>

         {/* Side Chart */}
         <div className="glass-card p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-1">
               <h3 className="text-sm font-bold text-white tracking-tight">Sentiment Distribution</h3>
               <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Neural intent analysis</p>
            </div>

            <div className="h-[250px] w-full relative">
               {isMounted && (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {sentimentData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
               )}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                     <p className="text-xl font-black text-white tracking-tighter">75%</p>
                     <p className="text-[8px] font-bold text-zinc-500 uppercase">Positive</p>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               {sentimentData.map((s) => (
                  <div key={s.name} className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[10px] font-bold text-zinc-400">{s.name}</span>
                     </div>
                     <span className="text-[10px] font-mono text-white">{s.value}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, change }: any) {
   return (
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass-card p-6 flex flex-col gap-4 group hover:border-white/10 transition-all"
      >
         <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
               {icon}
            </div>
            <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
               {change}
            </div>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
         </div>
      </motion.div>
   )
}
