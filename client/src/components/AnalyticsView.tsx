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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.85rem' }}>
          📈 Engagement & Learning Insights
        </h3>

        {latestMetric ? (
          <div className="responsive-grid-4" style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>IMPRESSIONS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>{latestMetric.impressions}</div>
            </div>
            <div style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>LIKES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>{latestMetric.likes}</div>
            </div>
            <div style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>COMMENTS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>{latestMetric.comments}</div>
            </div>
            <div style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>ENGAGEMENT RATE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>{latestMetric.engagementRate}%</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>No engagement metrics recorded yet.</div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.85rem' }}>
          🔮 Curiosity Engine: Ranked Candidate Questions
        </h3>
        {questions.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>No candidate questions generated.</div>
        ) : (
          questions.map((q) => (
            <div key={q.id} style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>{q.question}</span>
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
