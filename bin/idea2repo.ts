#!/usr/bin/env node
import { run } from '../src/index';

(async () => {
  try {
    await run(process.argv.slice(2));
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Fatal:', err?.message ?? err);
    process.exit(1);
  }
})();
