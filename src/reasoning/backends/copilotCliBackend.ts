import * as child_process from 'child_process';
import { ReasoningBackend } from '../types';

function getCopilotCommand() {
  return process.env.COPILOT_CLI_CMD ?? 'copilot';
}

function escapePrompt(prompt: string) {
  // Escape special characters for shell
  return prompt.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
}

/**
 * Attempts to use GitHub Copilot CLI for AI-powered suggestions.
 * Falls back gracefully if copilot CLI is not available or times out.
 * 
 * Note: The standalone copilot CLI currently requires an interactive session.
 * For script-based usage, consider using:
 * - GitHub Copilot Pro API (if available)
 * - Direct API integration via OpenAI GPT models
 * - GitHub Copilot Chat integration for VS Code
 */
export const copilotCliBackend: ReasoningBackend = {
  name: 'copilot-cli',
  async suggest(prompt: string) {
    try {
      const cmd = `${getCopilotCommand()} -p "${escapePrompt(prompt)}" --allow-all 2>&1`;
      
      const result = child_process.execSync(cmd, { 
        encoding: 'utf8', 
        timeout: 15000,  // 15 seconds (up from 5) to give Copilot CLI more time
        maxBuffer: 5 * 1024 * 1024
      });
      
      if (result && result.trim().length > 0) {
        return result.trim();
      }
      throw new Error('Empty response');
    } catch (error: any) {
      throw error;
    }
  },
  
  async explain(prompt: string) {
    try {
      const cmd = `${getCopilotCommand()} -p "${escapePrompt(prompt)}" --allow-all 2>&1`;
      
      const result = child_process.execSync(cmd, { 
        encoding: 'utf8', 
        timeout: 15000,  // 15 seconds (up from 5) to give Copilot CLI more time
        maxBuffer: 5 * 1024 * 1024
      });
      
      if (result && result.trim().length > 0) {
        return result.trim();
      }
      throw new Error('Empty response');
    } catch (error: any) {
      throw error;
    }
  }
};
