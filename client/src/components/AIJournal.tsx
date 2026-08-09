import React from 'react';

interface Props {
  events: any[];
}

export const AIJournal: React.FC<Props> = ({ events }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📓 Autonomous AI Event Journal
      </h3>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.2rem' }}>
        {events.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>No system events logged yet.</div>
        ) : (
          events.slice().reverse().map((evt) => (
            <div key={evt.id} style={{
              background: '#000000',
              border: '1px solid #1f1f23',
              borderLeft: '3px solid #d4d4d8',
              padding: '0.6rem 0.8rem',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.8rem',
              wordBreak: 'break-word'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.7rem' }}>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{evt.agentName || 'System'}</span>
                <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', marginTop: '0.2rem' }}>
                {evt.eventType.replace('STATE_TRANSITION:', 'State: ')}
              </div>
              {evt.payload?.action && (
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                  {evt.payload.action}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
