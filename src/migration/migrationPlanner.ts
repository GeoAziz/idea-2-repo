import { suggest } from '../copilot/copilotClient';

type MigrationPlan = {
  prompt: string;
  response: string;
};

export async function planMigration(input: {
  structure: Record<string, unknown>;
  dependencies: string[];
  frameworks: string[];
}): Promise<MigrationPlan> {
  const prompt = `You are helping restructure a legacy project.

Current structure:
${JSON.stringify(input.structure, null, 2)}

Dependencies:
${input.dependencies.join(', ') || 'None detected'}

Frameworks:
${input.frameworks.join(', ') || 'Unknown'}

Create an ideal folder structure for this project following best practices.
Provide the response in this format:

Proposed structure:
- src/
- src/...

Migration steps:
1. ...
2. ...
`;

  const response = await suggest(prompt);
  return { prompt, response };
}
