jest.mock('child_process', () => ({
  execSync: jest.fn(() => {
    throw new Error('gh not available');
  })
}));

import { suggest, explain } from '../src/copilot/copilotClient';
import { logger } from '../src/utils/logger';

describe('copilotClient fallbacks', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    // Ensure warn calls are captured
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('suggest returns fallback suggestion when gh is unavailable (structure prompt)', async () => {
    const res = await suggest('please propose a folder structure');
    expect(res).toMatch(/Suggested structure/);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('suggest returns generic fallback for other prompts', async () => {
    const res = await suggest('something else');
    expect(res).toMatch(/Offline suggestion/);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('explain returns fallback explanation when gh is unavailable', async () => {
    const res = await explain('why choose this stack?');
    expect(res).toMatch(/Explanation \(offline mode\)/);
    expect(warnSpy).toHaveBeenCalled();
  });
});

