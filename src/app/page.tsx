'use client'

import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Eye, Brain, Mic, Video, Camera, Activity, Shield, Zap, ArrowRight, Code, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AuraLogo } from '@/components/AuraLogo'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/10 selection:text-white overflow-hidden">
      {/* Dynamic Background Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-20"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`
        }}
      />
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-8 sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AuraLogo className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase">Aura</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-medium tracking-[0.3em] text-zinc-500 uppercase">
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Sign In</Link>
          <Link href="/login" className="cta-button px-5 py-2 rounded-md text-[11px] uppercase tracking-widest">
            Login
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10">
        {/* Hero Section */}
        <section className="pt-24 pb-40 text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-[10px] font-medium tracking-widest text-zinc-400 uppercase"
          >
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            Infrastructure v1.0 Released
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tightest leading-[0.9]"
          >
            The intelligence layer <br />
            for physical reality.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed"
          >
            Aura is a multimodal agentic framework that bridges the gap between vision, emotional reasoning, and natural human presence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/login" className="cta-button px-10 py-4 rounded-md flex items-center gap-2 text-sm">
              Try the Agent <ArrowRight size={16} />
            </Link>
            <button className="secondary-button px-10 py-4 rounded-md text-sm">
              Read the Docs
            </button>
          </motion.div>
        </section>

        {/* The HUD Showcase (Refined Pro Layout) */}
        <section className="pb-40 px-4 md:px-0">
          <div className="relative border-linear bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <div className="absolute inset-0 matte-overlay" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {/* Left Sidebar HUD (Telemetry) */}
              <div className="lg:col-span-3 flex flex-col border-r border-zinc-800 p-6 bg-black/50 backdrop-blur-xl relative z-10 justify-between overflow-hidden">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Core Pipeline</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <TelemetryNode label="Vision" ping="42ms" status="active" />
                    <TelemetryNode label="Logic" ping="120ms" status="active" />
                    <TelemetryNode label="Voice" ping="85ms" status="active" />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Sentiment Stream</span>
                  <div className="h-16 w-full relative overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-900/30">
                    <div className="absolute inset-0 flex items-center justify-center gap-[1.5px] px-2">
                       {[...Array(16)].map((_, i) => (
                         <motion.div 
                           key={i} 
                           className="w-1 bg-cyan-500/40 rounded-full" 
                           animate={{ height: ['20%', '70%', '40%'] }}
                           transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                         />
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                  <div className="text-[8px] font-mono text-zinc-500 space-y-1">
                    <p className="text-zinc-400">&gt; Node secure.</p>
                    <p className="text-cyan-500/60">&gt; Encrypted.</p>
                  </div>
                </div>
              </div>

              {/* Main Viewport (Shrunk & Focused) */}
              <div className="lg:col-span-6 relative bg-black border-r border-zinc-800 overflow-hidden">
                <img 
                  src="/avatar.png" 
                  alt="Agent"
                  className="w-full h-full object-cover grayscale opacity-70 contrast-125"
                />
                
                {/* Minimal HUD Controls */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                   <div className="space-y-1">
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Instance</span>
                      <h3 className="text-lg font-bold uppercase tracking-tighter">Aura / Alpha</h3>
                   </div>
                   
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setIsConnecting(!isConnecting)}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isConnecting ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'border-white/10 hover:bg-white hover:text-black'}`}
                      >
                         <Mic size={16} />
                      </button>
                      <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                         <Camera size={16} />
                      </button>
                   </div>
                </div>

                {/* Handshake Overlay */}
                <AnimatePresence>
                  {isConnecting && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                       <div className="text-center space-y-4">
                          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 animate-pulse">Establishing Secure Stream...</p>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              </div>

              {/* Right Sidebar (New Context Panel) */}
              <div className="lg:col-span-3 p-6 flex flex-col justify-between bg-zinc-950/50">
                <div className="space-y-6">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Global Context</span>
                  <div className="space-y-4">
                    <ContextItem label="Uptime" value="99.98%" />
                    <ContextItem label="Region" value="US-WEST-2" />
                    <ContextItem label="Model" value="Aura-v2" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-zinc-800 bg-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Performance</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-yellow-400" />
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">System operating at peak efficiency. All nodes synchronized.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="pb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 premium-card rounded-2xl p-12 space-y-6"
             >
                <Zap size={24} className="text-white" />
                <h3 className="text-3xl font-bold tracking-tight">Ultra-low latency architecture.</h3>
                <p className="text-zinc-500 max-w-md">Our pipeline is optimized for WebRTC streaming, ensuring a sub-200ms round-trip from vision input to lip-synced response.</p>
                <div className="pt-8 grid grid-cols-3 gap-8">
                   <div className="space-y-1">
                      <div className="text-xl font-bold tracking-tighter">240ms</div>
                      <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Average Lag</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-xl font-bold tracking-tighter">99.9%</div>
                      <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Uptime</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-xl font-bold tracking-tighter">8K</div>
                      <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Frame Parsing</div>
                   </div>
                </div>
             </motion.div>
             
             <motion.div 
               whileHover={{ y: -5 }}
               className="premium-card rounded-2xl p-12 flex flex-col justify-between"
             >
                <Shield size={24} className="text-white" />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight">Enterprise Privacy.</h3>
                  <p className="text-sm text-zinc-500">Your data never leaves the encrypted ecosystem. GDPR and SOC2 compliant agents.</p>
                </div>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="premium-card rounded-2xl p-12 flex flex-col justify-between"
             >
                <Mic size={24} className="text-white" />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight">Voice Mastery.</h3>
                  <p className="text-sm text-zinc-500">Integrating ElevenLabs for unparalleled emotional depth and tonal variation.</p>
                </div>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 premium-card rounded-2xl p-12 flex flex-col md:flex-row gap-12 items-center"
             >
                <div className="space-y-6 flex-1">
                  <Eye size={24} className="text-white" />
                  <h3 className="text-3xl font-bold tracking-tight">Visionary Perception.</h3>
                  <p className="text-zinc-500">Powered by Fal.ai serverless models to parse real-world environments with pinpoint accuracy.</p>
                </div>
                <div className="w-full md:w-64 h-48 bg-black rounded-xl border border-zinc-800 overflow-hidden relative">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10" />
                   <div className="absolute inset-0 border border-zinc-700 animate-pulse m-8" />
                </div>
             </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <AuraLogo className="w-6 h-6" />
              <span className="text-lg font-bold tracking-tighter uppercase">Aura</span>
            </div>
            <p className="text-sm text-zinc-600 max-w-xs">Building the next generation of multimodal agentic infrastructure.</p>
            <div className="flex gap-6 text-zinc-600">
               <MessageCircle size={18} className="hover:text-white transition-colors cursor-pointer" />
               <Code size={18} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterList title="Product" items={['Features', 'API', 'Docs', 'Status']} />
            <FooterList title="Company" items={['About', 'Privacy', 'Terms', 'Contact']} />
            <FooterList title="Social" items={['X / Twitter', 'GitHub', 'Discord']} />
          </div>
        </footer>
      </main>
    </div>
  )
}

function TelemetryNode({ label, ping, status }: { label: string, ping: string, status: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' || status === 'streaming' ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-zinc-500'}`} />
        <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-zinc-600">{ping}</span>
    </div>
  )
}

function ContextItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-zinc-500 font-medium">{label}</span>
      <span className="text-[10px] text-zinc-300 font-mono">{value}</span>
    </div>
  )
}

function FooterList({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{title}</h4>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="text-sm text-zinc-600 hover:text-white transition-colors cursor-pointer">{item}</li>
        ))}
      </ul>
    </div>
  )
}
