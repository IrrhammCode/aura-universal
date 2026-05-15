'use client'

import { FileText, Upload, Database, Loader2, Trash2, X, Wand2, Search, Link as LinkIcon, Info, Activity, Globe, Cpu } from 'lucide-react'
import { useAura } from '@/context/AuraContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KnowledgeBase() {
  const { documents, setDocuments, addTelemetryLog } = useAura()
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUploadClick = () => {
    document.getElementById('kb-upload')?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    addTelemetryLog({ source: 'INGEST', trace: `Vectorizing: ${file.name}...`, status: 'PROCESSING' })
    
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
      if (e.target) e.target.value = ''
    }
  }

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Delete document and flush vector embeddings?")) return;
    try {
      const res = await fetch(`/api/kb?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        addTelemetryLog({ source: 'VECTOR_DB', trace: `Deleted document ${id}`, status: 'SUCCESS' });
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Knowledge <span className="text-zinc-500 font-medium">Matrix</span></h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Neural Semantic Storage</p>
        </div>
        <div className="flex gap-8">
           <Metric label="Embedded Vectors" value={documents.length > 0 ? documents.reduce((acc, doc) => acc + (doc.vectors || 0), 0).toLocaleString() : "0"} />
           <Metric label="Cluster Health" value={documents.length > 0 ? "Optimal" : "Standby"} color="text-cyan-400" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Ingestion & Listing (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Ingestion Lab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className={`glass-card p-6 border-dashed border-white/10 rounded-2xl flex items-center gap-6 transition-all ${isUploading ? 'opacity-50' : 'hover:bg-white/5 hover:border-cyan-500/50 cursor-pointer'}`}
               >
                  <input type="file" id="kb-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.md" />
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                     {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  </div>
                  <div className="text-left">
                     <h3 className="text-xs font-black text-white uppercase tracking-widest">Static Import</h3>
                     <p className="text-[9px] text-zinc-500 uppercase mt-1">PDF, Markdown, or Text files</p>
                  </div>
               </button>

               <div className="glass-card p-6 border-white/10 rounded-2xl flex items-center gap-6 bg-white/[0.01]">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                     <Globe size={20} />
                  </div>
                  <div className="flex-1 space-y-2">
                     <h3 className="text-xs font-black text-white uppercase tracking-widest">Neural Crawler</h3>
                     <div className="flex gap-2">
                        <input 
                           id="kb-url-scrape"
                           type="text" 
                           placeholder="Enter website URL..." 
                           className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-purple-500/50"
                        />
                        <button 
                           onClick={async () => {
                             const url = (document.getElementById('kb-url-scrape') as HTMLInputElement).value;
                             if (!url) return;
                             setIsUploading(true);
                             try {
                               const res = await fetch('/api/kb/scrape', {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ url })
                               });
                               const data = await res.json();
                               if (data.document) setDocuments(prev => [data.document, ...prev]);
                             } catch (e) { console.error(e); }
                             finally { setIsUploading(false); }
                           }}
                           className="px-3 py-2 bg-purple-500 text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-purple-400 transition-all"
                        >
                           Scan
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Collection List */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[500px]">
               <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Database size={14} className="text-zinc-500" />
                     <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Collections</h3>
                  </div>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
                     <input 
                        type="text" 
                        placeholder="Filter Matrix..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/40 border border-white/5 rounded-lg pl-8 pr-4 py-2 text-[10px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
                     />
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
                  <AnimatePresence>
                     {filteredDocuments.map((doc, idx) => (
                        <motion.div 
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                           <KBItem 
                             id={doc.id} 
                             title={doc.title} 
                             vectors={doc.vectors} 
                             size={doc.size} 
                             url={doc.url} 
                             onDelete={handleDeleteDoc} 
                           />
                        </motion.div>
                     ))}
                  </AnimatePresence>
                  
                  {filteredDocuments.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                        <Database size={40} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Contextual Data Found</p>
                     </div>
                  )}
               </div>
            </div>
        </div>

        {/* RIGHT: Architecture Status (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 space-y-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Cpu size={16} className="text-cyan-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Vector Architecture</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-4">
                     <ArchitectureRow label="Encoding" value="text-embedding-3-small" />
                     <ArchitectureRow label="Dimensions" value="1536 (Normalized)" />
                     <ArchitectureRow label="Index Type" value="HNSW / Cosine" />
                     <ArchitectureRow label="Latency" value="12ms avg" />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">Storage Capacity</span>
                        <span className="text-[10px] font-mono text-cyan-400">84% Optimal</span>
                     </div>
                     <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 bg-cyan-500/5 border-cyan-500/20">
               <div className="flex items-center gap-3 mb-4 text-cyan-400">
                  <Info size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Sync Protocol</h3>
               </div>
               <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Data within the Matrix is automatically vectorized and partitioned. Once synchronized, all active agents can retrieve this context during real-time interactions for zero-shot grounding.
               </p>
            </div>
        </div>
      </div>
    </div>
  )
}

function KBItem({ id, title, vectors, size, url, onDelete }: any) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-cyan-400 transition-colors">
             <FileText size={18} />
          </div>
          <div>
             <p className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</p>
             <div className="flex items-center gap-3 mt-1">
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{vectors} Vectors</span>
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{size}</span>
             </div>
          </div>
       </div>
       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors">
               <Globe size={14} />
            </a>
          )}
          <button onClick={() => onDelete(id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
             <Trash2 size={14} />
          </button>
       </div>
    </div>
  )
}

function Metric({ label, value, color = "text-white" }: any) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
       <p className={`text-lg font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  )
}

function ArchitectureRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-mono text-zinc-300">{value}</span>
    </div>
  )
}
