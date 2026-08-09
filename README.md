# 🧠 Autonomous AI Creator — From Prompt-Driven AI to Curiosity-Driven AI

> **Live Production App**: [https://neno-sigma.vercel.app](https://neno-sigma.vercel.app)  
> **GitHub Repository**: [https://github.com/zigooooo/de](https://github.com/zigooooo/de)  
> **AI Usage Log (Vibe-Coding Prompts)**: [PROMPTS.md](https://github.com/zigooooo/de/blob/main/PROMPTS.md)  
> **LLM Infrastructure**: Google Gemini 1.5 Flash (Google AI Studio Free Tier Engine)

---

## 🌟 Overview

**Autonomous AI Creator** is a closed-loop multi-agent AI research and content creation engine. Unlike standard prompt-driven chatbots that require constant human prompting, Autonomous AI Creator operates on a **curiosity-driven feedback loop**:

$$\text{Observe} \longrightarrow \text{Discover Gaps} \longrightarrow \text{Form Hypotheses} \longrightarrow \text{Run Experiments} \longrightarrow \text{Debate} \longrightarrow \text{Publish} \longrightarrow \text{Learn}$$

The system continuously asks: **"What is worth investigating next?"**

---

## 🚀 Key Features & Multi-Agent Architecture

### 🤖 Specialized AI Agents
1. **Observer Agent**: Ingests feeds, normalizes unstructured document data, and extracts semantic entity knowledge.
2. **Trend Agent**: Calculates topic velocity, novelty, and relevance scores.
3. **Information Gap Agent**: Detects unanswered questions, missing benchmarks, and conflicting claims across data sources.
4. **Opportunity Agent**: Identifies high-value research and content creation targets.
5. **Research Agent**: Collects evidence and builds structured arguments backed by citations.
6. **Hypothesis Agent**: Formulates testable research hypotheses.
7. **Experiment Sandbox Agent**: Executes simulated code and collects quantitative benchmarks.
8. **Debate Agents**: Advocate vs. Skeptic multi-agent debate to critique evidence quality.
9. **Creator Agent**: Drafts platform-native content (LinkedIn posts, X/Twitter threads, technical blog posts).
10. **Quality Agent**: Performs multi-point factual verification, citation check, and safety scoring.
11. **Publisher Agent**: Coordinates autonomous publishing across channels based on autonomy level.

### 🛡️ Autonomy Regimes (Levels 1 to 5)
- **Level 1**: Research & Discovery Only
- **Level 2**: Autonomous Research & Draft Generation
- **Level 3 (Default)**: Proposes Publication (Requires Human Gate Approval)
- **Level 4**: Auto-Publishes upon passing strict Quality Thresholds
- **Level 5**: Full Closed-Loop Autonomous Execution

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, CSS Glassmorphic UI Design System
- **Backend**: Node.js, Express, Serverless HTTP
- **AI / LLM Provider**: Google Gemini 1.5 Flash (`gemini-1.5-flash`), Gemini 2.0 Flash (`gemini-2.0-flash`), with Mock Engine Fallback
- **Real-Time Updates**: Server-Sent Events (SSE) Stream (`/api/events`)
- **Deployment Platform**: Vercel Serverless Functions + Static Client Build

---

## 💻 Local Development

### 1. Prerequisites
- Node.js 18+ & npm

### 2. Installation
```bash
git clone https://github.com/zigooooo/de.git
cd de
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
LLM_PROVIDER=gemini
GEMINI_MODEL=gemini-1.5-flash
GEMINI_API_KEY=your_google_ai_studio_api_key
```

### 4. Run Unified Application (Frontend + Backend on Single Port)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Both the React UI and Express API run seamlessly from this single URL.

---

## 🧪 Testing & Verification

Run the automated test suite:
```bash
npm test
```

Build production distribution:
```bash
npm run build
```

---

## ☁️ Vercel Deployment

Deploy directly using Vercel CLI:
```bash
npx vercel --prod
```

Configure Environment Variables in Vercel Dashboard:
- `LLM_PROVIDER` = `gemini`
- `GEMINI_MODEL` = `gemini-1.5-flash`
- `GEMINI_API_KEY` = `<your_gemini_api_key>`

---

## 📄 License

MIT License — Built for AI Hackathon 2026.
