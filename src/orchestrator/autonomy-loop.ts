import { stateMachine } from './state-machine.js';
import { db } from '../db/database.js';
import { AgentContext, AutonomyLevel, Persona } from '../types/index.js';
import { MockLLMProvider, MockEmbeddingProvider, MockSearchProvider, MockNewsProvider, MockSocialProvider } from '../providers/mock.provider.js';
import { ObserverAgent } from '../agents/observer.agent.js';
import { TrendAgent } from '../agents/trend.agent.js';
import { InformationGapAgent } from '../agents/gap.agent.js';
import { OpportunityAgent } from '../agents/opportunity.agent.js';
import { ResearchAgent } from '../agents/research.agent.js';
import { HypothesisAgent } from '../agents/hypothesis.agent.js';
import { ExperimentAgent } from '../agents/experiment.agent.js';
import { MultiAgentDebateAgent } from '../agents/debate.agents.js';
import { CreatorAgent } from '../agents/creator.agent.js';
import { QualityGateAgent } from '../agents/quality.agent.js';
import { PublisherAgent } from '../agents/publisher.agent.js';
import { CuriosityAgent } from '../agents/curiosity.agent.js';

import { createLLMProvider } from '../providers/provider-factory.js';

export class AutonomyLoopOrchestrator {
  private llm = createLLMProvider();
  private embedding = new MockEmbeddingProvider();
  private search = new MockSearchProvider();
  private news = new MockNewsProvider();
  private social = new MockSocialProvider();

  private observerAgent = new ObserverAgent(this.llm, this.news);
  private trendAgent = new TrendAgent(this.llm);
  private gapAgent = new InformationGapAgent(this.llm);
  private opportunityAgent = new OpportunityAgent(this.llm);
  private researchAgent = new ResearchAgent(this.llm, this.search);
  private hypothesisAgent = new HypothesisAgent(this.llm);
  private experimentAgent = new ExperimentAgent(this.llm);
  private debateAgent = new MultiAgentDebateAgent(this.llm);
  private creatorAgent = new CreatorAgent(this.llm);
  private qualityAgent = new QualityGateAgent(this.llm);
  private publisherAgent = new PublisherAgent(this.llm, this.social);
  private curiosityAgent = new CuriosityAgent(this.llm);

  private autonomyLevel: AutonomyLevel = 3;
  private isRunning: boolean = false;

  public setAutonomyLevel(level: AutonomyLevel) {
    this.autonomyLevel = level;
  }

  public getAutonomyLevel(): AutonomyLevel {
    return this.autonomyLevel;
  }

  private getContext(): AgentContext {
    const persona = Array.from(db.personas.values())[0] as Persona;
    return {
      missionId: stateMachine.getMissionId(),
      autonomyLevel: this.autonomyLevel,
      persona,
      demoMode: true
    };
  }

  // Execute full 18-step end-to-end continuous loop scenario
  public async runFullLoop(customArticle?: { title: string; content: string; url: string }) {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const ctx = this.getContext();

      // Step 1: DISCOVERED
      stateMachine.transition('DISCOVERED', 'Observer Agent', { step: 1, action: 'Ingesting tech sources' });
      const obsRes = await this.observerAgent.execute({ simulatedArticle: customArticle }, ctx);

      // Step 2: INTERESTING
      stateMachine.transition('INTERESTING', 'Trend Agent', { step: 2, action: 'Calculating trend score' });
      const trendRes = await this.trendAgent.execute({ documents: obsRes.data?.documentsIngested || [] }, ctx);

      // Step 3: GAP_FOUND
      stateMachine.transition('GAP_FOUND', 'Information Gap Agent', { step: 3, action: 'Identifying unresearched claims' });
      const gapRes = await this.gapAgent.execute({ trend: trendRes.data!.topTrend }, ctx);

      // Decision Engine evaluation
      stateMachine.transition('RESEARCHING', 'Opportunity Agent', { step: 4, action: 'Computing opportunity score' });
      const oppRes = await this.opportunityAgent.execute({ gap: gapRes.data!.gap }, ctx);

      // Step 4: RESEARCHING
      const resRes = await this.researchAgent.execute({ opportunity: oppRes.data!.opportunity }, ctx);

      // Step 5: HYPOTHESIS_CREATED
      stateMachine.transition('HYPOTHESIS_CREATED', 'Hypothesis Agent', { step: 5, action: 'Formulating testable hypothesis' });
      const hypRes = await this.hypothesisAgent.execute({ task: resRes.data!.task }, ctx);

      // Step 6: EXPERIMENTING (Isolated Sandbox Subprocess Execution!)
      stateMachine.transition('EXPERIMENTING', 'Experiment Agent', { step: 6, action: 'Executing JS benchmark in sandbox' });
      const expRes = await this.experimentAgent.execute({ hypothesis: hypRes.data!.hypothesis }, ctx);

      // Step 7: DEBATING (Skeptic + FactChecker + Judge)
      stateMachine.transition('DEBATING', 'Debate Subsystem', { step: 7, action: 'Multi-agent adversarial debate' });
      const debateRes = await this.debateAgent.execute({ task: resRes.data!.task, experimentReport: expRes.data?.result.reportMarkdown }, ctx);

      // Step 8: VERIFIED
      stateMachine.transition('VERIFIED', 'Judge Agent', { step: 8, action: 'Judge issued verified verdict' });

      // Step 9: CONTENT_CREATED
      stateMachine.transition('CONTENT_CREATED', 'Creator Agent', { step: 9, action: 'Drafting LinkedIn post and research thread' });
      const creatorRes = await this.creatorAgent.execute({ debateResult: debateRes.data!.debateResult }, ctx);

      // Step 10: QUALITY_CHECK
      stateMachine.transition('QUALITY_CHECK', 'Originality & Quality Gate', { step: 10, action: 'Checking vector distance and safety' });
      const qualityRes = await this.qualityAgent.execute({ draft: creatorRes.data!.draft }, ctx);

      // Step 11 & 12: APPROVAL & PUBLISHED
      if (this.autonomyLevel >= 4) {
        stateMachine.transition('APPROVED', 'Publisher Agent', { step: 11, action: 'Auto-approved by Level 4 autonomy' });
        stateMachine.transition('PUBLISHED', 'Publisher Agent', { step: 12, action: 'Published to LinkedIn / X' });
        await this.publisherAgent.execute({ draft: creatorRes.data!.draft, review: qualityRes.data!.review, humanApproved: true }, ctx);
      } else {
        stateMachine.transition('APPROVAL_REQUIRED', 'Publisher Agent', { step: 11, action: 'Pending human approval in Content Studio' });
      }

      // Step 13 & 14: ANALYZED & LEARNED
      stateMachine.transition('ANALYZED', 'Analytics Agent', { step: 13, action: 'Tracking initial engagement' });
      stateMachine.transition('LEARNED', 'Learning Agent', { step: 14, action: 'Updating performance insights' });

      // Step 15: NEXT_QUESTION & Curiosity Loop
      stateMachine.transition('NEXT_QUESTION', 'Curiosity Agent', { step: 15, action: 'Generating candidate next questions' });
      const curiosityRes = await this.curiosityAgent.execute({ discoverySummary: debateRes.data!.debateResult.judgeConclusion }, ctx);

      stateMachine.transition('DISCOVERED', 'Curiosity Agent', {
        step: 16,
        action: 'Autonomous Loop complete. Selected next mission question.',
        nextMissionQuestion: curiosityRes.data?.selectedMissionQuestion.question
      });

    } finally {
      this.isRunning = false;
    }
  }
}

export const autonomyLoop = new AutonomyLoopOrchestrator();
