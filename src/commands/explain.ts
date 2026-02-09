import fs from 'fs';
import path from 'path';
import { DecisionModel } from '../core/decisionModel';
import { explain as copilotExplain } from '../copilot/copilotClient';
import { build } from '../explainability/explanationBuilder';
import { logger } from '../utils/logger';

function readDecisions(targetDir: string) {
  const decisionsPath = path.join(targetDir, '.idea2repo', 'decisions.json');
  if (!fs.existsSync(decisionsPath)) return null;
  const raw = fs.readFileSync(decisionsPath, 'utf8');
  return JSON.parse(raw);
}

export async function explain(args: string[]) {
  const pathIndex = args.findIndex((arg) => arg === '--path' || arg === '-p');
  const targetDir = pathIndex >= 0 && args[pathIndex + 1] ? args[pathIndex + 1] : process.cwd();
  const question = args.filter((_, idx) => idx !== pathIndex && idx !== pathIndex + 1).join(' ').trim();

  const decisions = readDecisions(targetDir);
  if (!decisions) {
    logger.error('No decisions.json found. Run this inside a generated repo or pass --path.');
    return { ok: false, error: 'Missing decisions.json' };
  }

  const dm = new DecisionModel(decisions);
  const summary = build(dm.summary());

  if (!question) {
    logger.info(summary);
    return { ok: true, decisions: dm.summary(), summary };
  }

  const prompt = `Based on these project decisions:\n${JSON.stringify(decisions, null, 2)}\n\nQuestion: ${question}`;
  const response = await copilotExplain(prompt);
  logger.info(response);
  return { ok: true, decisions: dm.summary(), summary, response };
}
