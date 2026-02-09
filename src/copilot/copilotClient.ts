import * as child_process from 'child_process';
import { logger } from '../utils/logger';

export async function suggest(prompt: string): Promise<string> {
  try {
    // Call GitHub Copilot CLI to suggest repository structure
    const cmd = `gh copilot suggest "${prompt.replace(/"/g, '\\"')}"`;
    const result = child_process.execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.trim();
  } catch (error: any) {
    logger.warn(
      'GitHub Copilot CLI not available or gh not installed. Using offline suggestion.'
    );
    return fallbackSuggest(prompt);
  }
}

export async function explain(prompt: string): Promise<string> {
  try {
    // Call GitHub Copilot CLI to explain code/architecture
    const cmd = `gh copilot explain "${prompt.replace(/"/g, '\\"')}"`;
    const result = child_process.execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.trim();
  } catch (error: any) {
    logger.warn(
      'GitHub Copilot CLI not available or gh not installed. Using offline explanation.'
    );
    return fallbackExplain(prompt);
  }
}

function fallbackSuggest(prompt: string): string {
  // Offline fallback for demo/test purposes
  if (prompt.includes('structure') || prompt.includes('folder')) {
    return `Suggested structure:\n- src/: TypeScript source code\n- tests/: Test suites\n- docs/: Documentation\n- package.json: Node dependencies`;
  }
  return 'Offline suggestion: Consider using Node + TypeScript for multi-platform CLI tools.';
}

function fallbackExplain(prompt: string): string {
  // Offline fallback for demo/test purposes
  return `Explanation (offline mode): This architecture prioritizes:\n1. Clarity: Simple, obvious module boundaries\n2. Testability: Each module has one responsibility\n3. Explainability: All decisions are traceable and documented`;
}
