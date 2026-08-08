import React from 'react';

interface Props {
  content: { drafts: any[]; reviews: any[] };
  publications: any[];
  onApproveContent: (draftId: string) => void;
}

export const ContentStudio: React.FC<Props> = ({ content, publications, onApproveContent }) => {
  const latestDraft = content.drafts[content.drafts.length - 1];
  const latestReview = content.reviews[content.reviews.length - 1];
  const latestPub = publications[publications.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ✍️ Persona Content Studio & Quality Gate
        </h3>

        {latestDraft ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo">{latestDraft.format.toUpperCase()}</span>
              <span className="badge badge-emerald">Version {latestDraft.version}</span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              {latestDraft.title}
            </h4>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.85rem',
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              maxHeight: '220px',
              overflowY: 'auto',
              marginBottom: '1rem'
            }}>
              {latestDraft.body}
            </div>

            {latestReview && (
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.4rem' }}>
                  QUALITY & ORIGINALITY GATE SCORE: {latestReview.score?.overallScore}/100
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div>Factual Correctness: <strong style={{ color: '#34d399' }}>{latestReview.score?.factualCorrectness}%</strong></div>
                  <div>Citation Validity: <strong style={{ color: '#34d399' }}>{latestReview.score?.citationValidity}%</strong></div>
                  <div>Originality: <strong style={{ color: '#818cf8' }}>{latestReview.score?.originality}%</strong></div>
                  <div>Safety Rating: <strong style={{ color: '#34d399' }}>{latestReview.score?.safety}%</strong></div>
                </div>
              </div>
            )}

            {!latestPub ? (
              <button
                onClick={() => onApproveContent(latestDraft.id)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                ✅ Human Approval: Approve & Publish Content
              </button>
            ) : (
              <div className="badge badge-emerald" style={{ display: 'block', textAlign: 'center', padding: '0.6rem' }}>
                PUBLISHED TO {latestPub.platform.toUpperCase()} ({latestPub.publishedUrl})
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No drafts created yet.</div>
        )}
      </div>
    </div>
  );
};
