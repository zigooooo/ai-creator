import React from 'react';

interface Props {
  trends: any[];
  gaps: any[];
  opportunities: any[];
}

export const DiscoveryFeed: React.FC<Props> = ({ trends, gaps, opportunities }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#06b6d4' }}>
          🔥 Emerging Trends & Velocities
        </h3>
        {trends.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No trend data recorded yet.</div>
        ) : (
          trends.map((t) => (
            <div key={t.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{t.topicName}</div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>Velocity: <strong style={{ color: '#34d399' }}>{t.velocity}%</strong></span>
                <span>Novelty: <strong style={{ color: '#818cf8' }}>{t.novelty}%</strong></span>
                <span>Score: <strong style={{ color: '#fbbf24' }}>{t.normalizedScore}/100</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f59e0b' }}>
          🎯 Information Gap Discovery
        </h3>
        {gaps.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No gaps detected.</div>
        ) : (
          gaps.map((g) => (
            <div key={g.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.3rem' }}>{g.gapType}</span>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>{g.description}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem', fontStyle: 'italic' }}>
                Missing Insight: {g.missingInsight}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#10b981' }}>
          💡 Opportunity Score Engine
        </h3>
        {opportunities.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No active opportunities.</div>
        ) : (
          opportunities.map((o) => (
            <div key={o.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{o.title}</span>
                <span className="badge badge-emerald">{o.score?.finalScore}/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                Action: <strong style={{ color: '#38bdf8' }}>{o.score?.actionRecommendation?.toUpperCase()}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
