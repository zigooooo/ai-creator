export type AutonomyLevel = 1 | 2 | 3 | 4 | 5;

export type WorkflowState =
  | 'DISCOVERED'
  | 'INTERESTING'
  | 'GAP_FOUND'
  | 'RESEARCHING'
  | 'HYPOTHESIS_CREATED'
  | 'EXPERIMENTING'
  | 'DEBATING'
  | 'VERIFIED'
  | 'CONTENT_CREATED'
  | 'QUALITY_CHECK'
  | 'APPROVAL_REQUIRED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ANALYZED'
  | 'LEARNED'
  | 'NEXT_QUESTION';

export type ClaimVerificationStatus =
  | 'verified'
  | 'partially_verified'
  | 'unsupported'
  | 'contradictory'
  | 'uncertain';

export type ContentFormat =
  | 'linkedin_post'
  | 'x_post'
  | 'x_thread'
  | 'blog_article'
  | 'research_summary'
  | 'experiment_report'
  | 'tutorial'
  | 'project_idea';

export interface Persona {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  writingStyle: string;
  principles: string[];
  forbiddenBehaviors: string[];
  targetAudience: string;
  preferredTopics: string[];
  contentFormats: ContentFormat[];
}

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'github' | 'web' | 'paper' | 'social';
  url: string;
  active: boolean;
  lastFetchedAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  url: string;
  author?: string;
  publishedAt: string;
  rawEntities: string[];
  hash: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  documentCount: number;
  lastSeenAt: string;
}

export interface Trend {
  id: string;
  topicId: string;
  topicName: string;
  velocity: number; // 0 - 100
  frequency: number;
  novelty: number; // 0 - 100
  sourceDiversity: number; // 0 - 100
  importance: number; // 0 - 100
  audienceRelevance: number; // 0 - 100
  normalizedScore: number; // 0 - 100
  calculatedAt: string;
}

export interface InformationGap {
  id: string;
  trendId?: string;
  topic: string;
  description: string;
  gapType: 'unanswered_question' | 'poorly_explained' | 'missing_comparison' | 'under_researched_claim' | 'conflicting_opinions';
  existingCoverage: string;
  missingInsight: string;
  discoveredAt: string;
}

export interface OpportunityScoreBreakdown {
  trendScore: number;
  noveltyScore: number;
  informationGapScore: number;
  researchValue: number;
  experimentPotential: number;
  audienceValue: number;
  impactScore: number;
  repetitionPenalty: number;
  riskPenalty: number;
  finalScore: number; // 0 - 100
  actionRecommendation: 'ignore' | 'monitor' | 'research' | 'deep_research' | 'full_autonomous';
}

export interface Opportunity {
  id: string;
  gapId: string;
  title: string;
  description: string;
  type: 'research' | 'experiment' | 'tutorial' | 'open_source' | 'opinion';
  score: OpportunityScoreBreakdown;
  createdAt: string;
}

export interface ResearchTask {
  id: string;
  opportunityId: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  summary?: string;
  confidence?: number;
  createdAt: string;
  completedAt?: string;
}

export interface Claim {
  id: string;
  researchTaskId: string;
  statement: string;
  sourceUrl: string;
  sourceTitle: string;
  confidence: number;
  verificationStatus: ClaimVerificationStatus;
}

export interface Evidence {
  id: string;
  claimId: string;
  snippet: string;
  sourceUrl: string;
  supportLevel: 'supports' | 'refutes' | 'neutral';
}

export interface Contradiction {
  id: string;
  researchTaskId: string;
  claimA: string;
  claimB: string;
  sourceA: string;
  sourceB: string;
  explanation: string;
  confidence: number;
}

export interface Hypothesis {
  id: string;
  researchTaskId: string;
  statement: string;
  assumptions: string[];
  expectedOutcome: string;
  measurableVariables: { name: string; unit: string; expectedChange: string }[];
  experimentProposal: string;
  createdAt: string;
}

export interface ExperimentSpec {
  id: string;
  hypothesisId: string;
  title: string;
  description: string;
  language: 'javascript' | 'python';
  code: string;
  dependencies: string[];
  timeoutMs: number;
  memoryLimitMb: number;
}

export interface ExperimentRun {
  id: string;
  experimentId: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  startedAt: string;
  completedAt?: string;
}

export interface ExperimentResult {
  id: string;
  experimentRunId: string;
  hypothesisSupported: boolean;
  metrics: Record<string, number | string | boolean>;
  reproducibilityNotes: string;
  reportMarkdown: string;
}

export interface DebateResult {
  id: string;
  researchTaskId: string;
  researcherSummary: string;
  skepticCounterarguments: string[];
  factCheckerScore: number;
  judgeConclusion: string;
  confidenceScore: number; // 0 - 100
  unresolvedQuestions: string[];
  publishRecommendation: boolean;
  debatedAt: string;
}

export interface ContentDraft {
  id: string;
  researchTaskId: string;
  title: string;
  format: ContentFormat;
  personaId: string;
  body: string;
  citations: { title: string; url: string }[];
  version: number;
  createdAt: string;
}

export interface QualityGateScore {
  factualCorrectness: number; // 0 - 100
  citationValidity: number;
  originality: number;
  repetitionPenalty: number;
  personaConsistency: number;
  clarity: number;
  usefulness: number;
  safety: number;
  confidence: number;
  unsupportedClaimsCount: number;
  overallScore: number; // 0 - 100
  recommendation: 'reject' | 'revise' | 'approve' | 'high_confidence';
}

export interface ContentReview {
  id: string;
  contentId: string;
  score: QualityGateScore;
  feedback: string[];
  approved: boolean;
  reviewedAt: string;
}

export interface Publication {
  id: string;
  contentId: string;
  platform: 'linkedin' | 'x' | 'rss' | 'mock';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  externalId?: string;
  publishedUrl?: string;
  publishedAt?: string;
}

export interface EngagementMetrics {
  id: string;
  publicationId: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagementRate: number;
  feedbackSummary: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  topic: string;
  summary: string;
  type: 'investigation' | 'experiment' | 'claim' | 'rejection' | 'insight';
  vectorEmbedding?: number[];
  importance: number; // 0 - 100
  createdAt: string;
}

export interface KnowledgeEntity {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface KnowledgeRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: 'uses' | 'related_to' | 'has_risk' | 'compares_to' | 'improves';
  context: string;
}

export interface NextQuestion {
  id: string;
  question: string;
  expectedInfoGain: number;
  novelty: number;
  impact: number;
  feasibility: number;
  relevance: number;
  uncertainty: number;
  rankedScore: number;
  selected: boolean;
  generatedAt: string;
}

export interface SystemEvent {
  id: string;
  eventType: string;
  agentName?: string;
  workflowState?: WorkflowState;
  missionId?: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface AgentRunLog {
  id: string;
  agentName: string;
  taskId: string;
  inputSummary: string;
  outputSummary: string;
  model: string;
  latencyMs: number;
  tokenUsage?: { promptTokens: number; completionTokens: number };
  toolCalls: string[];
  status: 'success' | 'failed';
  error?: string;
  confidence?: number;
  costEstimate?: number;
  timestamp: string;
}

export interface AgentContext {
  missionId: string;
  autonomyLevel: AutonomyLevel;
  persona: Persona;
  demoMode: boolean;
}

export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: number;
  log: Omit<AgentRunLog, 'id' | 'timestamp'>;
}

export interface BaseAgent<TInput, TOutput> {
  id: string;
  name: string;
  role: string;
  execute(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>>;
}
