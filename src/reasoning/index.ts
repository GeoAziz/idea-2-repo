import { logger } from '../utils/logger';
import { copilotCliBackend } from './backends/copilotCliBackend';
import { offlineBackend } from './backends/offlineBackend';
import { ReasoningBackend } from './types';
import { CircuitBreaker } from '../utils/retry';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = path.join(process.cwd(), '.idea2repo');
const CACHE_FILE = path.join(CACHE_DIR, 'reasoning-cache.json');
const CIRCUIT_BREAKER_FILE = path.join(CACHE_DIR, 'circuit-breaker.json');
const cache = new Map<string, string>();

// Circuit breaker: trip after 3 consecutive failures, reset after 60s
const circuitBreaker = new CircuitBreaker(3, 60000);
copilotCliBackend.circuitBreaker = circuitBreaker;

function selectedBackend(): ReasoningBackend {
  const choice = process.env.REASONING_BACKEND?.toLowerCase();
  if (choice === 'offline') return offlineBackend;
  return copilotCliBackend;
}

function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return;
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const obj = JSON.parse(raw || '{}');
    for (const [k, v] of Object.entries(obj)) cache.set(k, v as string);
  } catch (err) {
    // ignore errors
  }
}

function persistCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    const obj: Record<string, string> = {};
    for (const [k, v] of cache) obj[k] = v;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    // best-effort only
  }
}

function hashPrompt(prompt: string) {
  return crypto.createHash('sha1').update(prompt).digest('hex');
}

async function withFallback<T>(fn: (backend: ReasoningBackend) => Promise<T>, prompt: string) {
  const backend = selectedBackend();
  try {
    return await fn(backend);
  } catch (error: any) {
    if (process.env.VERBOSE_REASONING) {
      logger.warn(`${backend.name} backend failed, using offline reasoning.`);
    }
    return fn(offlineBackend);
  }
}

async function callWithCache(key: string, cb: () => Promise<string>) {
  // load cache on first use
  if (cache.size === 0) loadCache();
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const result = await cb();
  try {
    cache.set(key, result);
    persistCache();
  } catch (err) {
    // ignore persistence errors
  }
  return result;
}

export async function suggest(prompt: string): Promise<string> {
  const key = `suggest:${hashPrompt(prompt)}`;
  return callWithCache(key, () => withFallback((backend) => backend.suggest(prompt), prompt));
}

export async function explain(prompt: string): Promise<string> {
  const key = `explain:${hashPrompt(prompt)}`;
  return callWithCache(key, () => withFallback((backend) => backend.explain(prompt), prompt));
}
