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

  logger.info(colors.info(`\n📋 Template: ${example.name}\n${example.description}\n`));

  const decisions = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'What would you like to do?',
      choices: [
        { name: `Use "${example.name}" template`, value: 'useTemplate' },
        { name: 'Customize the template idea', value: 'customize' },
        { name: 'Use your own idea instead', value: 'ownIdea' }
      ]
    }
  ]);

  let finalIdea = example.idea;
  let projectName = example.id;

  if (decisions.mode === 'ownIdea') {
    // User wants to provide their own idea - use generate command instead
    const customIdea = await inquirer.prompt([
      {
        type: 'input',
        name: 'idea',
        message: 'Describe your app idea',
        default: example.idea
      }
    ]);
    finalIdea = customIdea.idea;
    const nameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name?',
        default: 'my-project'
      }
    ]);
    projectName = nameAnswer.projectName;
  } else if (decisions.mode === 'customize') {
    // Ask for customizations
    const customQuestions =
      example.customizations?.map((custom) => ({
        type: custom.type === 'choice' ? 'list' : custom.type === 'boolean' ? 'confirm' : 'input',
        name: custom.key,
        message: custom.question,
        choices: custom.options,
        default: custom.default
      })) ?? [];

    const answers = await inquirer.prompt(customQuestions);
    const customSummary = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    finalIdea = `${example.idea} (Customizations: ${customSummary})`;

    const nameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name?',
        default: example.id
      }
    ]);
    projectName = nameAnswer.projectName;
  } else {
    // useTemplate - just ask for project name
    const nameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name?',
        default: example.id
      }
    ]);
    projectName = nameAnswer.projectName;
  }

  const argsForGenerate = [finalIdea, '--out', projectName];
  return generate(argsForGenerate);
}
