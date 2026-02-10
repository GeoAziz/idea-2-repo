import { logger } from '../utils/logger';
import { copilotCliBackend } from './backends/copilotCliBackend';
import { offlineBackend } from './backends/offlineBackend';
import { ReasoningBackend } from './types';

function selectedBackend(): ReasoningBackend {
  const choice = process.env.REASONING_BACKEND?.toLowerCase();
  if (choice === 'offline') return offlineBackend;
  return copilotCliBackend;
}

async function withFallback<T>(fn: (backend: ReasoningBackend) => Promise<T>, prompt: string) {
  const backend = selectedBackend();
  try {
    return await fn(backend);
  } catch (error: any) {
    logger.warn(`${backend.name} backend failed, using offline reasoning.`);
    return fn(offlineBackend);
  }
}

export async function suggest(prompt: string): Promise<string> {
  return withFallback((backend) => backend.suggest(prompt), prompt);
}

export async function explain(prompt: string): Promise<string> {
  return withFallback((backend) => backend.explain(prompt), prompt);
}
