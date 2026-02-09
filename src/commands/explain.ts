import { DecisionModel } from '../core/decisionModel';

export async function explain(_args: string[]) {
  const dm = new DecisionModel({ stack: 'Node', rationale: 'stubbed' });
  return dm.summary();
}
