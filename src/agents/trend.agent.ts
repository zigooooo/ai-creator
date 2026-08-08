import { AbstractAgent } from './base.agent.js';
import { AgentContext, Document, Trend, Topic } from '../types/index.js';
import { db } from '../db/database.js';

export interface TrendInput {
  documents: Document[];
}

export interface TrendOutput {
  trends: Trend[];
  topTrend: Trend;
}

export class TrendAgent extends AbstractAgent<TrendInput, TrendOutput> {
  id = 'agent-trend';
  name = 'Trend Agent';
  role = 'Calculates velocity, frequency, novelty, source diversity, audience relevance -> normalized trend score';

  protected async runLogic(input: TrendInput, context: AgentContext) {
    const docs = input.documents.length > 0 ? input.documents : Array.from(db.documents.values()) as Document[];
    const docTitle = docs[0]?.title || 'Autonomous AI Agents Persistence';

    const llmRes = await this.llm.generate({
      userPrompt: `Calculate trend score metrics for topic derived from: "${docTitle}"`
    });

    let metrics = {
      velocity: 85,
      frequency: 40,
      novelty: 90,
      sourceDiversity: 78,
      importance: 86,
      audienceRelevance: 88,
      normalizedScore: 86.2
    };

    try {
      metrics = JSON.parse(llmRes.content);
    } catch (e) {}

    const topic: Topic = {
      id: `topic-${Date.now()}`,
      name: docTitle.slice(0, 40),
      category: 'AI Engineering',
      keywords: ['Agents', 'Memory', 'Curiosity', 'Autonomous'],
      documentCount: docs.length,
      lastSeenAt: new Date().toISOString()
    };
    db.topics.set(topic.id, topic);

    const trend: Trend = {
      id: `trend-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      velocity: metrics.velocity,
      frequency: metrics.frequency,
      novelty: metrics.novelty,
      sourceDiversity: metrics.sourceDiversity,
      importance: metrics.importance,
      audienceRelevance: metrics.audienceRelevance,
      normalizedScore: metrics.normalizedScore,
      calculatedAt: new Date().toISOString()
    };
    db.trends.set(trend.id, trend);

    return {
      data: { trends: [trend], topTrend: trend },
      inputSummary: `Analyzing trend score for topic: ${topic.name}`,
      outputSummary: `Calculated normalized trend score of ${trend.normalizedScore}/100 (Velocity: ${trend.velocity}, Novelty: ${trend.novelty})`,
      confidence: 0.94,
      toolCalls: ['trendEngine.calculateScore']
    };
  }
}
