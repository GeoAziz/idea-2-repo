import { retryWithBackoff, CircuitBreaker } from '../src/utils/retry';

describe('Retry utilities', () => {
  describe('retryWithBackoff', () => {
    test('succeeds on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('retries on failure then succeeds', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');
      const result = await retryWithBackoff(fn, { maxAttempts: 3 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('throws after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(retryWithBackoff(fn, { maxAttempts: 2 })).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('adds delay between retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      const start = Date.now();
      await expect(retryWithBackoff(fn, { maxAttempts: 2, initialDelayMs: 100 })).rejects.toThrow();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(100);
    });
  });

  describe('CircuitBreaker', () => {
    test('allows calls when not tripped', () => {
      const cb = new CircuitBreaker(3);
      expect(cb.isTripped()).toBe(false);
    });

    test('trips after failure threshold', () => {
      const cb = new CircuitBreaker(3, 60000);
      cb.recordFailure();
      expect(cb.isTripped()).toBe(false);
      cb.recordFailure();
      expect(cb.isTripped()).toBe(false);
      cb.recordFailure();
      expect(cb.isTripped()).toBe(true);
    });

    test('resets on success', () => {
      const cb = new CircuitBreaker(2, 60000);
      cb.recordFailure();
      cb.recordFailure();
      expect(cb.isTripped()).toBe(true);
      cb.recordSuccess();
      expect(cb.isTripped()).toBe(false);
    });

    test('resets after timeout', async () => {
      const cb = new CircuitBreaker(1, 100); // 100ms timeout
      cb.recordFailure();
      expect(cb.isTripped()).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(cb.isTripped()).toBe(false);
    });
  });
});
