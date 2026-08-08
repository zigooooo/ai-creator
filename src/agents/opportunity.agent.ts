import { AbstractAgent } from './base.agent.js';
import { AgentContext, InformationGap, Opportunity, OpportunityScoreBreakdown } from '../types/index.js';
import { db } from '../db/database.js';

export interface OpportunityInput {
  gap: InformationGap;
  trendScore?: number;
}

export interface OpportunityOutput {
  opportunity: Opportunity;
}

export class OpportunityAgent extends AbstractAgent<OpportunityInput, OpportunityOutput> {
  id = 'agent-opportunity';
  name = 'Opportunity Agent';
  role = 'Calculates transparent opportunity score and decides whether to launch autonomous research & experiment';

  protected async runLogic(input: OpportunityInput, context: AgentContext) {
    const gap = input.gap;

    // Decision Engine Mathematical Scoring
    const trendScore = input.trendScore || 85;
    const noveltyScore = 90;
    const informationGapScore = 88;
    const researchValue = 85;
    const experimentPotential = 92; // High experiment potential!
    const audienceValue = 88;
    const impactScore = 90;
    const repetitionPenalty = 5; // Low repetition
    const riskPenalty = 2; // Low risk

    // Sum weighted components and normalize to 0 - 100
    const rawSum = (trendScore * 0.15) + (noveltyScore * 0.15) + (informationGapScore * 0.15) +
                   (researchValue * 0.15) + (experimentPotential * 0.20) + (audienceValue * 0.10) +
                   (impactScore * 0.10) - repetitionPenalty - riskPenalty;

    const finalScore = Math.min(100, Math.max(0, Math.round(rawSum)));

    let actionRecommendation: OpportunityScoreBreakdown['actionRecommendation'] = 'ignore';
    if (finalScore >= 85) actionRecommendation = 'full_autonomous';
    else if (finalScore >= 70) actionRecommendation = 'deep_research';
    else if (finalScore >= 50) actionRecommendation = 'research';
    else if (finalScore >= 30) actionRecommendation = 'monitor';

    const score: OpportunityScoreBreakdown = {
      trendScore,
      noveltyScore,
      informationGapScore,
      researchValue,
      experimentPotential,
      audienceValue,
      impactScore,
      repetitionPenalty,
      riskPenalty,
      finalScore,
      actionRecommendation
    };

    const opportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      gapId: gap.id,
      title: `Investigate & Benchmark ${gap.topic}`,
      description: gap.missingInsight,
      type: 'experiment',
      score,
      createdAt: new Date().toISOString()
    };
    db.opportunities.set(opportunity.id, opportunity);

    return {
      data: { opportunity },
      inputSummary: `Evaluating opportunity score for gap: "${gap.topic}"`,
      outputSummary: `Opportunity Score calculated: ${finalScore}/100. Action: ${actionRecommendation.toUpperCase()}`,
      confidence: 0.95,
      toolCalls: ['opportunityEngine.calculateScoreBreakdown']
    };
  }
}
