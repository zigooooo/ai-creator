import { LLMProvider, LLMGenerateOptions, LLMResponse } from './llm.provider.js';
import { MockLLMProvider } from './mock.provider.js';

export class GeminiLLMProvider implements LLMProvider {
  public name = 'Gemini 1.5 Flash (Google AI 24/7 Engine)';
  private mockFallback = new MockLLMProvider();

  constructor(private apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async generate(options: LLMGenerateOptions): Promise<LLMResponse> {
    if (!this.apiKey || this.apiKey.startsWith('your_') || this.apiKey.trim() === '') {
      return this.mockFallback.generate(options);
    }

    const startTime = Date.now();
    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-8b'
    ];

    for (const modelName of candidateModels) {
      try {
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
          console.warn(`Gemini model ${modelName} HTTP ${response.status}. Trying next option...`);
          continue;
        }

        const data: any = await response.json();
        let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean json output markdown wrappers if present
        if (options.jsonOutput || textOutput.trim().startsWith('```')) {
          textOutput = textOutput.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
        }

        const latencyMs = Date.now() - startTime;

        return {
          content: textOutput,
          promptTokens: data.usageMetadata?.promptTokenCount || Math.floor(options.userPrompt.length / 4),
          completionTokens: data.usageMetadata?.candidatesTokenCount || Math.floor(textOutput.length / 4),
          latencyMs,
          model: `Google ${modelName}`
        };
      } catch (err: any) {
        console.warn(`Gemini model ${modelName} network error: ${err.message}`);
      }
    }

    console.warn('All Gemini free models unavailable or invalid API key. Falling back to Mock Engine.');
    return this.mockFallback.generate(options);
  }
}
