import { Router } from 'express';
import { db } from '../db/database.js';
import { sseManager } from './events.sse.js';
import { autonomyLoop } from '../orchestrator/autonomy-loop.js';
import { stateMachine } from '../orchestrator/state-machine.js';
import { AutonomyLevel, ContentDraft, ContentReview } from '../types/index.js';
import { getAgentFeed, initializeAutonomousAgent } from '../agents/autonomous-publisher.service.js';

export const router = Router();

// SSE Stream endpoint
router.get('/events', (req, res) => {
  sseManager.addClient(res);
});

// Autonomous persona initialization endpoint
router.post('/agent/init', async (req, res) => {
  const payload = req.body;
  const persona = payload?.persona || {};
  const agent = await initializeAutonomousAgent({
    persona: {
      name: persona.name || 'Ada',
      domain: persona.domain || 'AI Security'
    }
  });
  res.json(agent);
});

// Autonomous persona feed endpoint
router.get('/agent/feed', async (req, res) => {
  const agentId = typeof req.query.agentId === 'string' ? req.query.agentId : '';
  const feed = await getAgentFeed(agentId);
  res.json(feed);
});

// Autonomy Level and Control
router.get('/workflows/state', (req, res) => {
  res.json({
    currentState: stateMachine.getState(),
    missionId: stateMachine.getMissionId(),
    autonomyLevel: autonomyLoop.getAutonomyLevel(),
    persona: Array.from(db.personas.values())[0]
  });
});

router.post('/workflows/autonomy-level', (req, res) => {
  const { level } = req.body;
  if ([1, 2, 3, 4, 5].includes(Number(level))) {
    autonomyLoop.setAutonomyLevel(Number(level) as AutonomyLevel);
    res.json({ success: true, autonomyLevel: autonomyLoop.getAutonomyLevel() });
  } else {
    res.status(400).json({ error: 'Invalid autonomy level' });
  }
});

// Trigger End-to-End Autonomous Mission Demo
router.post('/demo/run', async (req, res) => {
  const { simulatedArticle } = req.body;
  try {
    await autonomyLoop.runFullLoop(simulatedArticle);
    res.json({ success: true, message: 'Autonomous research mission completed successfully.', state: stateMachine.getState() });
  } catch (err: any) {
    console.error('Demo Loop Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Keep the workflow route alias for UI consistency
router.post('/workflows/demo/run', async (req, res) => {
  const { simulatedArticle } = req.body;
  try {
    await autonomyLoop.runFullLoop(simulatedArticle);
    res.json({ success: true, message: 'Autonomous research mission completed successfully.', state: stateMachine.getState() });
  } catch (err: any) {
    console.error('Demo Loop Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Vercel 24/7 Cron Execution Endpoint
router.get('/cron/tick', async (req, res) => {
  try {
    await autonomyLoop.runFullLoop();
    res.json({ success: true, message: '24/7 Autonomous agent loop tick executed.', timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error('Cron Loop Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Content Approval endpoint
router.post('/content/:id/approve', (req, res) => {
  const { id } = req.params;
  const draft = db.contentDrafts.get(id);
  const review = db.contentReviews.get(`review-${id.replace('draft-', '')}`);

  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }

  const pubId = `pub-${Date.now()}`;
  const publication = {
    id: pubId,
    contentId: draft.id,
    platform: draft.format.startsWith('x_') ? ('x' as const) : ('linkedin' as const),
    status: 'published' as const,
    publishedUrl: `https://linkedin.com/posts/mock-${Date.now()}`,
    publishedAt: new Date().toISOString()
  };
  db.publications.set(pubId, publication);

  stateMachine.transition('PUBLISHED', 'Human Reviewer', { draftId: draft.id, publicationId: pubId });
  res.json({ success: true, publication });
});

// Entities & Collection Getters
router.get('/personas', (req, res) => res.json(Array.from(db.personas.values())));
router.get('/sources', (req, res) => res.json(Array.from(db.sources.values())));
router.get('/documents', (req, res) => res.json(Array.from(db.documents.values())));
router.get('/topics', (req, res) => res.json(Array.from(db.topics.values())));
router.get('/trends', (req, res) => res.json(Array.from(db.trends.values())));
router.get('/gaps', (req, res) => res.json(Array.from(db.informationGaps.values())));
router.get('/opportunities', (req, res) => res.json(Array.from(db.opportunities.values())));
router.get('/research', (req, res) => res.json(Array.from(db.researchTasks.values())));
router.get('/claims', (req, res) => res.json(Array.from(db.claims.values())));
router.get('/evidence', (req, res) => res.json(Array.from(db.evidence.values())));
router.get('/contradictions', (req, res) => res.json(Array.from(db.contradictions.values())));
router.get('/hypotheses', (req, res) => res.json(Array.from(db.hypotheses.values())));
router.get('/experiments', (req, res) => res.json({
  specs: Array.from(db.experimentSpecs.values()),
  runs: Array.from(db.experimentRuns.values()),
  results: Array.from(db.experimentResults.values())
}));
router.get('/debates', (req, res) => res.json(Array.from(db.debateResults.values())));
router.get('/content', (req, res) => res.json({
  drafts: Array.from(db.contentDrafts.values()),
  reviews: Array.from(db.contentReviews.values())
}));
router.get('/publications', (req, res) => res.json(Array.from(db.publications.values())));
router.get('/analytics', (req, res) => res.json(Array.from(db.engagementMetrics.values())));
router.get('/memory', (req, res) => res.json(Array.from(db.memories.values())));
router.get('/knowledge', (req, res) => res.json({
  entities: Array.from(db.knowledgeEntities.values()),
  relationships: Array.from(db.knowledgeRelationships.values())
}));
router.get('/questions', (req, res) => res.json(Array.from(db.nextQuestions.values())));
router.get('/system/events', (req, res) => res.json(db.systemEvents));
router.get('/system/agent-logs', (req, res) => res.json(db.agentRunLogs));
