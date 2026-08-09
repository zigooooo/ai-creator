# 📜 PROMPTS.md — AI Usage Log & Vibe-Coding Trajectory

> **Hackathon AI-Usage Verification Document**  
> **Project**: Autonomous AI Creator — From Prompt-Driven to Curiosity-Driven AI  
> **Repository**: [https://github.com/zigooooo/de](https://github.com/zigooooo/de)  
> **Live App**: [https://neno-sigma.vercel.app](https://neno-sigma.vercel.app)

---

## 📌 Executive Summary

This document logs the prompts, architectural instructions, and vibe-coding iteration trajectory used to build the **Autonomous AI Creator** platform. The project was vibe-coded using Google Antigravity & DeepMind AGY AI pair programming capabilities.

---

## 🤖 Prompt 1: Initial Vision & Engineering Architecture Prompt

**User Prompt**:
> "Build an autonomous AI research and creation platform: Autonomous AI Creator — From Prompt-Driven AI to Curiosity-Driven AI. System must observe, discover trends, detect information gaps, formulate hypotheses, run experiments, debate evidence, generate content, and learn continuously."

**Architectural Specification Executed**:
- Designed an 11-agent architecture: `ObserverAgent`, `TrendAgent`, `GapAgent`, `OpportunityAgent`, `ResearchAgent`, `HypothesisAgent`, `ExperimentAgent`, `DebateAgents` (Skeptic & Advocate), `CreatorAgent`, `QualityAgent`, `PublisherAgent`.
- Implemented `AutonomyLoop` orchestrator with 5 autonomy regimes (L1 to L5).
- Built real-time Server-Sent Events (SSE) stream (`/api/events`) for dashboard activity tracking.

---

## 🔧 Prompt 2: Single Localhost URL & Codebase Error Remediation

**User Prompt**:
> "fix all error and merge backend and frontend in one main local host url and push it on https://github.com/zigooooo/de"

**AI Actions & Fixes Applied**:
1. **Frontend Relative API Endpoint**:
   - Replaced hardcoded `http://localhost:3001/api` in `client/src/App.tsx` with relative path `/api`.
2. **Vite Proxy & Express Static Serving**:
   - Updated `client/vite.config.ts` to proxy requests to port `3000`.
   - Updated `src/server.ts` to serve compiled React assets from `client/dist` and handle SPA routing.
3. **Unified Dev & Start Scripts**:
   - Configured `package.json` scripts (`"dev": "npm run build && node dist/server.js"`) so launching the app serves both backend and frontend on a single URL: `http://localhost:3000`.

---

## ⚡ Prompt 3: Free Gemini LLM Model Integration & Failover

**User Prompt**:
> "fix the llm api issuse use some gemini free model for temporary work"

**AI Actions & Fixes Applied**:
1. **Gemini LLM Provider (`src/providers/gemini.provider.ts`)**:
   - Integrated Google AI Studio free tier models: `gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-8b`.
   - Added regex cleaner to strip markdown code blocks (` ```json `) from LLM output before parsing.
   - Built automatic multi-model failover and fallback to `MockLLMProvider` if credentials are invalid or rate-limited.
2. **Environment Configuration**:
   - Configured `LLM_PROVIDER=gemini` and `GEMINI_MODEL=gemini-1.5-flash` in `.env`.

---

## ☁️ Prompt 4: Vercel Free Serverless Deployment (CLI Method)

**User Prompt**:
> "i wanna deplo on vercel with llm so help doing it freely ... use method b"

**AI Actions & Fixes Applied**:
1. **Vercel Rewrite Configuration (`vercel.json`)**:
   - Configured `buildCommand`, `outputDirectory`, and `/api/(.*)` rewrites to point to `/api/index.ts`.
2. **Conflict Resolution**:
   - Removed conflicting duplicate file `api/index.js` in favor of `api/index.ts`.
3. **CLI Project Linking & Environment Injection**:
   - Executed `npx vercel link --yes` to link project `nitesh-3a03/neno` connected to GitHub repository `zigooooo/de`.
   - Injected production environment variables (`LLM_PROVIDER`, `GEMINI_MODEL`, `GEMINI_API_KEY`).
   - Executed `npx vercel --prod --yes` to deploy.

---

## 🎯 Verification Logs

### Automated Tests Execution
```bash
npm test
```
**Result**: `3 / 3 Subtests Passed` (Initialization, Feed Sorting, Topic Candidate Extraction).

### Build Verification
```bash
npm run build
```
**Result**: TypeScript compilation (`tsc`) and Vite frontend build completed with **0 errors**.

### Live Production Deployment
- **Live URL**: `https://neno-sigma.vercel.app`
- **Live API Endpoint**: `https://neno-sigma.vercel.app/api/workflows/state` (HTTP 200 OK)
- **Live Demo Trigger Endpoint**: `https://neno-sigma.vercel.app/api/workflows/demo/run` (HTTP 200 OK - Generated post and review score)

---

*This document confirms the application was fully vibe-coded and verified using AI pair-programming.*
