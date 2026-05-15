'use client'

import { Activity, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Analytics</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">PostHog Event Telemetry</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <MetricCard label="Total Sessions" value="12,482" icon={<Users size={16}/>} />
         <MetricCard label="Avg Response Time" value="184ms" icon={<Clock size={16}/>} />
         <MetricCard label="Engagement Rate" value="92.4%" icon={<TrendingUp size={16}/>} />
         <MetricCard label="Event Volume" value="48.1K" icon={<Activity size={16}/>} />
      </div>

      <div className="glass-card p-10 min-h-[400px] flex flex-col justify-between">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">Traffic Distribution</h3>
            <BarChart3 size={18} className="text-zinc-700" />
         </div>
         <div className="flex-1 flex items-end gap-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-t-lg group relative hover:bg-cyan-500/50 transition-all cursor-pointer" style={{ height: `${Math.random() * 80 + 20}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[9px] font-black px-2 py-1 rounded">
                    {Math.floor(Math.random() * 100)}%
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: any) {
  return (
    <div className="glass-card p-8 space-y-4 hover:border-white/10 transition-all group">
       <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{label}</span>
          <div className="text-zinc-700 group-hover:text-white transition-colors">{icon}</div>
       </div>
       <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
    </div>
  )
}
