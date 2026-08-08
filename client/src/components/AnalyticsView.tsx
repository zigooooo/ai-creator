import React from 'react';

interface Props {
  analytics: any[];
  questions: any[];
}

export const AnalyticsView: React.FC<Props> = ({ analytics, questions }) => {
  const latestMetric = analytics[analytics.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.85rem' }}>
          📈 Engagement & Learning Insights
        </h3>

        {latestMetric ? (
          <div className="responsive-grid-4" style={{ marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>IMPRESSIONS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{latestMetric.impressions}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LIKES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{latestMetric.likes}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>COMMENTS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{latestMetric.comments}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ENGAGEMENT RATE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>{latestMetric.engagementRate}%</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No engagement metrics recorded yet.</div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.85rem' }}>
          🔮 Curiosity Engine: Ranked Candidate Questions
        </h3>
        {questions.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No candidate questions generated.</div>
        ) : (
          questions.map((q) => (
            <div key={q.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{q.question}</span>
                <span className={`badge ${q.selected ? 'badge-emerald' : 'badge-indigo'}`}>
                  {q.selected ? 'SELECTED NEXT MISSION' : `SCORE ${q.rankedScore}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
