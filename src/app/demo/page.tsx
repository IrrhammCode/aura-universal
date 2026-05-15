'use client'

import { motion } from 'framer-motion'
import { Mic, Send, Image as ImageIcon, Sparkles, Activity } from 'lucide-react'
import { useState, useRef } from 'react'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'aura', content: string }[]>([])

  const handleSend = async () => {
    if (!userInput.trim()) return

    const message = userInput
    setUserInput('')
    setChatLog(prev => [...prev, { role: 'user', content: message }])
    setIsProcessing(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, imageContext: null }) // We'll add image later
      })
      
      const data = await res.json()
      
      if (data.spoken_response) {
        setChatLog(prev => [...prev, { role: 'aura', content: data.spoken_response }])
        setCurrentEmotion(data.elevenlabs_emotion_tag || 'neutral')
        
        // Simulate speaking duration
        setIsSpeaking(true)
        setTimeout(() => {
          setIsSpeaking(false)
          setCurrentEmotion('neutral')
        }, Math.max(3000, data.spoken_response.length * 50)) // Rough estimation
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Decorations */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${currentEmotion === 'cheerful' ? 'bg-yellow-500/20' : currentEmotion === 'apologetic' ? 'bg-blue-600/20' : 'bg-indigo-600/20'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${currentEmotion === 'cheerful' ? 'bg-orange-500/20' : currentEmotion === 'apologetic' ? 'bg-gray-600/20' : 'bg-pink-600/20'}`} />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tighter">AURA</h1>
        </div>
        <div className="px-3 py-1 rounded-full glass text-xs font-semibold text-yellow-400">
           Mock Mode Active
        </div>
      </header>

      {/* Main Agent Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-indigo-400 w-fit">
            <Sparkles size={14} />
            <span>Multimodal Intelligence</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            The Face of <br />
            <span className="text-gradient">Universal AI</span>
          </h2>
          
          <div className="h-64 overflow-y-auto glass rounded-2xl p-4 flex flex-col gap-3">
             {chatLog.length === 0 ? (
               <p className="text-white/40 text-sm text-center my-auto">Start a conversation...</p>
             ) : (
               chatLog.map((log, i) => (
                 <div key={i} className={`p-3 rounded-xl max-w-[80%] text-sm ${log.role === 'user' ? 'bg-indigo-500/20 self-end text-indigo-100' : 'bg-white/5 self-start text-white/80'}`}>
                   {log.content}
                 </div>
               ))
             )}
             {isProcessing && (
               <div className="bg-white/5 self-start text-white/80 p-3 rounded-xl flex gap-2 items-center">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
               </div>
             )}
          </div>
        </motion.div>

        {/* Avatar Showcase Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative aspect-square max-w-md mx-auto w-full glass rounded-3xl overflow-hidden group transition-all duration-500 ${isSpeaking ? 'shadow-[0_0_50px_rgba(99,102,241,0.5)] border-indigo-500/50' : 'animate-glow'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
          
          {/* Placeholder for HeyGen Avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <motion.div 
                animate={{ scale: isSpeaking ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.5 }}
                className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${isSpeaking ? 'bg-indigo-500/30' : 'bg-white/10'}`}
              >
                {isSpeaking ? <Activity className="text-indigo-400 w-10 h-10" /> : <Mic className="text-white/40 w-10 h-10" />}
              </motion.div>
              <p className="text-sm font-medium text-white/40">
                {isSpeaking ? `Speaking (Emotion: ${currentEmotion})...` : 'Avatar Idle (Mock)'}
              </p>
            </div>
          </div>

          {/* Interactive Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex flex-col gap-4">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                {isSpeaking && (
                  <motion.div 
                    className="h-full bg-indigo-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <span>Signal: {isSpeaking ? 'Active' : 'Stable'}</span>
                <span>Latency: {isProcessing ? '...' : '240ms'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interaction Bar */}
      <footer className="fixed bottom-8 left-4 right-4 flex justify-center z-30">
        <div className="w-full max-w-2xl glass rounded-2xl p-2 flex items-center gap-2 shadow-2xl bg-black/50 backdrop-blur-xl">
          <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-white/60">
            <ImageIcon size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Talk to Aura..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm placeholder:text-white/80"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isProcessing}
          />
          <button 
            onClick={handleSend}
            disabled={isProcessing}
            className="p-3 bg-white text-black rounded-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 px-6 disabled:opacity-50"
          >
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Send</span>
            <Send size={18} />
          </button>
        </div>
      </footer>
    </main>
  )
}
