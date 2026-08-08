import { AbstractAgent } from './base.agent.js';
import { AgentContext, Document } from '../types/index.js';
import { db } from '../db/database.js';
import { LLMProvider, NewsProvider } from '../providers/llm.provider.js';

export interface ObserverInput {
  sourceId?: string;
  simulatedArticle?: { title: string; content: string; url: string };
}

export interface ObserverOutput {
  documentsIngested: Document[];
  newEntities: string[];
}

export class ObserverAgent extends AbstractAgent<ObserverInput, ObserverOutput> {
  id = 'agent-observer';
  name = 'Observer Agent';
  role = 'Ingests articles, extracts entities, normalizes text, removes duplicates';

  constructor(
    llm: LLMProvider,
    private newsProvider: NewsProvider
  ) {
    super(llm);
  }

  protected async runLogic(input: ObserverInput, context: AgentContext) {
    const rawArticles = input.simulatedArticle
      ? [input.simulatedArticle]
      : await this.newsProvider.fetchLatest();

    const documentsIngested: Document[] = [];
    const newEntities: string[] = [];

    for (const article of rawArticles) {
      const hash = `hash-${Buffer.from(article.title).toString('base64').slice(0, 12)}`;
      
      // Check duplicate
      const existing = Array.from(db.documents.values()).find((d: Document) => d.hash === hash);
      if (existing) continue;

      const llmRes = await this.llm.generate({
        userPrompt: `Extract key technical entities and normalize this document: Title: "${article.title}". Content: "${article.content || article.title}"`
      });

      let parsed = { entities: ['AI Agents', 'Memory Architecture'], summary: article.title };
      try {
        parsed = JSON.parse(llmRes.content);
      } catch (e) {
        // Fallback
      }

      const doc: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sourceId: input.sourceId || 'src-1',
        title: article.title,
        content: article.content || article.title,
        url: article.url || 'https://example.com/article',
        publishedAt: new Date().toISOString(),
        rawEntities: parsed.entities || [],
        hash,
        createdAt: new Date().toISOString()
      };

      db.documents.set(doc.id, doc);
      documentsIngested.push(doc);
      newEntities.push(...(parsed.entities || []));
    }

    return {
      data: { documentsIngested, newEntities },
      inputSummary: `Ingesting sources for mission ${context.missionId}`,
      outputSummary: `Ingested ${documentsIngested.length} unique documents. Extracted ${newEntities.length} entities.`,
      confidence: 0.96,
      toolCalls: ['newsProvider.fetchLatest', 'llm.extractEntities']
    };
  }
}
