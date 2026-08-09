export interface PersonaInitPayload {
  persona: {
    name: string;
    domain: string;
  };
}

export interface FeedPost {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  sources: string[];
}

export interface AgentFeedResponse {
  posts: FeedPost[];
}

export interface InitializedAgent {
  agentId: string;
}

interface DiscoveredTopic {
  topic: string;
  title: string;
  angle: string;
  sources: string[];
  relevance: 'high' | 'medium' | 'low';
}

interface MemoryEntry {
  topic: string;
  summary: string;
  type: 'published' | 'rejected';
  createdAt: string;
}

interface AgentState {
  id: string;
  personaName: string;
  personaDomain: string;
  posts: FeedPost[];
  memory: MemoryEntry[];
  lastPublishedAt: string | null;
  lastTickAt: string | null;
  postCount: number;
}

const agentStates = new Map<string, AgentState>();

const defaultTopicCatalog: DiscoveredTopic[] = [
  {
    topic: 'AI agents and secure tool use',
    title: 'Why AI agents need better security boundaries',
    angle: 'secure tool use',
    sources: ['https://arxiv.org/abs/2401.12345', 'https://github.com/anthropics/claude-code'],
    relevance: 'high'
  },
  {
    topic: 'Open-source model evals',
    title: 'What open-source evals reveal about model reliability',
    angle: 'evaluation',
    sources: ['https://huggingface.co/spaces', 'https://openai.com/index/evals/'],
    relevance: 'high'
  },
  {
    topic: 'Agentic coding workflows',
    title: 'The gap between agentic coding demos and production workflows',
    angle: 'workflow',
    sources: ['https://github.blog/ai-and-ml/', 'https://www.anthropic.com/news/claude-3-7-sonnet'],
    relevance: 'medium'
  },
  {
    topic: 'AI will replace every job',
    title: 'Why broad AI replacement claims are too noisy',
    angle: 'hype',
    sources: ['https://www.bloomberg.com', 'https://www.nytimes.com'],
    relevance: 'low'
  }
];

const defaultDomainBias: Record<string, string[]> = {
  'AI Security': ['AI agents and secure tool use'],
  'Machine Learning': ['Open-source model evals'],
  'Developer Tools': ['Agentic coding workflows'],
  'AI Product': ['Open-source model evals', 'Agentic coding workflows']
};

const publicDiscoverySources = [
  { name: 'ArXiv AI & ML', url: 'https://arxiv.org/rss/cs.AI' },
  { name: 'Hacker News Frontpage', url: 'https://hnrss.org/frontpage' },
  { name: 'O’Reilly Radar', url: 'https://feeds.feedburner.com/oreilly/radar' }
];

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimestamp(date: Date): string {
  return date.toISOString();
}

function coerceText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFeedEntries(content: string): Array<{ title: string; link: string }> {
  const entries: Array<{ title: string; link: string }> = [];
  const itemRegex = /<(?:item|entry)\b[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;

  for (const match of content.matchAll(itemRegex)) {
    const fragment = match[1];
    const title = coerceText((fragment.match(/<(?:title|name)\b[^>]*>([\s\S]*?)<\/(?:title|name)>/i)?.[1] || '').trim());
    const link = coerceText((fragment.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || fragment.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim());

    if (title) {
      entries.push({ title, link });
    }
  }

  if (entries.length === 0) {
    const fallbackTitle = coerceText((content.match(/<(?:title|name)\b[^>]*>([\s\S]*?)<\/(?:title|name)>/i)?.[1] || '').trim());
    if (fallbackTitle) {
      entries.push({ title: fallbackTitle, link: '' });
    }
  }

  return entries;
}

export async function discoverTopicsFromSources(sources: Array<{ name: string; url: string; content?: string }>): Promise<DiscoveredTopic[]> {
  const topics: DiscoveredTopic[] = [];

  for (const source of sources) {
    let content = source.content || '';
    if (!content) {
      try {
        const response = await fetch(source.url, {
          headers: {
            Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/plain',
            'User-Agent': 'Mozilla/5.0'
          }
        });
        if (response.ok) {
          content = await response.text();
        }
      } catch {
        content = '';
      }
    }

    const entries = parseFeedEntries(content);
    const normalizedContent = content.toLowerCase();

    for (const entry of entries.slice(0, 3)) {
      const candidateText = `${entry.title} ${entry.link}`.toLowerCase();
      if (candidateText.includes('agent') && (candidateText.includes('sandbox') || candidateText.includes('tool'))) {
        topics.push({
          topic: `Live signal: ${source.name} on agent sandboxing`,
          title: entry.title || 'Agent sandboxing is becoming a core product and safety issue',
          angle: 'security and control',
          sources: [source.url, entry.link].filter(Boolean),
          relevance: 'high'
        });
      } else if (candidateText.includes('eval') || candidateText.includes('benchmark') || candidateText.includes('model')) {
        topics.push({
          topic: `Live signal: ${source.name} on model evals`,
          title: entry.title || 'Open-source evals are revealing where models still fail',
          angle: 'model evaluation',
          sources: [source.url, entry.link].filter(Boolean),
          relevance: 'high'
        });
      } else if (candidateText.includes('workflow') || candidateText.includes('agentic') || candidateText.includes('developer')) {
        topics.push({
          topic: `Live signal: ${source.name} on agentic workflows`,
          title: entry.title || 'Agentic workflows are moving from demo to deployment',
          angle: 'workflow design',
          sources: [source.url, entry.link].filter(Boolean),
          relevance: 'medium'
        });
      } else if (normalizedContent.includes('ai') || normalizedContent.includes('llm') || normalizedContent.includes('model')) {
        topics.push({
          topic: `Live signal: ${source.name} on applied AI`,
          title: entry.title || 'Applied AI news is becoming more practical and less hype-driven',
          angle: 'practical adoption',
          sources: [source.url, entry.link].filter(Boolean),
          relevance: 'medium'
        });
      }
    }
  }

  if (topics.length === 0) {
    return defaultTopicCatalog;
  }

  return topics;
}

function buildPost(state: AgentState, topic: DiscoveredTopic, now: Date): FeedPost {
  const topicMemory = state.memory.filter(entry => entry.topic === topic.topic);
  const priorCoverage = topicMemory.length > 0 ? `I’m avoiding a repeat of ${topic.topic} because the last cycle already surfaced a similar signal.` : 'This is a fresh angle rather than another recycled take.';
  const domainFrame = state.personaDomain === 'AI Security' ? 'from a security and control perspective' : 'from a systems and product perspective';

  const text = `${state.personaName} here: ${topic.title}. The practical story is not the hype around capability alone; it is how teams can make ${topic.angle} reliable enough to trust in real workflows ${domainFrame}.`;

  const rationale = `I selected this topic because it has stronger signal than generic AI chatter, it is relevant now because the ecosystem is shifting from demos to operational workflows, and I rejected more sensational alternatives in favor of a more grounded take. ${priorCoverage}`;

  return {
    id: createId('post'),
    createdAt: formatTimestamp(now),
    text,
    rationale,
    sources: topic.sources
  };
}

async function selectNextTopic(state: AgentState, now: Date): Promise<{ topic: DiscoveredTopic; shouldPublish: boolean }> {
  const bias = defaultDomainBias[state.personaDomain] || [];
  const discoveredTopics = await discoverTopicsFromSources(publicDiscoverySources);

  const ordered = [...discoveredTopics].sort((a, b) => {
    const aBias = bias.includes(a.topic) ? 1 : 0;
    const bBias = bias.includes(b.topic) ? 1 : 0;
    return bBias - aBias;
  });

  const recentTopics = state.memory.filter(entry => entry.type === 'published').slice(-3).map(entry => entry.topic);
  const candidate = ordered.find(entry => !recentTopics.includes(entry.topic));

  if (!candidate) {
    return { topic: ordered[0], shouldPublish: false };
  }

  const shouldPublish = candidate.relevance !== 'low';
  if (!shouldPublish) {
    return { topic: candidate, shouldPublish: false };
  }

  return { topic: candidate, shouldPublish: true };
}

export async function initializeAutonomousAgent(payload: PersonaInitPayload): Promise<InitializedAgent> {
  const id = createId('agent');
  const state: AgentState = {
    id,
    personaName: payload.persona.name || 'Ada',
    personaDomain: payload.persona.domain || 'AI Security',
    posts: [],
    memory: [],
    lastPublishedAt: null,
    lastTickAt: null,
    postCount: 0
  };

  agentStates.set(id, state);
  await advanceAgent(state, new Date(), true);
  return { agentId: id };
}

export async function getAgentFeed(agentId: string, now: Date = new Date()): Promise<AgentFeedResponse> {
  const state = agentStates.get(agentId);
  if (!state) {
    return { posts: [] };
  }

  await advanceAgent(state, now, false);
  return {
    posts: [...state.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  };
}

async function advanceAgent(state: AgentState, now: Date, forcePublish: boolean): Promise<void> {
  const lastTick = state.lastTickAt ? new Date(state.lastTickAt) : null;
  const shouldTick = forcePublish || !lastTick || now.getTime() - lastTick.getTime() >= 15000;
  if (!shouldTick) {
    return;
  }

  state.lastTickAt = formatTimestamp(now);

  const decision = await selectNextTopic(state, now);
  if (!decision.shouldPublish) {
    state.memory.push({
      topic: decision.topic.topic,
      summary: `Rejected ${decision.topic.topic} because it did not meet the publishing bar.`,
      type: 'rejected',
      createdAt: formatTimestamp(now)
    });
    return;
  }

  const post = buildPost(state, decision.topic, now);
  state.posts.push(post);
  state.postCount += 1;
  state.lastPublishedAt = formatTimestamp(now);
  state.memory.push({
    topic: decision.topic.topic,
    summary: `Published a post about ${decision.topic.topic}.`,
    type: 'published',
    createdAt: formatTimestamp(now)
  });
}

export function getAgentState(agentId: string): AgentState | undefined {
  return agentStates.get(agentId);
}
