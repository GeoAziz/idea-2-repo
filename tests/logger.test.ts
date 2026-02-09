import { logger } from '../src/utils/logger';

describe('logger', () => {
  let infoSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let successSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    successSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls console.log for info', () => {
    logger.info('hello', 'info');
    expect(infoSpy).toHaveBeenCalled();
  });

  it('calls console.error for error', () => {
    logger.error('bad');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('calls console.warn for warn', () => {
    logger.warn('watch out');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('calls console.log for success', () => {
    logger.success('nice');
    expect(successSpy).toHaveBeenCalled();
  });
});
