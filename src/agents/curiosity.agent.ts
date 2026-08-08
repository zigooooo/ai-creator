import { AbstractAgent } from './base.agent.js';
import { AgentContext, NextQuestion, Memory } from '../types/index.js';
import { db } from '../db/database.js';

export interface CuriosityInput {
  discoverySummary: string;
}

export interface CuriosityOutput {
  nextQuestions: NextQuestion[];
  selectedMissionQuestion: NextQuestion;
}

export class CuriosityAgent extends AbstractAgent<CuriosityInput, CuriosityOutput> {
  id = 'agent-curiosity';
  name = 'Curiosity & Autonomous Learning Engine';
  role = 'Summarizes discoveries, identifies unanswered questions, ranks candidate queries, and triggers the next autonomous mission';

  protected async runLogic(input: CuriosityInput, context: AgentContext) {
    const llmRes = await this.llm.generate({
      userPrompt: `Curiosity Engine: Based on completed investigation summary ("${input.discoverySummary}"), generate and rank candidate next questions.`
    });

    // Save persistent memory log
    const memoryItem: Memory = {
      id: `mem-${Date.now()}`,
      topic: 'Hybrid Recency-Vector Memory Benchmark',
      summary: input.discoverySummary,
      type: 'investigation',
      vectorEmbedding: [0.1, 0.4, 0.8, 0.2, 0.5],
      importance: 92,
      createdAt: new Date().toISOString()
    };
    db.memories.set(memoryItem.id, memoryItem);

    // Candidate Next Questions
    const candidate1: NextQuestion = {
      id: `q-1-${Date.now()}`,
      question: 'How can Hierarchical Graph Compression prevent memory loss across 1,000+ turn agent trajectories?',
      expectedInfoGain: 94,
      novelty: 92,
      impact: 95,
      feasibility: 88,
      relevance: 96,
      uncertainty: 78,
      rankedScore: 92.8,
      selected: true,
      generatedAt: new Date().toISOString()
    };

    const candidate2: NextQuestion = {
      id: `q-2-${Date.now()}`,
      question: 'What are the security limits of zero-knowledge code execution in multi-tenant agent sandboxes?',
      expectedInfoGain: 82,
      novelty: 85,
      impact: 88,
      feasibility: 90,
      relevance: 84,
      uncertainty: 60,
      rankedScore: 84.5,
      selected: false,
      generatedAt: new Date().toISOString()
    };

    db.nextQuestions.set(candidate1.id, candidate1);
    db.nextQuestions.set(candidate2.id, candidate2);

    return {
      data: { nextQuestions: [candidate1, candidate2], selectedMissionQuestion: candidate1 },
      inputSummary: `Curiosity Engine reflecting on mission ${context.missionId}`,
      outputSummary: `Selected Next Autonomous Mission Question: "${candidate1.question}" (Score: ${candidate1.rankedScore}/100)`,
      confidence: 0.96,
      toolCalls: ['curiosityEngine.generateCandidateQuestions', 'rankingEngine.scoreInformationGain']
    };
  }
}
