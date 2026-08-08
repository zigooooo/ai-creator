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
