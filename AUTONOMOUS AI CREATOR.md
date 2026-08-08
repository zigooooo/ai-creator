# AUTONOMOUS AI CREATOR
## Master Engineering Specification

You are the lead software architect and senior full-stack engineer responsible for building a production-quality hackathon project called:

**Autonomous AI Creator — From Prompt-Driven AI to Curiosity-Driven AI**

## 1. PRODUCT VISION

Build an autonomous AI research and creation platform.

The system must NOT behave like a simple chatbot or AI social-media post generator.

Its primary objective is:

> Observe → Discover → Identify Information Gaps → Research → Form Hypotheses → Experiment → Debate → Verify → Create → Publish → Measure → Learn → Generate the Next Question

The system should continuously determine:

> "What is worth investigating next?"

The AI should not require a human prompt for every content-generation cycle.

Humans should primarily configure the persona, goals, sources, permissions, safety rules, and autonomy level.

---

# 2. CORE PRINCIPLES

1. Autonomous decision making
2. Explicit agent workflows
3. Persistent memory
4. Evidence-based research
5. Self-criticism
6. Experimentation
7. Long-term learning
8. Information-gap discovery
9. Original content generation
10. Human oversight for risky external actions
11. Full observability
12. Reproducibility
13. Safe execution of generated code
14. Provider-independent AI architecture

Do not build a monolithic AI agent.

Use specialized agents coordinated by an orchestration layer.

---

# 3. REQUIRED AGENTS

Implement the following agents as independent services/modules with clear interfaces.

## Observer Agent

Responsibilities:

- ingest information from configured sources
- identify new documents
- detect emerging topics
- normalize information
- remove duplicates
- extract entities
- identify significant changes

## Trend Agent

Calculate:

- trend velocity
- frequency
- novelty
- source diversity
- importance
- audience relevance

Produce a normalized trend score.

## Information Gap Agent

Find:

- unanswered questions
- poorly explained topics
- missing comparisons
- under-researched claims
- conflicting opinions
- emerging topics with insufficient analysis

The goal is NOT simply to find popular topics.

The agent must identify what the existing conversation is missing.

## Opportunity Agent

Identify opportunities for:

- research
- experiments
- educational content
- open-source projects
- technical tutorials
- product ideas
- community discussions

## Research Agent

Responsibilities:

- formulate research queries
- gather sources
- summarize evidence
- extract claims
- compare sources
- track citations
- identify uncertainty
- produce research reports

Never present unsupported claims as facts.

## Contradiction Hunter

Find contradictory claims across sources.

For each contradiction store:

- claim A
- claim B
- sources
- evidence
- context
- possible explanation
- confidence

## Hypothesis Agent

Convert information gaps into testable hypotheses.

Example:

"Persistent memory improves long-task agent performance."

The hypothesis must contain:

- hypothesis
- assumptions
- expected outcome
- measurable variables
- experiment proposal

## Experiment Agent

Responsibilities:

- design experiments
- generate experiment code
- execute experiments in a secure sandbox
- collect results
- compare results
- generate reproducible experiment reports

NEVER execute untrusted generated code directly on the production server.

Use an isolated execution environment.

## Skeptic Agent

Try to disprove the researcher's conclusion.

Ask:

- What could make this conclusion wrong?
- Is the evidence sufficient?
- Are sources biased?
- Are there alternative explanations?
- Is the experiment valid?
- Are the results reproducible?

## Fact Checker

Verify important claims against available evidence.

Assign:

- verified
- partially verified
- unsupported
- contradictory
- uncertain

## Judge Agent

Evaluate the combined work of:

- researcher
- experimenter
- skeptic
- fact checker

Produce:

- final conclusion
- confidence score
- unresolved issues
- publish recommendation

## Creator Agent

Generate content from verified research.

Supported output types:

- LinkedIn post
- X post
- technical thread
- blog article
- research summary
- experiment report
- tutorial
- project idea

The creator must maintain a configurable AI persona.

## Originality Agent

Compare new content with:

- previous content
- stored ideas
- known source material

Detect repetition and low novelty.

## Publisher Agent

Publish content only when:

- quality threshold passes
- safety checks pass
- required human approval is received
- platform permissions allow publication

Implement dry-run mode.

## Analytics Agent

Collect available metrics such as:

- impressions
- likes
- comments
- shares
- clicks
- engagement rate

## Learning Agent

Analyze historical performance.

Determine:

- what topics performed well
- what formats performed well
- which ideas repeatedly failed
- which sources produce valuable discoveries
- which content styles perform best

The learning system must influence future topic and content selection.

## Curiosity Agent

After each completed investigation:

1. summarize the discovery
2. identify unanswered questions
3. generate candidate next questions
4. rank them
5. select the highest-value next investigation

This creates the autonomous research loop.

---

# 4. AUTONOMY LOOP

Implement this state machine:

DISCOVERED
→ INTERESTING
→ GAP_FOUND
→ RESEARCHING
→ HYPOTHESIS_CREATED
→ EXPERIMENTING
→ DEBATING
→ VERIFIED
→ CONTENT_CREATED
→ QUALITY_CHECK
→ APPROVAL_REQUIRED
→ APPROVED
→ PUBLISHED
→ ANALYZED
→ LEARNED
→ NEXT_QUESTION
→ DISCOVERED

Every transition must be persisted.

Every agent action must generate an event.

---

# 5. DECISION ENGINE

Implement a transparent opportunity score.

Use:

Opportunity Score =

Trend Score
+ Novelty Score
+ Information Gap Score
+ Research Value
+ Experiment Potential
+ Audience Value
+ Impact Score
- Repetition Penalty
- Risk Penalty

Normalize to 0–100.

Default behavior:

0–30:
ignore

30–50:
monitor

50–70:
research

70–85:
deep research

85–100:
research + experiment + content creation

Make all weights configurable.

Do not hide the decision completely inside an LLM.

---

# 6. MEMORY SYSTEM

Implement persistent memory.

Store:

- previous investigations
- topics
- ideas
- rejected ideas
- published content
- experiments
- results
- claims
- evidence
- sources
- user feedback
- engagement metrics
- agent decisions
- unanswered questions

Use PostgreSQL.

Use pgvector for semantic memory.

Implement retrieval by:

- semantic similarity
- recency
- importance
- topic
- entity
- investigation

---

# 7. KNOWLEDGE GRAPH

Create entities and relationships.

Example:

AI Agents
→ uses → Tool Calling
→ uses → Memory
→ related_to → RAG
→ has_risk → Prompt Injection

Store:

- entities
- relationships
- claims
- evidence
- experiments
- discoveries

The system should be able to answer:

"What do we already know about this topic?"

before starting new research.

---

# 8. DATABASE

Use PostgreSQL.

Create tables/models for:

users
personas
sources
documents
topics
trends
ideas
information_gaps
opportunities
research_tasks
research_sources
claims
evidence
contradictions
hypotheses
experiments
experiment_runs
experiment_results
agent_runs
agent_messages
agent_decisions
content
content_versions
content_reviews
publications
engagement_metrics
memories
knowledge_entities
knowledge_relationships
questions
system_events
audit_logs

Use migrations.

Add indexes for frequently queried fields.

---

# 9. BACKEND

Use:

- TypeScript
- Node.js
- Fastify or Express
- PostgreSQL
- Redis
- BullMQ
- WebSocket or Server-Sent Events
- Zod for validation

Use clean modular architecture.

Recommended structure:

src/

config/
api/
agents/
orchestrator/
services/
repositories/
models/
workflows/
queues/
events/
memory/
knowledge/
providers/
integrations/
experiments/
analytics/
security/
utils/

Do not place business logic inside route handlers.

---

# 10. PROVIDER ABSTRACTION

Do not hard-code the application to one AI provider.

Create interfaces:

LLMProvider
SearchProvider
NewsProvider
GitHubProvider
SocialProvider
EmbeddingProvider

Allow multiple implementations.

Use environment variables for API keys.

Never hard-code secrets.

---

# 11. SOURCE INGESTION

Create a source adapter system.

Each adapter must support:

fetch()
normalize()
deduplicate()
extract()
store()

Start with:

- RSS/news
- GitHub
- configurable web research provider

Design interfaces so Reddit, X, research-paper sources, etc. can be added later.

Respect API terms, rate limits, robots policies, authentication requirements, and platform rules.

---

# 12. RESEARCH SYSTEM

Every research task should produce:

Research Question
Sources
Claims
Evidence
Contradictions
Uncertainty
Conclusion
Confidence
Citations

Implement source provenance.

Every important claim should be traceable to supporting evidence.

---

# 13. EXPERIMENT LAB

Implement a secure experiment subsystem.

Required features:

- experiment specification
- hypothesis
- generated code
- dependencies
- execution status
- stdout
- stderr
- metrics
- artifacts
- results
- reproducibility information

Execution must happen in an isolated sandbox/container.

Apply:

- CPU limits
- memory limits
- timeout
- filesystem restrictions
- network restrictions where possible
- process restrictions

Never execute arbitrary generated code in the main backend process.

---

# 14. MULTI-AGENT DEBATE

For important conclusions use:

Researcher
→ Skeptic
→ Fact Checker
→ Judge

Store every decision.

The judge should produce:

{
  conclusion,
  confidence,
  supporting_evidence,
  conflicting_evidence,
  unresolved_questions,
  publish_recommendation
}

---

# 15. PERSONA SYSTEM

Allow configurable personas.

Persona configuration should include:

- name
- role
- expertise
- writing style
- principles
- forbidden behaviors
- target audience
- preferred topics
- content formats

The persona must remain consistent across content.

---

# 16. CONTENT CREATION

Create reusable templates.

LinkedIn:

- hook
- context
- insight
- evidence
- conclusion
- question

X:

- concise post
- thread

Research:

- abstract
- methodology
- findings
- limitations
- conclusion

Tutorial:

- problem
- explanation
- implementation
- result

Do not invent experiment results.

Do not fabricate citations.

---

# 17. QUALITY GATE

Before publication evaluate:

- factual correctness
- citation validity
- originality
- repetition
- persona consistency
- clarity
- usefulness
- safety
- confidence
- unsupported claims

Assign a quality score.

Example:

0–59:
reject

60–74:
revise

75–89:
approve

90–100:
high confidence

Make thresholds configurable.

---

# 18. HUMAN-IN-THE-LOOP

Implement autonomy levels:

LEVEL 1:
AI researches only.

LEVEL 2:
AI researches + creates content.

LEVEL 3:
AI researches + creates + proposes publication.

LEVEL 4:
AI can publish after configured checks.

LEVEL 5:
Fully autonomous mode.

Default hackathon configuration should require human approval before external publication.

---

# 19. ANALYTICS + LEARNING

Track content performance.

For every publication store:

topic
format
timestamp
content version
engagement
audience response
feedback

Learning Agent should identify correlations.

Example:

"Experiment-based technical posts outperform generic AI news."

Future content selection should use this insight.

Do not simply optimize for likes.

Also track:

- meaningful comments
- saves if available
- shares
- clicks
- quality feedback

---

# 20. CURIOSITY ENGINE

After every investigation generate:

Discovery
Unanswered Questions
Potential Experiments
Potential Opportunities
Next Questions

Rank next questions using:

- expected information gain
- novelty
- impact
- feasibility
- relevance
- uncertainty

The highest-value question becomes the next autonomous mission.

---

# 21. DASHBOARD

Build a modern dashboard with:

## Command Center

Show:

- AI status
- current mission
- current agent
- current workflow state
- autonomy level
- confidence
- next action

## Discovery Feed

Show:

- trends
- information gaps
- contradictions
- opportunities

## Research

Show:

- active investigations
- sources
- claims
- evidence
- confidence

## Experiment Lab

Show:

- hypotheses
- experiments
- live status
- metrics
- results

## AI Journal

Show chronological events:

"Observed..."
"Discovered..."
"Research started..."
"Hypothesis created..."
"Experiment started..."
"Conclusion..."
"Content generated..."

## Content Studio

Show:

- drafts
- revisions
- quality scores
- citations
- approval status

## Analytics

Show:

- publication performance
- topic performance
- format performance
- learning insights

## Knowledge Graph

Show entities and relationships.

## System Health

Show:

- agent status
- queues
- API usage
- errors
- latency
- task history

---

# 22. REAL-TIME EVENT SYSTEM

Create events such as:

SOURCE_INGESTED
TREND_DETECTED
GAP_DISCOVERED
RESEARCH_STARTED
SOURCE_FOUND
CLAIM_EXTRACTED
CONTRADICTION_FOUND
HYPOTHESIS_CREATED
EXPERIMENT_STARTED
EXPERIMENT_COMPLETED
DEBATE_STARTED
FACT_CHECK_COMPLETED
CONTENT_GENERATED
QUALITY_CHECK_COMPLETED
APPROVAL_REQUIRED
CONTENT_PUBLISHED
ANALYTICS_UPDATED
LEARNING_COMPLETED
QUESTION_GENERATED

Expose these events to the dashboard.

---

# 23. OBSERVABILITY

Every agent execution must record:

- agent name
- task ID
- input summary
- output summary
- model
- latency
- token usage if available
- tool calls
- status
- error
- confidence
- cost estimate

Do not expose private chain-of-thought.

Store concise decision summaries and structured reasoning metadata instead.

---

# 24. SECURITY

Implement:

- authentication
- authorization
- API-key encryption/storage strategy
- rate limiting
- input validation
- output validation
- audit logging
- secret management
- sandboxed code execution
- SSRF protection
- URL validation
- prompt-injection defenses
- tool permission boundaries

External content must be treated as untrusted data.

Never allow retrieved webpages or documents to directly override system instructions.

---

# 25. FAILURE HANDLING

Agents must fail gracefully.

Implement:

- retries
- exponential backoff
- timeouts
- dead-letter queues
- partial workflow recovery
- idempotent jobs
- circuit breakers where appropriate

If an agent fails, the workflow should be resumable.

---

# 26. TESTING

Create:

- unit tests
- integration tests
- workflow tests
- API tests
- agent contract tests
- database tests
- sandbox security tests

Create mock providers so the project can run without paid APIs.

---

# 27. DEMO MODE

Create a deterministic DEMO MODE.

The demo should be able to execute this complete scenario:

1. Observe simulated technology sources.
2. Detect an emerging AI topic.
3. Detect an information gap.
4. Research the gap.
5. Find contradictory claims.
6. Generate a hypothesis.
7. Run an experiment in the sandbox.
8. Analyze experiment results.
9. Ask the skeptic agent to challenge the conclusion.
10. Fact-check the conclusion.
11. Judge the evidence.
12. Generate original content.
13. Run quality/originality checks.
14. Request human approval.
15. Publish using a mock publisher.
16. Generate simulated engagement.
17. Learn from the engagement.
18. Generate the next research question.

The entire process should be visible in the dashboard.

---

# 28. API DESIGN

Implement REST APIs for:

/api/auth
/api/sources
/api/topics
/api/trends
/api/discoveries
/api/gaps
/api/opportunities
/api/research
/api/hypotheses
/api/experiments
/api/claims
/api/evidence
/api/debates
/api/content
/api/publications
/api/analytics
/api/memory
/api/knowledge
/api/questions
/api/agents
/api/workflows
/api/events

Add WebSocket/SSE endpoints for real-time agent activity.

---

# 29. ENVIRONMENT CONFIGURATION

Create .env.example.

Include placeholders for:

DATABASE_URL
REDIS_URL
LLM_API_KEY
SEARCH_API_KEY
GITHUB_TOKEN
NEWS_API_KEY
SOCIAL_API_KEYS
EMBEDDING_API_KEY

Never commit secrets.

---

# 30. DEVELOPMENT STRATEGY

Do NOT attempt to build everything in one step.

Implement sequential milestones.

MILESTONE 1:
Backend foundation + database + authentication

MILESTONE 2:
Source ingestion + observer

MILESTONE 3:
Trend engine + information-gap engine

MILESTONE 4:
Research + evidence + citations

MILESTONE 5:
Memory + knowledge graph

MILESTONE 6:
Hypothesis + experiment lab

MILESTONE 7:
Multi-agent debate

MILESTONE 8:
Creator + quality gate

MILESTONE 9:
Publishing + analytics

MILESTONE 10:
Learning + curiosity engine

MILESTONE 11:
Dashboard + real-time visualization

MILESTONE 12:
End-to-end autonomous demo

After each milestone:
- run tests
- inspect errors
- fix issues
- update documentation
- verify existing functionality
- do not break previous milestones

---

# 31. ENGINEERING RULES

Write maintainable production-quality code.

Use TypeScript strict mode.

Use clear interfaces.

Use dependency injection where useful.

Avoid unnecessary abstractions.

Do not create fake implementations that pretend to work.

If an external API is unavailable:
- create a provider interface
- create a mock implementation
- document what is required for production

Never hard-code credentials.

Never fabricate API responses.

Never fabricate research results.

Never claim an experiment ran if it did not.

Never claim a source was consulted if it was not.

---

# 32. FIRST TASK

Before writing large amounts of code:

1. Analyze the entire specification.
2. Propose the repository structure.
3. Propose the database schema.
4. Propose agent interfaces.
5. Propose workflow/state-machine design.
6. Propose API contracts.
7. Identify technical risks.
8. Identify which features should be MVP vs later.
9. Create an implementation plan.
10. Then begin Milestone 1.

Do not skip architectural planning.

After planning, implement Milestone 1 completely and verify it before moving forward.

The final system must feel like a real autonomous AI research and creation platform, not a collection of disconnected AI demos.

The most important demonstration is:

> The system independently discovers something interesting, identifies what is missing from the current conversation, investigates it, tests a hypothesis, challenges its own conclusion, creates evidence-backed content, learns from the result, and autonomously chooses what to investigate next.