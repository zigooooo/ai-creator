import { LLMProvider } from './llm.provider.js';
import { GeminiLLMProvider } from './gemini.provider.js';
import { MockLLMProvider } from './mock.provider.js';

export function createLLMProvider(): LLMProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiLLMProvider(process.env.GEMINI_API_KEY);
  }
  return new MockLLMProvider();
}
