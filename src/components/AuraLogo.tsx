'use client'

import { motion } from 'framer-motion'

export function AuraLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      initial="initial"
      animate="animate"
    >
      <defs>
        <linearGradient id="aura-grad-1" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="aura-grad-2" x1="10%" y1="100%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="aura-grad-3" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow)">
        <motion.path 
          d="M 25 80 L 50 20 L 60 20 L 35 80 Z" 
          fill="url(#aura-grad-1)" 
          style={{ mixBlendMode: 'screen' }}
          variants={{
            animate: {
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.05, 1],
            }
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 50 20 L 75 80 L 65 80 L 40 20 Z" 
          fill="url(#aura-grad-2)" 
          style={{ mixBlendMode: 'screen' }}
          variants={{
            animate: {
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.02, 1],
            }
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path 
          d="M 30 60 Q 50 45 70 60 L 65 65 Q 50 52 35 65 Z" 
          fill="url(#aura-grad-3)" 
          variants={{
            animate: {
              y: [0, -2, 0],
            }
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>
    </motion.svg>
  )
}

