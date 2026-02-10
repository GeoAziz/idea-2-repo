jest.mock('child_process', () => ({
  execSync: jest.fn(() => {
    throw new Error('gh not available');
  })
}));

import { suggest, explain } from '../src/reasoning';
import { logger } from '../src/utils/logger';

describe('reasoning backend fallbacks', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    // Ensure warn calls are captured
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
    process.env.REASONING_BACKEND = 'copilot';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    delete process.env.REASONING_BACKEND;
  });

  it('suggest returns fallback suggestion when backend is unavailable (structure prompt)', async () => {
    const res = await suggest('please propose a folder structure');
    expect(res).toMatch(/Suggested.*structure/i);
  });

  it('suggest returns generic fallback for other prompts', async () => {
    const res = await suggest('something else');
    // When offline backend is used, it returns suggestions
    expect(res).toBeTruthy();
    expect(res.length > 0).toBe(true);
  });

  it('explain returns fallback explanation when backend is unavailable', async () => {
    const res = await explain('why choose this stack?');
    expect(res).toBeTruthy();
    expect(res.length > 0).toBe(true);
  });
});
