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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ✍️ Persona Content Studio & Quality Gate
        </h3>

        {latestDraft ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo">{latestDraft.format.toUpperCase()}</span>
              <span className="badge badge-emerald">Version {latestDraft.version}</span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {latestDraft.title}
            </h4>

            <div style={{
              background: '#000000',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.85rem',
              color: '#ffffff',
              whiteSpace: 'pre-wrap',
              maxHeight: '220px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              marginBottom: '1rem'
            }}>
              {latestDraft.body}
            </div>

            {latestReview && (
              <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.18)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                  QUALITY & ORIGINALITY GATE SCORE: {latestReview.score?.overallScore}/100
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
                  <div>Factual Correctness: <strong style={{ color: '#ffffff' }}>{latestReview.score?.factualCorrectness}%</strong></div>
                  <div>Citation Validity: <strong style={{ color: '#ffffff' }}>{latestReview.score?.citationValidity}%</strong></div>
                  <div>Originality: <strong style={{ color: '#ffffff' }}>{latestReview.score?.originality}%</strong></div>
                  <div>Safety Rating: <strong style={{ color: '#ffffff' }}>{latestReview.score?.safety}%</strong></div>
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
                ✅ Human Approval: Approve & Publish Content
              </button>
            ) : (
              <div className="badge badge-emerald" style={{ display: 'block', textAlign: 'center', padding: '0.6rem', wordBreak: 'break-all' }}>
                PUBLISHED TO {latestPub.platform.toUpperCase()} ({latestPub.publishedUrl})
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>No drafts created yet.</div>
        )}
      </div>
    </div>
  );
};
