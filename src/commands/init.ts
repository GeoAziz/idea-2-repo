import { prompt } from 'prompts';
import { normalize } from '../core/ideaNormalizer';
import { classify } from '../core/projectClassifier';
import { suggest } from '../copilot/copilotClient';
import { logger } from '../utils/logger';
import { generateScaffold } from '../scaffold/scaffoldGenerator';
import { slugify } from '../utils/slug';
import path from 'path';

export async function init(_args: string[]) {
  logger.info('\n🚀 idea2repo — Initialize a new project\n');

  try {
    const responses = await prompt([
      {
        type: 'text',
        name: 'name',
        message: 'Project name',
        initial: 'my-awesome-app'
      },
      {
        type: 'select',
        name: 'appType',
        message: 'What kind of project?',
        choices: [
          { title: 'CLI Tool', value: 'cli' },
          { title: 'Web App', value: 'web' },
          { title: 'API Server', value: 'api' },
          { title: 'Library', value: 'library' }
        ]
      },
      {
        type: 'text',
        name: 'idea',
        message: 'Brief idea/purpose (one line)',
        initial: 'A tool to solve...'
      },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Need authentication?',
        initial: false
      },
      {
        type: 'confirm',
        name: 'database',
        message: 'Need a database?',
        initial: false
      },
      {
        type: 'select',
        name: 'teamSize',
        message: 'Team size',
        choices: [
          { title: 'Solo project', value: 'solo' },
          { title: '2-5 people', value: 'small' },
          { title: '5+ people', value: 'large' }
        ]
      }
    ]);

    const options = responses as any;
    logger.info(`\n📝 Normalizing idea: "${options.idea}"...`);
    const normalized = normalize(options.idea);
    normalized.appType = options.appType;
    logger.info('✓ Idea normalized');

    const classification = classify(options.idea);

    logger.info('\n🤖 Consulting GitHub Copilot CLI for architecture...');
    const architecturePrompt = `Design a ${options.appType} repository structure for: ${options.idea}. Auth required: ${options.auth}. Database: ${options.database}.`;
    const suggestion = await suggest(architecturePrompt);
    logger.info('✓ Architecture suggestion received');

    logger.info('\n🏗️  Building repository scaffold...');
    const name = slugify(options.name);
    const outputDir = path.resolve(options.name || name);
    const structure = await generateScaffold({
      idea: options.idea,
      name,
      normalized,
      classification,
      copilotInput: architecturePrompt,
      copilotOutput: suggestion,
      targetDir: outputDir
    });
    logger.info(`✓ Scaffold generated at ${structure.outputDir}`);

    return {
      ok: true,
      message: `Project "${options.name}" initialized (id: ${options.appType})`,
      config: {
        ...options,
        normalized,
        classification,
        architectureSuggestion: suggestion,
        outputDir: structure.outputDir
      }
    };
  } catch (error: any) {
    if (error.isTtyError) {
      logger.error('Prompts cannot be rendered in this environment');
    } else {
      logger.error(`Init failed: ${error.message}`);
    }
    return { ok: false, error: error.message };
  }
}
