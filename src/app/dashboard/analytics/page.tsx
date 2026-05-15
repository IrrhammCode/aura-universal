'use client'

import { Activity, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/Skeleton'

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    totalEvents: 0,
    sessions: 0,
    avgResponse: 'N/A',
    engagement: '0%',
    velocity: new Array(24).fill(0)
  })

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (!json.error) setData(json)
      })
      .catch(err => console.error("Failed to load analytics:", err))
      .finally(() => setIsLoading(false))
  }, [])

  // Format velocity data for Recharts
  const chartData = data.velocity.map((val, i) => ({
    time: `${i}:00`,
    events: val
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/10 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{payload[0].payload.time}</p>
          <p className="text-xl font-bold text-cyan-400">{payload[0].value} <span className="text-xs text-zinc-500">events</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Analytics</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Live Event Telemetry</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {isLoading ? (
            <>
               <Skeleton className="h-32" />
               <Skeleton className="h-32" />
               <Skeleton className="h-32" />
               <Skeleton className="h-32" />
            </>
         ) : (
            <>
               <MetricCard label="Active Sessions" value={data.sessions.toString()} icon={<Users size={16}/>} />
               <MetricCard label="Avg Response Time" value={data.avgResponse} icon={<Clock size={16}/>} />
               <MetricCard label="System Precision" value={data.engagement} icon={<TrendingUp size={16}/>} />
               <MetricCard label="Telemetry Events" value={data.totalEvents.toString()} icon={<Activity size={16}/>} />
            </>
         )}
      </div>

      <div className="glass-card p-10 min-h-[400px] flex flex-col justify-between">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">Event Velocity</h3>
            <BarChart3 size={18} className="text-zinc-700" />
         </div>
         <div className="flex-1 w-full h-[300px]">
            {isLoading ? (
               <Skeleton className="w-full h-full" />
            ) : data.totalEvents > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis 
                     dataKey="time" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#52525b', fontSize: 10, fontWeight: 'bold' }} 
                     dy={10}
                   />
                   <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#52525b', fontSize: 10, fontWeight: 'bold' }} 
                   />
                   <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                   <Area 
                     type="monotone" 
                     dataKey="events" 
                     stroke="#06b6d4" 
                     strokeWidth={3}
                     fillOpacity={1} 
                     fill="url(#colorEvents)" 
                     animationDuration={1500}
                     animationEasing="ease-out"
                   />
                 </AreaChart>
               </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                  <div className="text-center space-y-4">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <Activity size={24} className="text-zinc-600" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">No Telemetry Detected</p>
                        <p className="text-[10px] text-zinc-500">System is awaiting data payload</p>
                     </div>
                  </div>
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
