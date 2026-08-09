import React from 'react';

interface Props {
  knowledge: { entities: any[]; relationships: any[] };
}

export const KnowledgeGraph: React.FC<Props> = ({ knowledge }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🕸️ Persistent Knowledge Graph
      </h3>

      <div className="responsive-grid-2">
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>ENTITIES</div>
          {knowledge.entities.map((e) => (
            <div key={e.id} style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>{e.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{e.type} - {e.description}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>RELATIONSHIPS</div>
          {knowledge.relationships.map((r) => (
            <div key={r.id} style={{ background: '#000000', border: '1px solid #1f1f23', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.4rem', wordBreak: 'break-word' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span>Entity #{r.sourceEntityId} →</span>
                <span className="badge badge-indigo">{r.relationshipType}</span>
                <span>→ Entity #{r.targetEntityId}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{r.context}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
