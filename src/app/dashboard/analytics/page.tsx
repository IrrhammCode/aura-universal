'use client'

import { Activity, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [data, setData] = useState({
    totalEvents: 0,
    sessions: 0,
    avgResponse: 'N/A',
    engagement: '0%',
    velocity: new Array(24).fill(0)
  })

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (!json.error) setData(json)
      })
      .catch(err => console.error("Failed to load analytics:", err))
  }, [])

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Analytics</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Live Event Telemetry</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <MetricCard label="Active Sessions" value={data.sessions.toString()} icon={<Users size={16}/>} />
         <MetricCard label="Avg Response Time" value={data.avgResponse} icon={<Clock size={16}/>} />
         <MetricCard label="System Precision" value={data.engagement} icon={<TrendingUp size={16}/>} />
         <MetricCard label="Telemetry Events" value={data.totalEvents.toString()} icon={<Activity size={16}/>} />
      </div>

      <div className="glass-card p-10 min-h-[400px] flex flex-col justify-between">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">Event Velocity</h3>
            <BarChart3 size={18} className="text-zinc-700" />
         </div>
         <div className="flex-1 flex items-end gap-4">
            {data.totalEvents > 0 ? (
               data.velocity.map((val, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-t-lg group relative hover:bg-cyan-500/50 transition-all cursor-pointer" style={{ height: `${val}%` }}>
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[9px] font-black px-2 py-1 rounded">
                        {val}
                     </div>
                  </div>
               ))
            ) : (
               <div className="w-full h-full flex items-center justify-center border border-dashed border-white/5 rounded-2xl text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  No telemetry detected
               </div>
            )}
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
