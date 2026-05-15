'use client'

import { Upload, Database, ShieldCheck, FileText, Globe, Loader2 } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useState } from 'react'

export default function KnowledgeBase() {
  const { documents, addDocument, addTelemetryLog } = useAura()
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    addTelemetryLog({ source: 'INGEST', trace: 'Initializing vector embedding pipeline...', status: 'PROCESSING' })
    
    setTimeout(() => {
      const newDoc = { id: Date.now().toString(), title: `Aura_Context_${Date.now().toString().slice(-4)}.pdf`, size: '1.4 MB' }
      addDocument(newDoc)
      addTelemetryLog({ source: 'INGEST', trace: `Successfully vectorized: ${newDoc.title}`, status: 'SUCCESS' })
      setIsUploading(false)
    }, 2000)
  }
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Knowledge <span className="text-zinc-500 font-medium">Base</span></h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Vectorized Context Infrastructure</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div 
              onClick={handleUpload}
              className={`glass-card p-12 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 transition-all ${isUploading ? 'bg-cyan-500/10 border-cyan-500' : 'hover:bg-white/[0.02] cursor-pointer'}`}
           >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                 {isUploading ? <Loader2 size={32} className="text-cyan-400 animate-spin" /> : <Upload size={32} className="text-zinc-400" />}
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white tracking-tight">{isUploading ? 'Vectorizing Document...' : 'Sync New Documents'}</h3>
                 <p className="text-sm text-zinc-500 max-w-sm">PDF, Markdown, or Text files. We vectorize and index for RAG processing instantly.</p>
              </div>
           </div>

           <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Active Collections</h3>
              </div>
              <div className="divide-y divide-white/5">
                 {documents.length > 0 ? (
                    documents.map((doc, idx) => (
                       <KBItem key={doc.id} title={doc.title} docs={idx === 0 ? 42 : 1} size={doc.size} />
                    ))
                 ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                       <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <Database size={16} className="text-zinc-600" />
                       </div>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No Collections Found</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400">
                 <Database size={16} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Vector Engine</span>
              </div>
               <div className="space-y-4">
                  <Metric label="Embedded Vectors" value={documents.length > 0 ? `${documents.length * 12}k` : "0"} />
                  <Metric label="Query Latency" value={documents.length > 0 ? "14ms" : "N/A"} />
                  <Metric label="Cluster Health" value={documents.length > 0 ? "Optimal" : "Standby"} />
               </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function KBItem({ title, docs, size }: any) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all">
       <div className="flex items-center gap-4">
          <FileText size={18} className="text-zinc-600" />
          <div>
             <p className="text-sm font-bold text-zinc-300">{title}</p>
             <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{docs} Documents</p>
          </div>
       </div>
       <span className="text-[10px] font-mono text-zinc-700">{size}</span>
    </div>
  )
}

function Metric({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-mono text-white">{value}</span>
    </div>
  )
}
