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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-indicator"></span> Autonomous Command Center
        </h3>
        <span className="badge badge-emerald">
          STATE: {workflowState?.currentState || 'DISCOVERED'}
        </span>
      </div>

      <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.2)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', wordBreak: 'break-all' }}>
        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.2rem', fontWeight: 600, letterSpacing: '0.5px' }}>ACTIVE MISSION ID</div>
        <div style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>
          {workflowState?.missionId || 'mission-init'}
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          AUTONOMY LEVEL REGIME
        </div>
        <div className="autonomy-regime-grid">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              style={{
                padding: '0.45rem 0.2rem',
                border: autonomyLevel === lvl ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                background: autonomyLevel === lvl ? '#ffffff' : '#000000',
                color: autonomyLevel === lvl ? '#000000' : '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: '42px',
                boxShadow: autonomyLevel === lvl ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
              }}
            >
              L{lvl}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.4rem', fontStyle: 'italic' }}>
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
            flex: '1 1 200px',
            padding: '0.65rem 1rem',
            minHeight: '44px',
            background: '#ffffff',
            border: '1px solid #ffffff',
            borderRadius: '8px',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)'
          }}
        >
          🚀 Trigger Autonomous Mission Scenario
        </button>
        <button
          onClick={cycleActive ? onStopCycle : onStartCycle}
          style={{
            flex: '1 1 160px',
            padding: '0.65rem 1rem',
            minHeight: '44px',
            background: cycleActive ? '#000000' : '#18181b',
            border: '1px solid #ffffff',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)'
          }}
        >
          {cycleActive ? '🛑 Stop Cycle' : '⏱️ Start 2-Min Cycle'}
        </button>
      </div>
      <div style={{ marginTop: '0.75rem', color: '#a1a1aa', fontSize: '0.82rem' }}>
        {cycleActive ? `Next auto-run in ${cycleSecondsLeft}s` : 'Cycle mode is inactive'}
      </div>
    </div>
  );
};
