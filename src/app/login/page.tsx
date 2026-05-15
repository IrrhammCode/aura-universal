'use client'

import { motion } from 'framer-motion'
import { AuraLogo } from '@/components/AuraLogo'
import { ArrowRight, Lock, Fingerprint } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-[2rem] p-12 space-y-10 relative overflow-hidden group border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col items-center space-y-6 text-center">
             <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20" />
                <AuraLogo className="w-16 h-16 relative z-10" />
             </div>
             <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tighter uppercase">Aura Command</h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secured Perimeter Access</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-4">
                <div className="relative">
                   <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                   <input 
                      type="password" 
                      placeholder="ENTER CLEARANCE KEY"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all text-center tracking-[0.3em]"
                      required
                   />
                </div>
             </div>

             <button 
                type="submit" 
                disabled={isAuthenticating}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden disabled:cursor-not-allowed bg-white text-black hover:bg-cyan-400"
             >
                {isAuthenticating ? (
                  <>
                    <Fingerprint size={16} className="animate-pulse" /> 
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initiate Sequence <ArrowRight size={14} />
                  </>
                )}
                
                {isAuthenticating && (
                   <div className="absolute top-0 left-0 h-full w-full bg-cyan-400/20 animate-scan" />
                )}
             </button>
          </form>

          <div className="text-center">
             <Link href="/" className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                Return to Public Sector
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
