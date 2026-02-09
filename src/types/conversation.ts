export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  projectIdea: string;
  messages: ConversationMessage[];
  generatedStructure?: unknown;
  decisions?: Record<string, string>;
}

export interface ChatOptions {
  projectPath?: string;
  loadExisting?: boolean;
  verbose?: boolean;
}
