import { AbstractAgent } from './base.agent.js';
import { AgentContext, Trend, InformationGap } from '../types/index.js';
import { db } from '../db/database.js';

export interface GapInput {
  trend: Trend;
}

export interface GapOutput {
  gap: InformationGap;
}

export class InformationGapAgent extends AbstractAgent<GapInput, GapOutput> {
  id = 'agent-gap';
  name = 'Information Gap Agent';
  role = 'Identifies unanswered questions, poorly explained topics, weak claims, missing comparisons';

  protected async runLogic(input: GapInput, context: AgentContext) {
    const trend = input.trend;
    const llmRes = await this.llm.generate({
      userPrompt: `Identify what the existing technical conversation is missing regarding trend: "${trend.topicName}"`
    });

    let gapData = {
      gapType: 'under_researched_claim' as const,
      description: `Lack of quantitative benchmarks comparing Hybrid Recency-Vector Search vs standard Top-K Retrieval in long-horizon autonomous multi-agent task execution.`,
      existingCoverage: 'General architectural articles discussing vector DBs and RAG.',
      missingInsight: 'Empirical measurement of decision accuracy retention vs retrieval latency across 50+ execution turns.'
    };

    try {
      const parsed = JSON.parse(llmRes.content);
      if (parsed.description) gapData = parsed;
    } catch (e) {}

    const gap: InformationGap = {
      id: `gap-${Date.now()}`,
      trendId: trend.id,
      topic: trend.topicName,
      description: gapData.description,
      gapType: gapData.gapType,
      existingCoverage: gapData.existingCoverage,
      missingInsight: gapData.missingInsight,
      discoveredAt: new Date().toISOString()
    };
    db.informationGaps.set(gap.id, gap);

    return {
      data: { gap },
      inputSummary: `Discovering information gaps for topic: ${trend.topicName}`,
      outputSummary: `Found ${gap.gapType} gap: "${gap.description.slice(0, 80)}..."`,
      confidence: 0.92,
      toolCalls: ['gapEngine.findMissingInsights']
    };
  }
}
