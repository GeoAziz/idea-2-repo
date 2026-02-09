export type ReasoningBackend = {
  name: string;
  suggest: (prompt: string) => Promise<string>;
  explain: (prompt: string) => Promise<string>;
};
