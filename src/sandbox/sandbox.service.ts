import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExperimentSpec, ExperimentRun, ExperimentResult } from '../types/index.js';
import { db } from '../db/database.js';

export class SandboxService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'autonomous_ai_sandbox');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  public async executeExperiment(spec: ExperimentSpec): Promise<{ run: ExperimentRun; result: ExperimentResult }> {
    const runId = `run-${Date.now()}`;
    const scriptPath = path.join(this.tempDir, `${runId}.js`);

    fs.writeFileSync(scriptPath, spec.code, 'utf-8');

    const run: ExperimentRun = {
      id: runId,
      experimentId: spec.id,
      status: 'running',
      stdout: '',
      stderr: '',
      executionTimeMs: 0,
      startedAt: new Date().toISOString()
    };
    db.experimentRuns.set(run.id, run);

    const startTime = Date.now();

    return new Promise((resolve) => {
      let stdoutData = '';
      let stderrData = '';
      let killedDueToTimeout = false;

      // Isolated subprocess execution with node
      const child = spawn(process.execPath, [scriptPath], {
        cwd: this.tempDir,
        env: { NODE_ENV: 'sandbox', PATH: process.env.PATH },
        timeout: spec.timeoutMs || 5000
      });

      const timer = setTimeout(() => {
        killedDueToTimeout = true;
        child.kill('SIGKILL');
      }, spec.timeoutMs || 5000);

      child.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderrData += chunk.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const executionTimeMs = Date.now() - startTime;

        // Cleanup temporary script file
        try { if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath); } catch (e) {}

        run.executionTimeMs = executionTimeMs;
        run.stdout = stdoutData;
        run.stderr = stderrData;
        run.completedAt = new Date().toISOString();

        if (killedDueToTimeout) {
          run.status = 'timeout';
          run.stderr += '\n[SANDBOX ERROR] Process terminated: Exceeded execution timeout limit.';
        } else if (code === 0) {
          run.status = 'success';
        } else {
          run.status = 'failed';
        }

        let parsedMetrics: Record<string, any> = {};
        let hypothesisSupported = false;

        try {
          // Attempt parsing metric JSON from stdout
          const jsonMatch = stdoutData.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            parsedMetrics = parsed.metrics || parsed;
            hypothesisSupported = parsed.hypothesisSupported ?? true;
          }
        } catch (e) {
          parsedMetrics = { rawOutput: stdoutData.slice(0, 200) };
          hypothesisSupported = code === 0;
        }

        const expResult: ExperimentResult = {
          id: `res-${Date.now()}`,
          experimentRunId: run.id,
          hypothesisSupported,
          metrics: parsedMetrics,
          reproducibilityNotes: `Executed in isolated sandbox child process (Node.js ${process.version}). Execution time: ${executionTimeMs}ms.`,
          reportMarkdown: `### Sandbox Experiment Execution Report
- **Status**: ${run.status.toUpperCase()}
- **Duration**: ${executionTimeMs}ms
- **Hypothesis Supported**: ${hypothesisSupported ? 'YES' : 'NO'}

#### Captured Metrics:
\`\`\`json
${JSON.stringify(parsedMetrics, null, 2)}
\`\`\`

#### Standard Output:
\`\`\`text
${stdoutData.trim()}
\`\`\`
`
        };

        db.experimentResults.set(expResult.id, expResult);
        resolve({ run, result: expResult });
      });
    });
  }
}

export const sandboxService = new SandboxService();
