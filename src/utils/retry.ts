/**
 * Retry utilities with exponential backoff and jitter.
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  jitterFactor?: number; // 0-1, random jitter as % of delay
}

const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | undefined;
  let delay = opts.initialDelayMs!;

  for (let attempt = 0; attempt < opts.maxAttempts!; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < opts.maxAttempts! - 1) {
        // Add jitter to avoid thundering herd
        const jitter = delay * opts.jitterFactor! * Math.random();
        const waitTime = delay + jitter;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // Exponential backoff
        delay = Math.min(delay * opts.backoffMultiplier!, opts.maxDelayMs!);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Simple circuit breaker: track consecutive failures and trip after threshold.
 * Useful to avoid repeated failed calls to an unavailable service.
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private isOpen = false;

  constructor(private failureThreshold: number = 3, private resetTimeoutMs: number = 60000) {}

  isTripped(): boolean {
    if (this.isOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeoutMs) {
        // Reset after timeout
        this.failureCount = 0;
        this.isOpen = false;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.isOpen = false;
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.isOpen = true;
    }
  }
}
