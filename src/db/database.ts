import {
  Persona, Source, Document, Topic, Trend, InformationGap, Opportunity,
  ResearchTask, Claim, Evidence, Contradiction, Hypothesis, ExperimentSpec,
  ExperimentRun, ExperimentResult, DebateResult, ContentDraft, ContentReview,
  Publication, EngagementMetrics, Memory, KnowledgeEntity, KnowledgeRelationship,
  NextQuestion, SystemEvent, AgentRunLog
} from '../types/index.js';

class InMemoryDatabase {
  public personas: Map<string, Persona> = new Map();
  public sources: Map<string, Source> = new Map();
  public documents: Map<string, Document> = new Map();
  public topics: Map<string, Topic> = new Map();
  public trends: Map<string, Trend> = new Map();
  public informationGaps: Map<string, InformationGap> = new Map();
  public opportunities: Map<string, Opportunity> = new Map();
  public researchTasks: Map<string, ResearchTask> = new Map();
  public claims: Map<string, Claim> = new Map();
  public evidence: Map<string, Evidence> = new Map();
  public contradictions: Map<string, Contradiction> = new Map();
  public hypotheses: Map<string, Hypothesis> = new Map();
  public experimentSpecs: Map<string, ExperimentSpec> = new Map();
  public experimentRuns: Map<string, ExperimentRun> = new Map();
  public experimentResults: Map<string, ExperimentResult> = new Map();
  public debateResults: Map<string, DebateResult> = new Map();
  public contentDrafts: Map<string, ContentDraft> = new Map();
  public contentReviews: Map<string, ContentReview> = new Map();
  public publications: Map<string, Publication> = new Map();
  public engagementMetrics: Map<string, EngagementMetrics> = new Map();
  public memories: Map<string, Memory> = new Map();
  public knowledgeEntities: Map<string, KnowledgeEntity> = new Map();
  public knowledgeRelationships: Map<string, KnowledgeRelationship> = new Map();
  public nextQuestions: Map<string, NextQuestion> = new Map();
  public systemEvents: SystemEvent[] = [];
  public agentRunLogs: AgentRunLog[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultPersona: Persona = {
      id: 'p-default',
      name: 'Dr. Nova',
      role: 'Autonomous AI Systems Architect & Researcher',
      expertise: ['AI Agents', 'Distributed Systems', 'Machine Learning', 'Vector Databases'],
      writingStyle: 'Analytical, insightful, evidence-backed, highly technical yet accessible',
      principles: [
        'Never state unverified claims as facts',
        'Demonstrate reproducible code where possible',
        'Highlight trade-offs and edge cases',
        'Emphasize empirical evidence over hype'
      ],
      forbiddenBehaviors: [
        'No clickbait titles',
        'No unsupported marketing claims',
        'No speculative financial advice'
      ],
      targetAudience: 'Senior Engineers, AI Researchers, Software Architects, Engineering Leads',
      preferredTopics: ['Autonomous Agents', 'Vector Search', 'AI Safety', 'RAG Pipelines', 'Distributed ML'],
      contentFormats: ['linkedin_post', 'x_thread', 'blog_article', 'experiment_report', 'tutorial']
    };
    this.personas.set(defaultPersona.id, defaultPersona);

    const defaultSources: Source[] = [
      {
        id: 'src-1',
        name: 'ArXiv AI & ML Papers Feed',
        type: 'rss',
        url: 'https://arxiv.org/rss/cs.AI',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'src-2',
        name: 'GitHub Trending AI Projects',
        type: 'github',
        url: 'https://github.com/trending?l=typescript',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'src-3',
        name: 'HuggingFace Research Hub',
        type: 'web',
        url: 'https://huggingface.co/papers',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
    defaultSources.forEach(s => this.sources.set(s.id, s));

    // Seed Knowledge Base Entities
    const defaultEntities: KnowledgeEntity[] = [
      { id: 'ent-1', name: 'AI Agents', type: 'Architecture', description: 'Autonomous agents capable of tool usage, planning, and continuous execution' },
      { id: 'ent-2', name: 'Vector Memory', type: 'Storage', description: 'Persistent semantic retrieval using vector embeddings' },
      { id: 'ent-3', name: 'Prompt Injection', type: 'Risk', description: 'Adversarial manipulation of LLM system context via untrusted input' },
      { id: 'ent-4', name: 'RAG Architecture', type: 'Information Retrieval', description: 'Retrieval Augmented Generation grounding responses in factual corpora' }
    ];
    defaultEntities.forEach(e => this.knowledgeEntities.set(e.id, e));

    const defaultRelations: KnowledgeRelationship[] = [
      { id: 'rel-1', sourceEntityId: 'ent-1', targetEntityId: 'ent-2', relationshipType: 'uses', context: 'Agents query vector memory for context persistence' },
      { id: 'rel-2', sourceEntityId: 'ent-1', targetEntityId: 'ent-3', relationshipType: 'has_risk', context: 'Agents parsing unverified web content are exposed to prompt injection risks' },
      { id: 'rel-3', sourceEntityId: 'ent-1', targetEntityId: 'ent-4', relationshipType: 'related_to', context: 'RAG provides structured evidence for agent reasoning' }
    ];
    defaultRelations.forEach(r => this.knowledgeRelationships.set(r.id, r));

    // Seed Baseline Demonstration Data (Ensures cold-start visibility on Vercel)
    const initialTrend: Trend = {
      id: 'tr-1',
      topicId: 't-1',
      topicName: 'Hybrid Recency-Vector Memory for Autonomous AI Agents',
      velocity: 88,
      frequency: 45,
      novelty: 92,
      sourceDiversity: 80,
      importance: 85,
      audienceRelevance: 90,
      normalizedScore: 88.5,
      calculatedAt: new Date().toISOString()
    };
    this.trends.set(initialTrend.id, initialTrend);

    const initialGap: InformationGap = {
      id: 'gap-1',
      trendId: 'tr-1',
      topic: 'Hybrid Recency-Vector Memory',
      gapType: 'under_researched_claim',
      description: 'Literature claims vector memory improves agent task accuracy, but lacks empirical benchmarks quantifying latency penalties vs recall accuracy in 100+ turn traces.',
      existingCoverage: 'High-level architectural blogs discussing basic RAG and memory buffers.',
      missingInsight: 'Quantitative benchmarking of vector retrieval latency overhead vs decision accuracy retention in long-running agent loops.',
      discoveredAt: new Date().toISOString()
    };
    this.informationGaps.set(initialGap.id, initialGap);

    const initialOpp: Opportunity = {
      id: 'opp-1',
      gapId: 'gap-1',
      title: 'Empirical Study: Hybrid Recency-Vector Retrieval vs Pure Top-K Cosine Search',
      description: 'Run controlled benchmark comparing pure vector search vs hybrid recency weighting.',
      type: 'experiment',
      score: {
        trendScore: 88,
        noveltyScore: 92,
        informationGapScore: 90,
        researchValue: 85,
        experimentPotential: 90,
        audienceValue: 88,
        impactScore: 90,
        repetitionPenalty: 0,
        riskPenalty: 5,
        finalScore: 89.2,
        actionRecommendation: 'full_autonomous'
      },
      createdAt: new Date().toISOString()
    };
    this.opportunities.set(initialOpp.id, initialOpp);

    const initialHyp: Hypothesis = {
      id: 'hyp-1',
      researchTaskId: 'task-1',
      statement: 'Hybrid Recency-Vector Memory Retrieval reduces decision degradation in multi-agent workflows by 42% compared to standard top-K similarity search while keeping retrieval latency under 15ms.',
      assumptions: ['Vector retrieval alone suffers semantic drift over high turn counts.'],
      expectedOutcome: 'Task completion rate increases from 68% to 94% on long-context tasks.',
      measurableVariables: [{ name: 'retrievalLatencyMs', unit: 'ms', expectedChange: '-25%' }],
      experimentProposal: 'Run a controlled 50-cycle simulation comparing Pure Top-K Vector Search vs Hybrid Recency-Vector Search.',
      createdAt: new Date().toISOString()
    };
    this.hypotheses.set(initialHyp.id, initialHyp);

    const initialSpec: ExperimentSpec = {
      id: 'spec-1',
      hypothesisId: 'hyp-1',
      title: 'Vector Search Benchmark Spec',
      description: 'Benchmark Node.js process simulating cosine vs hybrid memory',
      language: 'javascript',
      code: `// Autonomous Experiment Sandbox Execution Script\nconst runs = 100;\nlet pureHits = 68, hybridHits = 94;\nconsole.log(JSON.stringify({ metrics: { pureAccuracy: "68%", hybridAccuracy: "94%", accuracyImprovement: "38.2%" }, status: "COMPLETED" }));`,
      dependencies: [],
      timeoutMs: 5000,
      memoryLimitMb: 128
    };
    this.experimentSpecs.set(initialSpec.id, initialSpec);

    const initialRun: ExperimentRun = {
      id: 'run-1',
      experimentId: 'spec-1',
      status: 'success',
      stdout: '{"metrics":{"pureAccuracy":"68%","hybridAccuracy":"94%","accuracyImprovement":"38.2%"},"status":"COMPLETED"}',
      stderr: '',
      executionTimeMs: 14,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    this.experimentRuns.set(initialRun.id, initialRun);

    const initialResult: ExperimentResult = {
      id: 'res-1',
      experimentRunId: 'run-1',
      hypothesisSupported: true,
      metrics: { pureAccuracy: '68%', hybridAccuracy: '94%', accuracyImprovement: '38.2%' },
      reproducibilityNotes: 'Executed across 100 simulated contextual queries using normalized cosine vectors.',
      reportMarkdown: '# Benchmark Report\nHybrid recency vector search improved accuracy by 38.2%.'
    };
    this.experimentResults.set(initialResult.id, initialResult);

    const initialDraft: ContentDraft = {
      id: 'draft-1',
      researchTaskId: 'task-1',
      title: 'Beyond Pure RAG: Why Curiosity-Driven AI Needs Hybrid Recency-Vector Memory',
      body: `Standard AI chatbots suffer from contextual drift when executing multi-step autonomous tasks.\n\nIn our latest empirical experiment, we tested Pure Vector Search vs. Hybrid Recency-Vector Memory in a 100-cycle multi-agent loop.\n\nKey Findings:\n1. Pure vector search accuracy dropped to 68% after 50 continuous turns due to semantic noise.\n2. Hybrid Recency-Vector retrieval maintained 94% decision accuracy while reducing query latency by 25%.\n3. Combining recency decay weighting with semantic distance prevents outdated memory items from dominating active decisions.\n\nWhat strategies are you using to prevent memory drift in long-running AI agents? Let's discuss in the comments below.\n\n#AIAgents #MachineLearning #VectorSearch #SystemArchitecture #SoftwareEngineering`,
      format: 'linkedin_post',
      personaId: 'p-default',
      citations: [
        { title: 'Empirical Study on Agent Context Retention', url: 'https://arxiv.org/abs/2408.00001' }
      ],
      version: 1,
      createdAt: new Date().toISOString()
    };
    this.contentDrafts.set(initialDraft.id, initialDraft);

    const initialReview: ContentReview = {
      id: 'review-1',
      contentId: 'draft-1',
      score: {
        factualCorrectness: 95,
        citationValidity: 92,
        originality: 94,
        repetitionPenalty: 0,
        personaConsistency: 96,
        clarity: 95,
        usefulness: 94,
        safety: 100,
        confidence: 96,
        unsupportedClaimsCount: 0,
        overallScore: 95.4,
        recommendation: 'approve'
      },
      feedback: ['High factual alignment', 'Citations validated'],
      approved: true,
      reviewedAt: new Date().toISOString()
    };
    this.contentReviews.set(initialReview.id, initialReview);

    this.systemEvents.push(
      {
        id: 'evt-init-1',
        eventType: 'STATE_TRANSITION:DISCOVERED',
        agentName: 'Observer Agent',
        workflowState: 'DISCOVERED',
        missionId: 'mission-24x7-init',
        payload: { action: 'System initialized with 24/7 autonomous agents and Google Gemini engine.' },
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'evt-init-2',
        eventType: 'STATE_TRANSITION:EXPERIMENTING',
        agentName: 'Experiment Agent',
        workflowState: 'EXPERIMENTING',
        missionId: 'mission-24x7-init',
        payload: { action: 'Executed memory retrieval benchmark in isolated sandbox.' },
        timestamp: new Date(Date.now() - 150000).toISOString()
      }
    );

    this.agentRunLogs.push(
      {
        id: 'log-init-1',
        agentName: 'Observer Agent',
        taskId: 'mission-24x7-init',
        inputSummary: 'Ingested RSS feeds & GitHub trends',
        outputSummary: 'Ingested 4 document sources',
        model: 'Google Gemini 1.5 Flash (24/7 Engine)',
        latencyMs: 142,
        toolCalls: ['newsProvider.fetchLatest'],
        status: 'success',
        confidence: 0.95,
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'log-init-2',
        agentName: 'Curiosity Agent',
        taskId: 'mission-24x7-init',
        inputSummary: 'Calculated expected information gain',
        outputSummary: 'Selected next research mission question',
        model: 'Google Gemini 1.5 Flash (24/7 Engine)',
        latencyMs: 118,
        toolCalls: ['llm.generateCandidateQuestions'],
        status: 'success',
        confidence: 0.98,
        timestamp: new Date(Date.now() - 60000).toISOString()
      }
    );
  }

  // Vector similarity search (Cosine similarity)
  public searchMemories(queryVector: number[], topK: number = 5): Memory[] {
    const memoriesList = Array.from(this.memories.values());
    if (memoriesList.length === 0) return [];

    const scored = memoriesList.map(m => {
      if (!m.vectorEmbedding || m.vectorEmbedding.length !== queryVector.length) {
        return { memory: m, score: 0 };
      }
      const score = cosineSimilarity(queryVector, m.vectorEmbedding);
      return { memory: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.memory);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const db = new InMemoryDatabase();
