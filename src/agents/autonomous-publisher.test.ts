import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeAutonomousAgent, getAgentFeed, discoverTopicsFromSources } from './autonomous-publisher.service.js';

test('initialization creates an agent and returns a feed', async () => {
  const init = await initializeAutonomousAgent({ persona: { name: 'Ada', domain: 'AI Security' } });
  assert.ok(init.agentId);

  const feed = await getAgentFeed(init.agentId, new Date('2026-08-08T10:00:00.000Z'));
  assert.ok(feed.posts.length >= 1);
  assert.equal(feed.posts[0].sources.length > 0, true);
  assert.ok(feed.posts[0].rationale.includes('relevant now'));
});

test('feed remains available and sorted newest first', async () => {
  const init = await initializeAutonomousAgent({ persona: { name: 'Ada', domain: 'AI Security' } });
  const first = await getAgentFeed(init.agentId, new Date('2026-08-08T10:00:00.000Z'));
  const second = await getAgentFeed(init.agentId, new Date('2026-08-08T10:01:00.000Z'));

  assert.ok(first.posts.length >= 1);
  assert.ok(second.posts.length >= first.posts.length);
  assert.equal(second.posts[0].id !== first.posts[0].id || second.posts[0].createdAt >= first.posts[0].createdAt, true);
});

test('discoverTopicsFromSources extracts live topic candidates from RSS-like content', async () => {
  const discovered = await discoverTopicsFromSources([
    {
      name: 'Example AI News',
      url: 'https://example.com/feed',
      content: `<rss><channel><item><title>Open-source agents now ship with stronger sandboxing</title><link>https://example.com/1</link></item><item><title>Model evals reveal surprising drift in long-horizon planning</title><link>https://example.com/2</link></item></channel></rss>`
    }
  ]);

  assert.ok(discovered.some(item => item.topic.includes('sandboxing')));
  assert.ok(discovered.some(item => item.topic.includes('evals')));
});
