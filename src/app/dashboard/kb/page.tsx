'use client'

import { Upload, Database, ShieldCheck, FileText, Globe, Loader2 } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useState } from 'react'

export default function KnowledgeBase() {
  const { documents, setDocuments, addTelemetryLog } = useAura()
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    document.getElementById('kb-upload')?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    addTelemetryLog({ source: 'INGEST', trace: `Uploading & vectorizing: ${file.name}...`, status: 'PROCESSING' })
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/kb/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (res.ok && data.document) {
        setDocuments(prev => [data.document, ...prev])
        addTelemetryLog({ source: 'INGEST', trace: `Successfully vectorized: ${file.name}`, status: 'SUCCESS' })
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Upload failed:', err)
      addTelemetryLog({ source: 'INGEST', trace: `Failed to upload: ${err.message}`, status: 'ERROR' })
    } finally {
      setIsUploading(false)
      // Reset input
      if (e.target) e.target.value = ''
    }
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
              onClick={handleUploadClick}
              className={`glass-card p-12 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 transition-all ${isUploading ? 'bg-cyan-500/10 border-cyan-500' : 'hover:bg-white/[0.02] cursor-pointer'}`}
           >
              <input type="file" id="kb-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.md" />
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
                       <KBItem key={doc.id} title={doc.title} docs={1} size={doc.size} url={doc.url} />
                    ))
                 ) : (
                    <div className="py-20 flex flex-col items-center justify-center space-y-6">
                       <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                          <div className="w-20 h-20 relative rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-2xl">
                             <Database size={32} className="text-zinc-600" />
                             <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center backdrop-blur-md">
                               <FileText size={14} className="text-cyan-400" />
                             </div>
                          </div>
                       </div>
                       <div className="text-center space-y-2">
                          <p className="text-sm font-bold text-white tracking-wide">Knowledge Base Empty</p>
                          <p className="text-xs text-zinc-500 max-w-[250px]">Upload a document to feed the vector engine. Your agents will automatically learn the content.</p>
                       </div>
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
                  <Metric label="Embedded Vectors" value={documents.length > 0 ? documents.reduce((acc, doc) => acc + (doc.vectors || 0), 0).toLocaleString() : "0"} />
                  <Metric label="Query Latency" value={documents.length > 0 ? "14ms" : "N/A"} />
                  <Metric label="Cluster Health" value={documents.length > 0 ? "Optimal" : "Standby"} />
               </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function KBItem({ title, docs, size, url }: any) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
       <div className="flex items-center gap-4">
          <FileText size={18} className="text-zinc-600" />
          <div>
             <p className="text-sm font-bold text-zinc-300">{title}</p>
             <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{docs} Documents</p>
          </div>
       </div>
       <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-700">{size}</span>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white/5 hover:bg-cyan-500 hover:text-black rounded text-[9px] font-bold uppercase tracking-widest transition-all">
              Open File
            </a>
          )}
       </div>
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
