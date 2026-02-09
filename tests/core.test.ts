import { classify } from '../src/core/projectClassifier';
import { DecisionModel } from '../src/core/decisionModel';

test('classify returns basic shape', () => {
  const r = classify('some idea');
  expect(r).toHaveProperty('kind');
});

test('DecisionModel summary', () => {
  const dm = new DecisionModel({ stack: 'Node' });
  expect(dm.summary()).toHaveProperty('decisions');
});
