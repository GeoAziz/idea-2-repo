import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { logger } from '../utils/logger';
import { colors } from '../ui/colors';
import { generate } from './generate';

type Example = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  idea: string;
  features?: string[];
  customizations?: Array<{
    key: string;
    question: string;
    type: 'boolean' | 'choice' | 'text';
    options?: string[];
    default?: boolean | string;
  }>;
};

export async function useExample(args: string[]) {
  const selection = args[0];
  const examplesDir = path.join(process.cwd(), 'examples');
  const files = fs.readdirSync(examplesDir).filter((file) => file.endsWith('.json'));
  const items: Example[] = files.map((file) =>
    JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf-8'))
  );

  const index = selection ? Number(selection) - 1 : 0;
  const example = items[index];
  if (!example) {
    logger.error(colors.error('Example not found. Run `idea2repo examples` to list options.'));
    return { ok: false, error: 'Example not found' };
  }

  const baseQuestions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name?',
      default: example.id
    }
  ];

  const customQuestions =
    example.customizations?.map((custom) => ({
      type: custom.type === 'choice' ? 'list' : custom.type === 'boolean' ? 'confirm' : 'input',
      name: custom.key,
      message: custom.question,
      choices: custom.options,
      default: custom.default
    })) ?? [];

  const answers = await inquirer.prompt([...baseQuestions, ...customQuestions]);
  const customSummary = Object.entries(answers)
    .filter(([key]) => key !== 'projectName')
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const idea = `${example.idea}${customSummary ? ` (Customizations: ${customSummary})` : ''}`;
  const argsForGenerate = [idea, '--out', answers.projectName];
  return generate(argsForGenerate);
}
