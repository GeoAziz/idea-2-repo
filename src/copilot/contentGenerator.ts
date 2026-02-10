import { suggest } from './copilotClient';
import { retryWithBackoff } from '../utils/retry';

type ContentInput = {
  idea: string;
  normalized: {
    problem: string;
    domain: string;
    region?: string;
    riskSensitivity: string;
    appType: string;
  };
  classification: {
    kind: string;
    complexity: string;
  };
  copilotOutput: string;
};

const BASE_FILES = ['README.md', 'TODO.md', 'docs/roadmap.md', 'docs/decisions.md'];

function basePrompt(input: ContentInput, filePath: string) {
  return `You are generating ${filePath} for a new project scaffold.
Idea: ${input.idea}
App type: ${input.normalized.appType}
Domain: ${input.normalized.domain}
Risk: ${input.normalized.riskSensitivity}
Complexity: ${input.classification.complexity}
Copilot architecture notes: ${input.copilotOutput}

Return only the file contents for ${filePath}, no markdown fencing.`;
}

/**
 * Throttle concurrent Copilot calls to avoid overwhelming the API.
 * Max 2 concurrent calls at a time.
 */
async function throttledSuggest(prompt: string, concurrency: number = 2): Promise<string> {
  return retryWithBackoff(
    () => suggest(prompt),
    { maxAttempts: 2, initialDelayMs: 300, maxDelayMs: 3000 }
  );
}

export async function generateCopilotContent(input: ContentInput, extraFiles: string[] = []) {
  const content: Partial<Record<string, string>> = {};
  const files = [...BASE_FILES, ...extraFiles];

  // Process files in small batches to respect rate limits
  const batchSize = 2;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const promises = batch.map(async (file) => {
      const prompt = basePrompt(input, file);
      try {
        const output = await throttledSuggest(prompt);
        content[file] = output.trim();
      } catch (error) {
        // Fallback to a minimal stub if generation fails
        content[file] = `# ${file}\n\nGenerated stub. Please fill in content based on your project needs.`;
      }
    });
    await Promise.all(promises);
  }

  return content;
}
