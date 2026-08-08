import React, { useState, useEffect } from 'react';
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

  const fetchAllData = async () => {
    try {
      const [wfRes, trRes, gapRes, oppRes, hypRes, expRes, evRes, cntRes, pubRes, knRes, anRes, qRes, logRes] = await Promise.all([
        fetch('/api/workflows/state').then(r => r.json()),
        fetch('/api/trends').then(r => r.json()),
        fetch('/api/gaps').then(r => r.json()),
        fetch('/api/opportunities').then(r => r.json()),
        fetch('/api/hypotheses').then(r => r.json()),
        fetch('/api/experiments').then(r => r.json()),
        fetch('/api/system/events').then(r => r.json()),
        fetch('/api/content').then(r => r.json()),
        fetch('/api/publications').then(r => r.json()),
        fetch('/api/knowledge').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/questions').then(r => r.json()),
        fetch('/api/system/agent-logs').then(r => r.json())
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
    const evtSource = new EventSource('/api/events');
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
    };
  }, []);

  const handleTriggerDemo = async () => {
    await fetch('/api/demo/run', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    fetchAllData();
  };

  const handleUpdateAutonomy = async (level: number) => {
    await fetch('/api/workflows/autonomy-level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level })
    });
    fetchAllData();
  };

  const handleApproveContent = async (draftId: string) => {
    await fetch(`/api/content/${draftId}/approve`, { method: 'POST' });
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
