'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Document = { id: string, title: string, size: string }
type Agent = { id: string, name: string, tone: number, empathy: number }

type TelemetryLog = { source: string, trace: string, status: 'SUCCESS' | 'PROCESSING' | 'ERROR', timestamp: string }

interface AuraContextType {
  documents: Document[]
  addDocument: (doc: Document) => void
  activeAgent: Agent | null
  setActiveAgent: (agent: Agent) => void
  renderJobs: any[]
  addRenderJob: (job: any) => void
  telemetryLogs: TelemetryLog[]
  addTelemetryLog: (log: Omit<TelemetryLog, 'timestamp'>) => void
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export function AuraProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [renderJobs, setRenderJobs] = useState<any[]>([])
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([])

  const addDocument = (doc: Document) => setDocuments(prev => [...prev, doc])
  const addRenderJob = (job: any) => setRenderJobs(prev => [...prev, job])
  const addTelemetryLog = (log: Omit<TelemetryLog, 'timestamp'>) => {
    setTelemetryLogs(prev => [{ ...log, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 50))
  }

  return (
    <AuraContext.Provider value={{ documents, addDocument, activeAgent, setActiveAgent, renderJobs, addRenderJob, telemetryLogs, addTelemetryLog }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const context = useContext(AuraContext)
  if (!context) throw new Error('useAura must be used within AuraProvider')
  return context
}
