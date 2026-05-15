'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'

type Document = { id: string, title: string, size: string, vectors?: number, createdAt?: string, url?: string, content?: string }
type Agent = { id: string, name: string, avatarId?: string, voiceId?: string, tone: number, empathy: number, depth: number, themeColor?: string, instructions?: string, templateType?: string }

type TelemetryLog = { source: string, trace: string, status: 'SUCCESS' | 'PROCESSING' | 'ERROR', timestamp: string }
type InteractionLog = { id: string, time: string, input: string, response: string, vision: string, hasImage: boolean }
type Lead = { id: string, name?: string, email?: string, status: string, createdAt: string, lastMessage?: string }

interface AuraContextType {
  agents: Agent[]
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>
  documents: Document[]
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
  addDocument: (doc: Document) => void
  activeAgent: Agent | null
  setActiveAgent: (agent: Agent) => void
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<void>
  renderJobs: any[]
  addRenderJob: (job: any) => void
  telemetryLogs: TelemetryLog[]
  addTelemetryLog: (log: Omit<TelemetryLog, 'timestamp'>) => void
  interactionLogs: InteractionLog[]
  addInteractionLog: (log: Omit<InteractionLog, 'id' | 'time'>) => void
  leads: Lead[]
  walkthroughStep: number
  setWalkthroughStep: (step: number) => void
  isWalkthroughActive: boolean
  setIsWalkthroughActive: (active: boolean) => void
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export function AuraProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [renderJobs, setRenderJobs] = useState<any[]>([])
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([])
  const [interactionLogs, setInteractionLogs] = useState<InteractionLog[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [walkthroughStep, setWalkthroughStep] = useState(-1)
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false)
  const prevLeadsCountRef = useRef<number>(0)

  const addDocument = async (doc: Document) => {
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

  const addAgent = async (agentData: Omit<Agent, 'id'>) => {
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData)
      });
      const newAgent = await res.json();
      if (res.ok && newAgent) {
        setAgents(prev => [...prev, newAgent]);
        setActiveAgent(newAgent);
        addTelemetryLog({ source: 'DEPLOYMENT', trace: `Neural Identity ${newAgent.name} Persisted to Database.`, status: 'SUCCESS' });
      }
    } catch (err) {
      console.error("Failed to persist agent:", err);
      addTelemetryLog({ source: 'DEPLOYMENT', trace: `Database Write Failed for ${agentData.name}`, status: 'ERROR' });
    }
  }

  const addRenderJob = (job: any) => setRenderJobs(prev => [...prev, job])
  
  const addTelemetryLog = (log: Omit<TelemetryLog, 'timestamp'>) => {
    setTelemetryLogs(prev => [{ ...log, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 50))
  }

  const addInteractionLog = async (log: Omit<InteractionLog, 'id' | 'time'>) => {
    const tempLog = { 
      ...log, 
      id: "TRC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      time: new Date().toLocaleTimeString() 
    };
    setInteractionLogs(prev => [tempLog, ...prev].slice(0, 100));
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
  
  // Fetch and poll for real-time updates
  useEffect(() => {
    const fetchData = () => {
      fetch('/api/logs')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setInteractionLogs(data); })
        .catch(err => console.error("Failed to load logs:", err));

      fetch('/api/kb')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setDocuments(data); })
        .catch(err => console.error("Failed to load KB:", err));

      fetch('/api/agents')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
             setAgents(data);
             if (data.length > 0 && !activeAgent) setActiveAgent(data[0]);
          }
        })
        .catch(err => console.error("Failed to load agents:", err));

      fetch('/api/leads')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setLeads(data);
            if (data.length > prevLeadsCountRef.current && prevLeadsCountRef.current > 0) {
               const newLead = data[0];
               toast(`New Lead: ${newLead.name || 'Anonymous'}`, {
                 description: `Interest: ${newLead.lastMessage || 'Aura Interaction'}`,
                 icon: <Bell size={14} className="text-cyan-500" />
               });
            }
            prevLeadsCountRef.current = data.length;
          }
        })
        .catch(err => console.error("Failed to load leads:", err));
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [activeAgent]);

  return (
    <AuraContext.Provider value={{ 
      agents, setAgents, documents, setDocuments, addDocument, activeAgent, setActiveAgent, addAgent,
      renderJobs, addRenderJob, telemetryLogs, addTelemetryLog, interactionLogs, addInteractionLog, 
      leads, walkthroughStep, setWalkthroughStep, isWalkthroughActive, setIsWalkthroughActive 
    }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const context = useContext(AuraContext)
  if (!context) throw new Error('useAura must be used within AuraProvider')
  return context
}
