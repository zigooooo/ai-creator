import { autonomyLoop } from '../orchestrator/autonomy-loop.js';
import { db } from '../db/database.js';
import { DebateResult, NextQuestion } from '../types/index.js';

async function main() {
  console.log('===============================================================');
  console.log('🤖 AUTONOMOUS AI CREATOR — END-TO-END DEMO SCENARIO RUNNER');
  console.log('===============================================================');

  console.log('\n[1] Initiating 18-step Curiosity-Driven Autonomous Mission...');

  const startTime = Date.now();

  await autonomyLoop.runFullLoop({
    title: 'Benchmarking Persistent Recency-Vector Memory in Multi-Agent Trajectories',
    content: 'Autonomous agents operating across 50+ execution cycles suffer from contextual drift when relying solely on static top-k vector embeddings. We propose a hybrid recency-weighted similarity search.',
    url: 'https://arxiv.org/abs/2608.99999'
  });

  const durationMs = Date.now() - startTime;

  console.log(`\n✅ Mission Completed in ${durationMs}ms!`);
  console.log('---------------------------------------------------------------');
  console.log(`📊 Documents Ingested: ${db.documents.size}`);
  console.log(`🔥 Calculated Trends: ${db.trends.size}`);
  console.log(`🎯 Information Gaps Discovered: ${db.informationGaps.size}`);
  console.log(`🧪 Sandbox Experiments Executed: ${db.experimentRuns.size}`);
  console.log(`⚖️ Multi-Agent Debates Conducted: ${db.debateResults.size}`);
  console.log(`✍️ Persona Content Drafts Created: ${db.contentDrafts.size}`);
  console.log(`🔮 Curiosity Questions Generated: ${db.nextQuestions.size}`);
  console.log(`📜 Total Telemetry System Events: ${db.systemEvents.length}`);
  console.log('===============================================================');

  const latestDebate = Array.from(db.debateResults.values()).pop() as DebateResult | undefined;
  if (latestDebate) {
    console.log('\n[JUDGE VERDICT SUMMARY]');
    console.log(`Conclusion: ${latestDebate.judgeConclusion}`);
    console.log(`Confidence Score: ${latestDebate.confidenceScore}%`);
    console.log(`Publish Recommendation: ${latestDebate.publishRecommendation ? 'APPROVED' : 'HOLD'}`);
  }

  const latestQuestion = (Array.from(db.nextQuestions.values()) as NextQuestion[]).find(q => q.selected);
  if (latestQuestion) {
    console.log('\n[NEXT AUTONOMOUS MISSION QUESTION]');
    console.log(`Question: "${latestQuestion.question}" (Ranked Score: ${latestQuestion.rankedScore})`);
  }

  console.log('\nDemo complete! Start dev server with "npm run dev" to view in browser.');
}

main().catch(err => {
  console.error('Demo Error:', err);
  process.exit(1);
});
