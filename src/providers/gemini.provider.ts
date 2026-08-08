import { LLMProvider, LLMGenerateOptions, LLMResponse } from './llm.provider.js';
import { MockLLMProvider } from './mock.provider.js';

export class GeminiLLMProvider implements LLMProvider {
  public name = 'Gemini 1.5 Flash (Google AI 24/7 Engine)';
  private mockFallback = new MockLLMProvider();

  constructor(private apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async generate(options: LLMGenerateOptions): Promise<LLMResponse> {
    if (!this.apiKey) {
      return this.mockFallback.generate(options);
    }

    const startTime = Date.now();
    try {
      const modelName = 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: `${options.systemPrompt ? `[SYSTEM INSTRUCTIONS]\n${options.systemPrompt}\n\n` : ''}${options.userPrompt}`
            }
          ]
        }
      ];

      const bodyPayload: any = {
        contents,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 1024
        }
      };

      if (options.jsonOutput) {
        bodyPayload.generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        console.warn(`Gemini API HTTP ${response.status}. Falling back to Mock Engine.`);
        return this.mockFallback.generate(options);
      }

      const data: any = await response.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const latencyMs = Date.now() - startTime;

      return {
        content: textOutput,
        promptTokens: data.usageMetadata?.promptTokenCount || Math.floor(options.userPrompt.length / 4),
        completionTokens: data.usageMetadata?.candidatesTokenCount || Math.floor(textOutput.length / 4),
        latencyMs,
        model: `Google ${modelName}`
      };
    } catch (err: any) {
      console.warn('Gemini LLM Provider network error, falling back to simulator:', err.message);
      return this.mockFallback.generate(options);
    }
  }
}
