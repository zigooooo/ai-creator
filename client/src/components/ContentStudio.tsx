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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ✍️ Persona Content Studio & Quality Gate
        </h3>

        {latestDraft ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo">{latestDraft.format.toUpperCase()}</span>
              <span className="badge badge-emerald">Version {latestDraft.version}</span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' }}>
              {latestDraft.title}
            </h4>

            <div style={{
              background: '#000000',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid #1f1f23',
              fontSize: '0.85rem',
              color: '#d1d5db',
              whiteSpace: 'pre-wrap',
              maxHeight: '220px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              marginBottom: '1rem'
            }}>
              {latestDraft.body}
            </div>

            {latestReview && (
              <div style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                  QUALITY & ORIGINALITY GATE SCORE: {latestReview.score?.overallScore}/100
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <div>Factual Correctness: <strong style={{ color: '#e2e8f0' }}>{latestReview.score?.factualCorrectness}%</strong></div>
                  <div>Citation Validity: <strong style={{ color: '#e2e8f0' }}>{latestReview.score?.citationValidity}%</strong></div>
                  <div>Originality: <strong style={{ color: '#e2e8f0' }}>{latestReview.score?.originality}%</strong></div>
                  <div>Safety Rating: <strong style={{ color: '#e2e8f0' }}>{latestReview.score?.safety}%</strong></div>
                </div>
              </div>
            )}

            {!latestPub ? (
              <button
                onClick={() => onApproveContent(latestDraft.id)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  minHeight: '44px',
                  background: '#e2e8f0',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Human Approval: Approve & Publish Content
              </button>
            ) : (
              <div className="badge badge-emerald" style={{ display: 'block', textAlign: 'center', padding: '0.6rem', wordBreak: 'break-all' }}>
                PUBLISHED TO {latestPub.platform.toUpperCase()} ({latestPub.publishedUrl})
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>No drafts created yet.</div>
        )}
      </div>
    </div>
  );
};
