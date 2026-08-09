import React, { useState, useEffect, useRef } from 'react';
import { CommandCenter } from './components/CommandCenter';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { ExperimentLab } from './components/ExperimentLab';
import { AIJournal } from './components/AIJournal';
import { ContentStudio } from './components/ContentStudio';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { AnalyticsView } from './components/AnalyticsView';
import { SystemHealth } from './components/SystemHealth';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'command' | 'discovery' | 'lab' | 'studio' | 'knowledge' | 'analytics' | 'health'>('command');
  const [workflowState, setWorkflowState] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [hypotheses, setHypotheses] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any>({ specs: [], runs: [], results: [] });
  const [events, setEvents] = useState<any[]>([]);
  const [content, setContent] = useState<any>({ drafts: [], reviews: [] });
  const [publications, setPublications] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any>({ entities: [], relationships: [] });
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [cycleActive, setCycleActive] = useState(false);
  const [cycleSecondsLeft, setCycleSecondsLeft] = useState(120);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const API_BASE = '/api';

  const fetchAllData = async () => {
    try {
      const [wfRes, trRes, gapRes, oppRes, hypRes, expRes, evRes, cntRes, pubRes, knRes, anRes, qRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/workflows/state`).then(r => r.json()),
        fetch(`${API_BASE}/trends`).then(r => r.json()),
        fetch(`${API_BASE}/gaps`).then(r => r.json()),
        fetch(`${API_BASE}/opportunities`).then(r => r.json()),
        fetch(`${API_BASE}/hypotheses`).then(r => r.json()),
        fetch(`${API_BASE}/experiments`).then(r => r.json()),
        fetch(`${API_BASE}/system/events`).then(r => r.json()),
        fetch(`${API_BASE}/content`).then(r => r.json()),
        fetch(`${API_BASE}/publications`).then(r => r.json()),
        fetch(`${API_BASE}/knowledge`).then(r => r.json()),
        fetch(`${API_BASE}/analytics`).then(r => r.json()),
        fetch(`${API_BASE}/questions`).then(r => r.json()),
        fetch(`${API_BASE}/system/agent-logs`).then(r => r.json())
      ]);

      setWorkflowState(wfRes);
      setTrends(trRes);
      setGaps(gapRes);
      setOpportunities(oppRes);
      setHypotheses(hypRes);
      setExperiments(expRes);
      setEvents(evRes);
      setContent(cntRes);
      setPublications(pubRes);
      setKnowledge(knRes);
      setAnalytics(anRes);
      setQuestions(qRes);
      setAgentLogs(logRes);
    } catch (e) {
      console.error('Error fetching dashboard state:', e);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Connect real-time Server-Sent Events (SSE) Stream
    const evtSource = new EventSource(`${API_BASE}/events`);
    evtSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.eventType?.startsWith('STATE_TRANSITION')) {
          setEvents(prev => [...prev, parsed]);
          fetchAllData();
        }
      } catch (e) {}
    };

    const interval = setInterval(fetchAllData, 3000);

    return () => {
      evtSource.close();
      clearInterval(interval);
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };
  }, []);

  const handleTriggerDemo = async () => {
    try {
      await fetch(`${API_BASE}/workflows/demo/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      fetchAllData();
    } catch (error) {
      console.error('Failed to trigger demo workflow:', error);
    }
  };

  const stopCycle = () => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
    setCycleActive(false);
    setCycleSecondsLeft(120);
  };

  const startCycle = () => {
    if (cycleActive) return;
    setCycleActive(true);
    setCycleSecondsLeft(120);
    void handleTriggerDemo();

    cycleTimerRef.current = setInterval(() => {
      setCycleSecondsLeft((prev) => {
        if (prev <= 1) {
          void handleTriggerDemo();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUpdateAutonomy = async (level: number) => {
    await fetch(`${API_BASE}/workflows/autonomy-level`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level })
    });
    fetchAllData();
  };

  const handleApproveContent = async (draftId: string) => {
    await fetch(`${API_BASE}/content/${draftId}/approve`, { method: 'POST' });
    fetchAllData();
  };

  return (
    <div>
      <header className="header-bar">
        <div className="logo-group">
          <div className="logo-badge">AUTONOMOUS AI</div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Autonomous AI Creator
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              From Prompt-Driven AI to Curiosity-Driven AI
            </div>
          </div>
        </div>

        <nav className="nav-tabs">
          <button className={`nav-btn ${activeTab === 'command' ? 'active' : ''}`} onClick={() => setActiveTab('command')}>Command Center</button>
          <button className={`nav-btn ${activeTab === 'discovery' ? 'active' : ''}`} onClick={() => setActiveTab('discovery')}>Discovery Feed</button>
          <button className={`nav-btn ${activeTab === 'lab' ? 'active' : ''}`} onClick={() => setActiveTab('lab')}>Experiment Lab</button>
          <button className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}>Content Studio</button>
          <button className={`nav-btn ${activeTab === 'knowledge' ? 'active' : ''}`} onClick={() => setActiveTab('knowledge')}>Knowledge Graph</button>
          <button className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
          <button className={`nav-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>Health</button>
        </nav>
      </header>

      <main style={{ padding: '1.5rem', maxWidth: '1600px', margin: '0 auto' }}>
        {activeTab === 'command' && (
          <div className="dashboard-grid">
            <div>
              <CommandCenter
                workflowState={workflowState}
                onTriggerDemo={handleTriggerDemo}
                onUpdateAutonomy={handleUpdateAutonomy}
                cycleActive={cycleActive}
                cycleSecondsLeft={cycleSecondsLeft}
                onStartCycle={startCycle}
                onStopCycle={stopCycle}
              />
            </div>
            <div>
              <ExperimentLab hypotheses={hypotheses} experiments={experiments} />
              <div style={{ marginTop: '1.5rem' }}>
                <ContentStudio content={content} publications={publications} onApproveContent={handleApproveContent} />
              </div>
            </div>
            <div className="journal-container">
              <AIJournal events={events} />
            </div>
          </div>
        )}

        {activeTab === 'discovery' && <DiscoveryFeed trends={trends} gaps={gaps} opportunities={opportunities} />}
        {activeTab === 'lab' && <ExperimentLab hypotheses={hypotheses} experiments={experiments} />}
        {activeTab === 'studio' && <ContentStudio content={content} publications={publications} onApproveContent={handleApproveContent} />}
        {activeTab === 'knowledge' && <KnowledgeGraph knowledge={knowledge} />}
        {activeTab === 'analytics' && <AnalyticsView analytics={analytics} questions={questions} />}
        {activeTab === 'health' && <SystemHealth logs={agentLogs} />}
      </main>
    </div>
  );
};
