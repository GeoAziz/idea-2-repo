import * as fs from 'fs';
import * as path from 'path';
import { ConversationContext, ConversationMessage } from '../types/conversation';
import { CopilotClient } from './copilotClient';

export class ConversationManager {
  private context: ConversationContext;
  private copilotClient: CopilotClient;
  private conversationFile: string;

  constructor(projectIdea: string, projectPath?: string) {
    this.context = {
      projectIdea,
      messages: []
    };
    this.copilotClient = new CopilotClient();
    this.conversationFile = projectPath
      ? path.join(projectPath, '.idea2repo', 'conversation.json')
      : '.idea2repo-conversation.json';
  }

  async loadConversation(): Promise<boolean> {
    try {
      if (fs.existsSync(this.conversationFile)) {
        const data = fs.readFileSync(this.conversationFile, 'utf-8');
        this.context = JSON.parse(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return false;
    }
  }

  async saveConversation(): Promise<void> {
    const dir = path.dirname(this.conversationFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.conversationFile, JSON.stringify(this.context, null, 2));
  }

  addSystemContext(decisions: Record<string, string>, structure: unknown): void {
    this.context.decisions = decisions;
    this.context.generatedStructure = structure;

    const systemMessage: ConversationMessage = {
      role: 'system',
      content: `Project context:
Idea: ${this.context.projectIdea}
Decisions made: ${JSON.stringify(decisions, null, 2)}
Structure: ${JSON.stringify(structure, null, 2)}`,
      timestamp: new Date()
    };

    this.context.messages.push(systemMessage);
  }

  async ask(question: string): Promise<string> {
    const userMessage: ConversationMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    this.context.messages.push(userMessage);

    const prompt = this.buildContextualPrompt(question);
    const response = await this.copilotClient.suggest(prompt);

    const assistantMessage: ConversationMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    this.context.messages.push(assistantMessage);

    await this.saveConversation();

    return response;
  }

  private buildContextualPrompt(question: string): string {
    const recentMessages = this.context.messages.slice(-5);

    let prompt = `You are helping with a software project.

Project Idea: ${this.context.projectIdea}

`;

    if (this.context.decisions) {
      prompt += `Decisions already made:\n${JSON.stringify(this.context.decisions, null, 2)}\n\n`;
    }

    if (recentMessages.length > 0) {
      prompt += 'Recent conversation:\n';
      recentMessages.forEach((msg) => {
        if (msg.role !== 'system') {
          prompt += `${msg.role}: ${msg.content}\n`;
        }
      });
      prompt += '\n';
    }

    prompt += `Current question: ${question}\n\nProvide a clear, actionable answer.`;

    return prompt;
  }

  getHistory(): ConversationMessage[] {
    return this.context.messages.filter((msg) => msg.role !== 'system');
  }

  clearHistory(): void {
    this.context.messages = [];
  }
}
