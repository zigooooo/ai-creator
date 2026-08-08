export interface LLMGenerateOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonOutput?: boolean;
}

export interface LLMResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  model: string;
}

export interface LLMProvider {
  name: string;
  generate(options: LLMGenerateOptions): Promise<LLMResponse>;
}

export interface EmbeddingProvider {
  name: string;
  embedText(text: string): Promise<number[]>;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface SearchProvider {
  name: string;
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

export interface NewsArticle {
  title: string;
  url: string;
  summary: string;
  content?: string;
  source: string;
  publishedAt: string;
}

export interface NewsProvider {
  name: string;
  fetchLatest(category?: string): Promise<NewsArticle[]>;
}

export interface GitHubRepository {
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
}

export interface GitHubProvider {
  name: string;
  searchRepositories(query: string): Promise<GitHubRepository[]>;
}

export interface SocialPublishResult {
  success: boolean;
  platform: string;
  externalId: string;
  publishedUrl: string;
}

export interface SocialProvider {
  name: string;
  publish(platform: 'linkedin' | 'x', content: string): Promise<SocialPublishResult>;
}
