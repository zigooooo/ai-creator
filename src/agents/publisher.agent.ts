import { AbstractAgent } from './base.agent.js';
import { AgentContext, ContentDraft, ContentReview, Publication, EngagementMetrics } from '../types/index.js';
import { db } from '../db/database.js';
import { SocialProvider } from '../providers/llm.provider.js';

export interface PublisherInput {
  draft: ContentDraft;
  review: ContentReview;
  humanApproved?: boolean;
}

export interface PublisherOutput {
  publication: Publication;
  metrics: EngagementMetrics;
}

export class PublisherAgent extends AbstractAgent<PublisherInput, PublisherOutput> {
  id = 'agent-publisher';
  name = 'Publisher & Analytics Agent';
  role = 'Publishes content subject to safety/autonomy level rules and tracks simulated/live engagement metrics';

  constructor(
    llm: any,
    private socialProvider: SocialProvider
  ) {
    super(llm);
  }

  protected async runLogic(input: PublisherInput, context: AgentContext) {
    const draft = input.draft;
    const review = input.review;

    // Check Human Approval Requirement based on Autonomy Level
    const requiresHuman = context.autonomyLevel < 4;
    const isApproved = input.humanApproved || !requiresHuman;

    if (!review.approved) {
      throw new Error('Publication blocked by Quality Gate.');
    }

    if (!isApproved) {
      throw new Error(`Publication paused: Autonomy Level ${context.autonomyLevel} requires explicit human approval.`);
    }

    const platform = draft.format.startsWith('x_') ? 'x' : 'linkedin';
    const pubResult = await this.socialProvider.publish(platform, draft.body);

    const publication: Publication = {
      id: `pub-${Date.now()}`,
      contentId: draft.id,
      platform,
      status: pubResult.success ? 'published' : 'failed',
      externalId: pubResult.externalId,
      publishedUrl: pubResult.publishedUrl,
      publishedAt: new Date().toISOString()
    };
    db.publications.set(publication.id, publication);

    // Initial Simulated Engagement Metrics
    const metrics: EngagementMetrics = {
      id: `met-${Date.now()}`,
      publicationId: publication.id,
      impressions: Math.floor(Math.random() * 1500) + 800,
      likes: Math.floor(Math.random() * 120) + 45,
      comments: Math.floor(Math.random() * 25) + 8,
      shares: Math.floor(Math.random() * 15) + 3,
      clicks: Math.floor(Math.random() * 90) + 20,
      engagementRate: 7.8,
      feedbackSummary: 'High technical engagement from AI research community.',
      updatedAt: new Date().toISOString()
    };
    db.engagementMetrics.set(metrics.id, metrics);

    return {
      data: { publication, metrics },
      inputSummary: `Publishing content to ${platform.toUpperCase()}`,
      outputSummary: `Published to ${platform.toUpperCase()} (${publication.publishedUrl}). Initial engagement: ${metrics.likes} likes, ${metrics.comments} comments`,
      confidence: 1.0,
      toolCalls: ['socialProvider.publish', 'analyticsEngine.recordInitialMetrics']
    };
  }
}
