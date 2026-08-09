import React from 'react';

interface Props {
  hypotheses: any[];
  experiments: { specs: any[]; runs: any[]; results: any[] };
}

export const ExperimentLab: React.FC<Props> = ({ hypotheses, experiments }) => {
  const latestHypothesis = hypotheses[hypotheses.length - 1];
  const latestSpec = experiments.specs[experiments.specs.length - 1];
  const latestRun = experiments.runs[experiments.runs.length - 1];
  const latestResult = experiments.results[experiments.results.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🧪 Active Hypothesis & Sandbox Lab
        </h3>

        {latestHypothesis ? (
          <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.18)', padding: '0.9rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>Formulated Hypothesis</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0.3rem 0' }}>
              "{latestHypothesis.statement}"
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.4rem' }}>
              Expected Outcome: {latestHypothesis.expectedOutcome}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>No hypothesis generated yet.</div>
        )}

        {latestSpec && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
              ISOLATED SANDBOX EXECUTION CODE (Node.js Process)
            </div>
            <pre style={{
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '0.85rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-code)',
              fontSize: '0.78rem',
              color: '#ffffff',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              maxHeight: '180px'
            }}>
              {latestSpec.code}
            </pre>
          </div>
        )}

        {latestRun && (
          <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.18)', padding: '0.85rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.5px' }}>RUN STATUS</span>
              <span className={`badge ${latestRun.status === 'success' ? 'badge-emerald' : 'badge-amber'}`}>
                {latestRun.status.toUpperCase()} ({latestRun.executionTimeMs}ms)
              </span>
            </div>

            {latestResult && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.5px' }}>CAPTURED BENCHMARK METRICS:</div>
                <pre style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  marginTop: '0.3rem',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {JSON.stringify(latestResult.metrics, null, 2)}
                </pre>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.4rem' }}>
                  Reproducibility: {latestResult.reproducibilityNotes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
