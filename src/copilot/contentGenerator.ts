import { suggest } from './copilotClient';

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

Return only the file contents for ${filePath}.`;
}

export async function generateCopilotContent(input: ContentInput, extraFiles: string[] = []) {
  const content: Partial<Record<string, string>> = {};
  const files = [...BASE_FILES, ...extraFiles];
  for (const file of files) {
    const prompt = basePrompt(input, file);
    const output = await suggest(prompt);
    content[file] = output.trim();
  }
  return content;
}
