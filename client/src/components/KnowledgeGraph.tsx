import React from 'react';

interface Props {
  knowledge: { entities: any[]; relationships: any[] };
}

export const KnowledgeGraph: React.FC<Props> = ({ knowledge }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🕸️ Persistent Knowledge Graph
      </h3>

      <div className="responsive-grid-2">
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>ENTITIES</div>
          {knowledge.entities.map((e) => (
            <div key={e.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{e.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.type} - {e.description}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>RELATIONSHIPS</div>
          {knowledge.relationships.map((r) => (
            <div key={r.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#818cf8' }}>
                Entity #{r.sourceEntityId} → <span className="badge badge-indigo">{r.relationshipType}</span> → Entity #{r.targetEntityId}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{r.context}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
