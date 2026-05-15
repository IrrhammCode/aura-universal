'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Document = { id: string, title: string, size: string, vectors?: number, createdAt?: string, url?: string, content?: string }
type Agent = { id: string, name: string, avatarId?: string, voiceId?: string, tone: number, empathy: number, depth: number }

type TelemetryLog = { source: string, trace: string, status: 'SUCCESS' | 'PROCESSING' | 'ERROR', timestamp: string }
type InteractionLog = { id: string, time: string, input: string, response: string, vision: string, hasImage: boolean }

interface AuraContextType {
  agents: Agent[]
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>
  documents: Document[]
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
  addDocument: (doc: Document) => void
  activeAgent: Agent | null
  setActiveAgent: (agent: Agent) => void
  renderJobs: any[]
  addRenderJob: (job: any) => void
  telemetryLogs: TelemetryLog[]
  addTelemetryLog: (log: Omit<TelemetryLog, 'timestamp'>) => void
  interactionLogs: InteractionLog[]
  addInteractionLog: (log: Omit<InteractionLog, 'id' | 'time'>) => void
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export function AuraProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [renderJobs, setRenderJobs] = useState<any[]>([])
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([])
  const [interactionLogs, setInteractionLogs] = useState<InteractionLog[]>([])

  const addDocument = async (doc: Document) => {
    // Optimistic UI update
    const tempDoc = { ...doc, id: doc.id || "DOC-" + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setDocuments(prev => [...prev, tempDoc]);

    try {
      const res = await fetch('/api/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempDoc)
      });
      const data = await res.json();
      if (res.ok && data.document) {
        setDocuments(prev => prev.map(d => d.id === tempDoc.id ? data.document : d));
      }
    } catch (err) {
      console.error("Failed to persist document:", err);
    }
  }
  const addRenderJob = (job: any) => setRenderJobs(prev => [...prev, job])
  const addTelemetryLog = (log: Omit<TelemetryLog, 'timestamp'>) => {
    setTelemetryLogs(prev => [{ ...log, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 50))
  }
  const addInteractionLog = async (log: Omit<InteractionLog, 'id' | 'time'>) => {
    // Optimistic UI update
    const tempLog = { 
      ...log, 
      id: "TRC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      time: new Date().toLocaleTimeString() 
    };
    setInteractionLogs(prev => [tempLog, ...prev].slice(0, 100));

    // Persist to backend
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempLog)
      });
    } catch (err) {
      console.error("Failed to persist interaction log:", err);
    }
  }

  // Fetch historical logs and KB docs on mount
  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInteractionLogs(data);
      })
      .catch(err => console.error("Failed to load logs:", err));

    fetch('/api/kb')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDocuments(data);
      })
      .catch(err => console.error("Failed to load KB:", err));

    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAgents(data);
        if (data.length > 0) setActiveAgent(data[0]);
      })
      .catch(err => console.error("Failed to load agents:", err));
  }, []);

  return (
    <AuraContext.Provider value={{ agents, setAgents, documents, setDocuments, addDocument, activeAgent, setActiveAgent, renderJobs, addRenderJob, telemetryLogs, addTelemetryLog, interactionLogs, addInteractionLog }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const context = useContext(AuraContext)
  if (!context) throw new Error('useAura must be used within AuraProvider')
  return context
}
