import React from 'react';

interface Props {
  logs: any[];
}

export const SystemHealth: React.FC<Props> = ({ logs }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginBottom: '0.85rem' }}>
        ⚡ System Health & Agent Telemetry
      </h3>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>TIMESTAMP</th>
              <th style={{ padding: '0.5rem' }}>AGENT NAME</th>
              <th style={{ padding: '0.5rem' }}>MODEL</th>
              <th style={{ padding: '0.5rem' }}>LATENCY</th>
              <th style={{ padding: '0.5rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice().reverse().map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.5rem', color: '#64748b' }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#f8fafc' }}>{l.agentName}</td>
                <td style={{ padding: '0.5rem', color: '#38bdf8' }}>{l.model}</td>
                <td style={{ padding: '0.5rem', color: '#fbbf24' }}>{l.latencyMs}ms</td>
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
