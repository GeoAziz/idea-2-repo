import * as cp from 'child_process';
import { promisify } from 'util';
import { ReasoningBackend } from '../types';
import { retryWithBackoff } from '../../utils/retry';
import { logger } from '../../utils/logger';

// Lazy initialization to support mocking in tests
let execFileAsync: ((cmd: string, args?: string[], options?: any) => Promise<any>) | null = null;

function getExecFile() {
  if (!execFileAsync) {
    execFileAsync = promisify(cp.execFile);
  }
  return execFileAsync;
}

function getCopilotCommand() {
  return process.env.COPILOT_CLI_CMD ?? 'copilot';
}

function getCopilotTimeout(): number {
  const envTimeout = process.env.COPILOT_CLI_TIMEOUT_MS;
  return envTimeout ? parseInt(envTimeout, 10) : 15000;
}

function getCopilotRetries(): number {
  const envRetries = process.env.COPILOT_CLI_RETRIES;
  return envRetries ? parseInt(envRetries, 10) : 2;
}

async function isCopilotAvailable(): Promise<boolean> {
  try {
    const cmd = getCopilotCommand();
    const execFile = getExecFile();
    await execFile(cmd, ['--version'], { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

function escapePrompt(prompt: string): string {
  // Escape special characters for shell
  return prompt.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
}

/**
 * Attempts to use GitHub Copilot CLI for AI-powered suggestions.
 * Falls back gracefully if copilot CLI is not available or times out.
 *
 * Features:
 * - Executable detection (fails fast if Copilot CLI not found)
 * - Configurable timeout via COPILOT_CLI_TIMEOUT_MS
 * - Retry with exponential backoff via COPILOT_CLI_RETRIES
 * - Better error messages with stderr context
 * - Circuit-breaker integration (set externally)
 */
export const copilotCliBackend: ReasoningBackend & {
  isAvailable?: () => Promise<boolean>;
  circuitBreaker?: any;
} = {
  name: 'copilot-cli',
  isAvailable: isCopilotAvailable,

  async suggest(prompt: string) {
    if (copilotCliBackend.circuitBreaker?.isTripped?.()) {
      throw new Error('Copilot CLI circuit breaker is open; use offline backend');
    }

    const cmd = getCopilotCommand();
    const timeout = getCopilotTimeout();
    const maxRetries = getCopilotRetries();

    try {
      const result = await retryWithBackoff(
        async () => {
          try {
            const execFile = getExecFile();
            const { stdout, stderr } = await execFile(cmd, ['-p', escapePrompt(prompt), '--allow-all'], {
              timeout,
              maxBuffer: 5 * 1024 * 1024
            });

            if (!stdout || stdout.trim().length === 0) {
              throw new Error('Empty response from Copilot CLI');
            }

            // Record success in circuit breaker
            if (copilotCliBackend.circuitBreaker?.recordSuccess) {
              copilotCliBackend.circuitBreaker.recordSuccess();
            }

            return stdout.trim();
          } catch (err: any) {
            const errMsg = err.stderr || err.message || String(err);
            if (process.env.VERBOSE_REASONING) {
              logger.warn(`Copilot suggest attempt failed: ${errMsg.slice(0, 100)}`);
            }
            throw err;
          }
        },
        { maxAttempts: maxRetries + 1, initialDelayMs: 500, maxDelayMs: 5000 }
      );

      return result;
    } catch (error: any) {
      // Record failure in circuit breaker
      if (copilotCliBackend.circuitBreaker?.recordFailure) {
        copilotCliBackend.circuitBreaker.recordFailure();
      }

      const errorMsg =
        error.code === 'ETIMEDOUT'
          ? `Copilot CLI timeout (${timeout}ms); consider increasing COPILOT_CLI_TIMEOUT_MS`
          : error.code === 'ENOENT'
            ? `Copilot CLI not found: run 'brew install gh-copilot' or set COPILOT_CLI_CMD`
            : `Copilot CLI error: ${error.message}`;

      throw new Error(errorMsg);
    }
  },

  async explain(prompt: string) {
    // Same as suggest for now; can be specialized later
    return this.suggest(prompt);
  }
};
