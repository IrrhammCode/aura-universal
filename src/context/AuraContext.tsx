'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Document = { id: string, title: string, size: string }
type Agent = { id: string, name: string, tone: number, empathy: number }

interface AuraContextType {
  documents: Document[]
  addDocument: (doc: Document) => void
  activeAgent: Agent | null
  setActiveAgent: (agent: Agent) => void
  renderJobs: any[]
  addRenderJob: (job: any) => void
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export function AuraProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Aura Technical Handbook.pdf', size: '156 MB' }
  ])
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [renderJobs, setRenderJobs] = useState<any[]>([])

  const addDocument = (doc: Document) => setDocuments(prev => [...prev, doc])
  const addRenderJob = (job: any) => setRenderJobs(prev => [...prev, job])

  return (
    <AuraContext.Provider value={{ documents, addDocument, activeAgent, setActiveAgent, renderJobs, addRenderJob }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const context = useContext(AuraContext)
  if (!context) throw new Error('useAura must be used within AuraProvider')
  return context
}
