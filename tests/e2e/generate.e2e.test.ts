import os from 'os';
import path from 'path';
import fs from 'fs';
import { normalize } from '../../src/core/ideaNormalizer';
import { classify } from '../../src/core/projectClassifier';
import { generateScaffold } from '../../src/scaffold/scaffoldGenerator';

describe('e2e: generate scaffold (dry run)', () => {
  const originalBackend = process.env.REASONING_BACKEND;

  beforeAll(() => {
    // Force offline reasoning so tests are deterministic
    process.env.REASONING_BACKEND = 'offline';
  });

  afterAll(() => {
    process.env.REASONING_BACKEND = originalBackend;
  });

  test('generateScaffold returns expected files (dryRun)', async () => {
    const idea = 'A lightweight expense tracker for freelancers';
    const normalized = normalize(idea);
    const classification = classify(idea);

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'idea2repo-e2e-'));

    const result = await generateScaffold({
      idea,
      name: 'expense-tracker',
      normalized,
      classification,
      copilotInput: 'test prompt',
      copilotOutput: 'test output',
      targetDir: tmp,
      dryRun: true,
      teamMode: false,
      language: 'node'
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.files)).toBe(true);
    // Core expected files
    expect(result.files).toEqual(expect.arrayContaining(['README.md', 'TODO.md', 'docs/architecture.md']));

    // dryRun should not create files on disk
    expect(fs.existsSync(path.join(tmp, 'README.md'))).toBe(false);
  });
});
