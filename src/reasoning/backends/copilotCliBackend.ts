import * as child_process from 'child_process';
import { ReasoningBackend } from '../types';

function getCopilotCommand() {
  return process.env.COPILOT_CLI_CMD ?? 'gh copilot';
}

function escapePrompt(prompt: string) {
  return prompt.replace(/"/g, '\\"');
}

export const copilotCliBackend: ReasoningBackend = {
  name: 'copilot-cli',
  async suggest(prompt: string) {
    const cmd = `${getCopilotCommand()} suggest "${escapePrompt(prompt)}"`;
    const result = child_process.execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.trim();
  },
  async explain(prompt: string) {
    const cmd = `${getCopilotCommand()} explain "${escapePrompt(prompt)}"`;
    const result = child_process.execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.trim();
  }
};
