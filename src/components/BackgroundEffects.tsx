'use client'

import { motion } from 'framer-motion'

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Mesh Gradients */}
      <motion.div 
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px]" 
      />
      
      <motion.div 
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" 
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#090b14]/50 to-[#090b14]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  )
}
