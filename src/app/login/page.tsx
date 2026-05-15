'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowRight, Eye, EyeOff, Sparkles, Zap, Bot, X } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPromptingTour, setIsPromptingTour] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isLogin) {
      // Register first
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Registration failed')
          setIsLoading(false)
          return
        }
      } catch (err) {
        setError('Failed to connect to server')
        setIsLoading(false)
        return
      }
    }

    // Sign in
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError('Invalid email or password')
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Left Panel — Brand */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative z-10">
        <div>
          <h1 className="text-6xl font-black text-white tracking-[-0.06em] leading-none">
            AURA
          </h1>
          <p className="text-sm font-bold text-zinc-600 uppercase tracking-[0.4em] mt-3">Autonomous Universal Response Agent</p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4 max-w-md">
            {[
              { label: 'Vision Intelligence', desc: 'Aura sees and understands visual context from any input.' },
              { label: 'Voice Synthesis', desc: 'ElevenLabs-powered speech that sounds indistinguishable from human.' },
              { label: 'Video Outreach', desc: 'Batch-generate personalized video messages at enterprise scale.' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all">
                  <Sparkles size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{f.label}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
          © 2026 Aura AI Platform. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="lg:hidden mb-6">
                <h1 className="text-4xl font-black text-white tracking-[-0.06em]">AURA</h1>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-zinc-500 mt-2">
                {isLogin ? 'Sign in to access your neural workspace' : 'Join the next generation of AI-powered outreach'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-8 text-center space-y-6">
              <button
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="font-bold text-white">{isLogin ? 'Sign Up' : 'Sign In'}</span>
              </button>

              <div className="pt-8 border-t border-white/5 relative group">
                <div className="absolute -inset-1 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4 animate-pulse">Are you a hackathon judge?</p>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const res = await signIn('credentials', {
                      email: 'admin@aura.ai',
                      password: 'password123',
                      redirect: false
                    });
                    if (res?.ok) {
                      setIsPromptingTour(true);
                      setIsLoading(false);
                    } else {
                      setError('Neural Bypass Failed. Please try again.');
                      setIsLoading(false);
                    }
                  }}
                  className="w-full py-4 rounded-xl bg-cyan-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] relative z-10"
                >
                   <Sparkles size={14} className="animate-spin-slow" />
                   Enter Judge Workspace
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Neural Tour Prompt Overlay */}
      <AnimatePresence>
        {isPromptingTour && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="w-full max-w-lg glass-card p-12 border border-cyan-500/30 text-center space-y-8 shadow-[0_0_100px_rgba(6,182,212,0.2)]"
             >
                <div className="flex justify-center">
                   <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 animate-pulse">
                      <Bot size={40} className="text-cyan-500" />
                   </div>
                </div>
                <div className="space-y-3">
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Judge Access Verified</h2>
                   <p className="text-sm text-zinc-500 leading-relaxed">
                      Welcome to the Aura Judge Workspace. Before you begin, would you like a <span className="text-cyan-500 font-bold">Guided Neural Walkthrough</span> to explain the technology behind this platform?
                   </p>
                </div>
                <div className="flex flex-col gap-4">
                   <button 
                     onClick={() => {
                       localStorage.setItem('aura_start_tour', 'true');
                       router.push('/dashboard');
                     }}
                     className="w-full py-5 bg-cyan-500 text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_20px_40px_-10px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3"
                   >
                      <Sparkles size={16} /> Yes, Start Walkthrough
                   </button>
                   <button 
                     onClick={() => {
                       localStorage.removeItem('aura_start_tour');
                       router.push('/dashboard');
                     }}
                     className="w-full py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
                   >
                      No, I want to explore myself
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
