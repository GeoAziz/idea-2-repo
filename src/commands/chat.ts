import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { ConversationManager } from '../copilot/conversationManager';
import { logger } from '../utils/logger';

function loadIdeaFromProject(projectPath: string): string | null {
  const decisionsPath = path.join(projectPath, '.idea2repo', 'decisions.json');
  if (!fs.existsSync(decisionsPath)) return null;
  const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf-8'));
  return decisions.idea ?? null;
}

export async function chat(args: string[]) {
  const loadFlag = args.includes('--load') || args.includes('-l');
  const clearFlag = args.includes('--clear') || args.includes('-c');
  const filteredArgs = args.filter((arg) => !['--load', '-l', '--clear', '-c'].includes(arg));
  const ideaOrPath = filteredArgs.join(' ').trim();

  console.log(chalk.bold.cyan('\n🤖 Copilot Chat Mode\n'));

  let conversationManager: ConversationManager;
  let projectPath: string | undefined;

  if (ideaOrPath && fs.existsSync(ideaOrPath)) {
    projectPath = ideaOrPath;
    const idea = loadIdeaFromProject(projectPath);

    if (!idea) {
      logger.error('Not a valid idea2repo project (missing .idea2repo/decisions.json).');
      return { ok: false, error: 'Invalid project path' };
    }

    conversationManager = new ConversationManager(idea, projectPath);
  } else if (ideaOrPath) {
    conversationManager = new ConversationManager(ideaOrPath);
  } else {
    logger.error('Provide a project idea or path: idea2repo chat "your idea"');
    return { ok: false, error: 'Missing idea or path' };
  }

  if (loadFlag) {
    const loaded = await conversationManager.loadConversation();
    if (loaded) {
      console.log(chalk.green('✓ Loaded existing conversation\n'));
    }
  }

  if (clearFlag) {
    conversationManager.clearHistory();
    console.log(chalk.green('✓ Conversation history cleared\n'));
  }

  while (true) {
    const { question } = await inquirer.prompt([
      {
        type: 'input',
        name: 'question',
        message: 'Ask Copilot:',
        prefix: '💬'
      }
    ]);

    if (!question || question.trim().toLowerCase() === 'exit') {
      console.log(chalk.cyan('\n👋 Goodbye!\n'));
      break;
    }

    const spinner = ora('Thinking...').start();

    try {
      const answer = await conversationManager.ask(question);
      spinner.stop();

      console.log(chalk.bold('\n🤖 Copilot:'));
      console.log(chalk.white(answer));
      console.log('');
    } catch (error) {
      spinner.fail('Error communicating with Copilot');
      console.error(error);
    }
  }

  const history = conversationManager.getHistory();
  console.log(chalk.dim(`\n💾 ${history.length} messages in this conversation\n`));
  return { ok: true, messages: history.length };
}
