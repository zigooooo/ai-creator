import { BaseAgent, AgentContext, AgentResult, AgentRunLog } from '../types/index.js';
import { LLMProvider, EmbeddingProvider } from '../providers/llm.provider.js';
import { db } from '../db/database.js';

export abstract class AbstractAgent<TInput, TOutput> implements BaseAgent<TInput, TOutput> {
  abstract id: string;
  abstract name: string;
  abstract role: string;

  constructor(
    protected llm: LLMProvider,
    protected embedding?: EmbeddingProvider
  ) {}

  protected abstract runLogic(input: TInput, context: AgentContext): Promise<{
    data: TOutput;
    inputSummary: string;
    outputSummary: string;
    confidence: number;
    toolCalls?: string[];
  }>;

  async execute(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    try {
      const result = await this.runLogic(input, context);
      const latencyMs = Date.now() - startTime;

      const log: Omit<AgentRunLog, 'id' | 'timestamp'> = {
        agentName: this.name,
        taskId: context.missionId,
        inputSummary: result.inputSummary,
        outputSummary: result.outputSummary,
        model: this.llm.name,
        latencyMs,
        toolCalls: result.toolCalls || [],
        status: 'success',
        confidence: result.confidence
      };

      db.agentRunLogs.push({
        ...log,
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: result.data,
        confidence: result.confidence,
        log
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const log: Omit<AgentRunLog, 'id' | 'timestamp'> = {
        agentName: this.name,
        taskId: context.missionId,
        inputSummary: 'Agent Execution Input',
        outputSummary: `Execution failed: ${err.message}`,
        model: this.llm.name,
        latencyMs,
        toolCalls: [],
        status: 'failed',
        error: err.message,
        confidence: 0
      };

      db.agentRunLogs.push({
        ...log,
        id: `log-err-${Date.now()}`,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: err.message,
        confidence: 0,
        log
      };
    }
  }
}
