import React from 'react';

interface Props {
  logs: any[];
}

export const SystemHealth: React.FC<Props> = ({ logs }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.85rem' }}>
        ⚡ System Health & Agent Telemetry
      </h3>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f23', color: '#9ca3af', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem', fontWeight: 700 }}>TIMESTAMP</th>
              <th style={{ padding: '0.5rem', fontWeight: 700 }}>AGENT NAME</th>
              <th style={{ padding: '0.5rem', fontWeight: 700 }}>MODEL</th>
              <th style={{ padding: '0.5rem', fontWeight: 700 }}>LATENCY</th>
              <th style={{ padding: '0.5rem', fontWeight: 700 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice().reverse().map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #141417' }}>
                <td style={{ padding: '0.5rem', color: '#6b7280' }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: '0.5rem', fontWeight: 700, color: '#e2e8f0' }}>{l.agentName}</td>
                <td style={{ padding: '0.5rem', color: '#d1d5db', fontWeight: 600 }}>{l.model}</td>
                <td style={{ padding: '0.5rem', color: '#e2e8f0', fontWeight: 700 }}>{l.latencyMs}ms</td>
                <td style={{ padding: '0.5rem' }}>
                  <span className={`badge ${l.status === 'success' ? 'badge-emerald' : 'badge-rose'}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
