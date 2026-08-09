import React, { useState, useEffect } from 'react';

interface Props {
  workflowState: any;
  onTriggerDemo: () => void;
  onUpdateAutonomy: (level: number) => void;
  cycleActive: boolean;
  cycleSecondsLeft: number;
  onStartCycle: () => void;
  onStopCycle: () => void;
}

export const CommandCenter: React.FC<Props> = ({ workflowState, onTriggerDemo, onUpdateAutonomy, cycleActive, cycleSecondsLeft, onStartCycle, onStopCycle }) => {
  const [autonomyLevel, setAutonomyLevel] = useState<number>(workflowState?.autonomyLevel || 3);

  useEffect(() => {
    if (workflowState?.autonomyLevel) {
      setAutonomyLevel(workflowState.autonomyLevel);
    }
  }, [workflowState]);

  const handleLevelChange = (level: number) => {
    setAutonomyLevel(level);
    onUpdateAutonomy(level);
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-indicator"></span> Autonomous Command Center
        </h3>
        <span className="badge badge-indigo">
          STATE: {workflowState?.currentState || 'DISCOVERED'}
        </span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>ACTIVE MISSION ID</div>
        <div style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
          {workflowState?.missionId || 'mission-init'}
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
          AUTONOMY LEVEL REGIME
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              style={{
                padding: '0.4rem 0.2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                background: autonomyLevel === lvl ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.03)',
                color: autonomyLevel === lvl ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              L{lvl}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', fontStyle: 'italic' }}>
          {autonomyLevel === 1 && 'Level 1: AI Researches Only'}
          {autonomyLevel === 2 && 'Level 2: AI Researches + Drafts Content'}
          {autonomyLevel === 3 && 'Level 3: Proposes Publication (Requires Human Gate)'}
          {autonomyLevel === 4 && 'Level 4: Auto-Publishes after Quality Checks'}
          {autonomyLevel === 5 && 'Level 5: Full Closed-Loop Autonomy'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="mobile-btn-stack">
        <button
          onClick={onTriggerDemo}
          style={{
            flex: '1 1 300px',
            padding: '0.65rem 1rem',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}
        >
          🚀 Trigger Autonomous Mission Scenario
        </button>
        <button
          onClick={cycleActive ? onStopCycle : onStartCycle}
          style={{
            flex: '1 1 180px',
            padding: '0.65rem 1rem',
            background: cycleActive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: cycleActive ? '0 4px 15px rgba(239, 68, 68, 0.4)' : '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}
        >
          {cycleActive ? '🛑 Stop Cycle' : '⏱️ Start 2-Min Cycle'}
        </button>
      </div>
      <div style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.82rem' }}>
        {cycleActive ? `Next auto-run in ${cycleSecondsLeft}s` : 'Cycle mode is inactive'}
      </div>
    </div>
  );
};
