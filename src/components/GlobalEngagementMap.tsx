'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function GlobalEngagementMap() {
  const points = [
    { x: '20%', y: '30%', active: true, label: 'San Francisco' },
    { x: '75%', y: '25%', active: true, label: 'London' },
    { x: '82%', y: '65%', active: false, label: 'Singapore' },
    { x: '45%', y: '40%', active: true, label: 'New York' },
    { x: '35%', y: '70%', active: false, label: 'Sao Paulo' },
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative w-full h-[300px] bg-black/40 rounded-3xl overflow-hidden border border-white/5">
      {/* Abstract Map Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 100 Q 200 80, 250 120 T 350 100 T 450 140 T 550 100 T 650 150 T 750 110 T 850 140" stroke="#06b6d4" strokeWidth="0.5" />
          <path d="M100 250 Q 200 230, 300 270 T 500 250 T 700 290 T 900 250" stroke="#06b6d4" strokeWidth="0.5" />
          <path d="M200 400 Q 350 380, 500 420 T 800 400" stroke="#06b6d4" strokeWidth="0.5" />
          {/* Subtle grid dots - Rendered only on client to avoid hydration mismatch */}
          {mounted && Array.from({ length: 50 }).map((_, i) => (
            <circle key={i} cx={Math.random() * 1000} cy={Math.random() * 500} r="0.5" fill="white" fillOpacity="0.3" />
          ))}
        </svg>
      </div>

      {/* Connection Lines (Animated) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 200 90 L 750 75"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Data Points */}
      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.2 }}
          style={{ left: p.x, top: p.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
        >
          <div className="relative">
            {p.active && (
              <div className="absolute inset-0 w-4 h-4 bg-cyan-500 rounded-full animate-ping opacity-20" />
            )}
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] ${p.active ? 'bg-cyan-500' : 'bg-zinc-700'}`} />
          </div>
          
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <span className="px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white uppercase tracking-tighter shadow-2xl">
              {p.label}
            </span>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-8 space-y-1">
        <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Outreach</p>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
           <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">3 Active Clusters</p>
        </div>
      </div>
    </div>
  )
}
