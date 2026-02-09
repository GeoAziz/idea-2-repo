import { build } from '../src/explainability/explanationBuilder';

test('explanation builder', () => {
  const out = build({ stack: 'Node' });
  expect(out).toContain('Decisions');
});
