import { explain as reasoningExplain, suggest as reasoningSuggest } from '../reasoning';
import { logger } from '../utils/logger';

export async function suggest(prompt: string): Promise<string> {
  logger.warn('copilotClient is deprecated; use reasoning backend instead.');
  return reasoningSuggest(prompt);
}

export async function explain(prompt: string): Promise<string> {
  logger.warn('copilotClient is deprecated; use reasoning backend instead.');
  return reasoningExplain(prompt);
}
