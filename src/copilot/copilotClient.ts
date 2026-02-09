import { explain as reasoningExplain, suggest as reasoningSuggest } from '../reasoning';
import { logger } from '../utils/logger';

export class CopilotClient {
  async suggest(prompt: string): Promise<string> {
    logger.warn('copilotClient is deprecated; use reasoning backend instead.');
    return reasoningSuggest(prompt);
  }

  async explain(prompt: string): Promise<string> {
    logger.warn('copilotClient is deprecated; use reasoning backend instead.');
    return reasoningExplain(prompt);
  }

  async conversationMode(initialContext: string): Promise<void> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'You: '
    });

    console.log('\n🤖 Copilot Chat Mode (type "exit" to quit)\n');
    console.log(`Context: ${initialContext}\n`);

    let conversationHistory = `Context: ${initialContext}\n\n`;

    rl.prompt();

    rl.on('line', async (input: string) => {
      if (input.trim().toLowerCase() === 'exit') {
        console.log('\n👋 Ending conversation...\n');
        rl.close();
        return;
      }

      if (input.trim() === '') {
        rl.prompt();
        return;
      }

      conversationHistory += `User: ${input}\n`;

      try {
        const response = await this.suggest(conversationHistory);
        console.log(`\n🤖 Copilot: ${response}\n`);
        conversationHistory += `Assistant: ${response}\n\n`;
      } catch (error) {
        console.error('Error:', error);
      }

      rl.prompt();
    });
  }
}

export async function suggest(prompt: string): Promise<string> {
  logger.warn('copilotClient is deprecated; use reasoning backend instead.');
  return reasoningSuggest(prompt);
}

export async function explain(prompt: string): Promise<string> {
  logger.warn('copilotClient is deprecated; use reasoning backend instead.');
  return reasoningExplain(prompt);
}
