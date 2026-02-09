import { ReasoningBackend } from '../types';

function fallbackSuggest(prompt: string): string {
  if (prompt.includes('structure') || prompt.includes('folder')) {
    return `Suggested structure:\n- src/: TypeScript source code\n- tests/: Test suites\n- docs/: Documentation\n- package.json: Node dependencies`;
  }
  return 'Offline suggestion: Consider using Node + TypeScript for multi-platform CLI tools.';
}

function fallbackExplain(_prompt: string): string {
  return `Explanation (offline mode): This architecture prioritizes:\n1. Clarity: Simple, obvious module boundaries\n2. Testability: Each module has one responsibility\n3. Explainability: All decisions are traceable and documented`;
}

export const offlineBackend: ReasoningBackend = {
  name: 'offline',
  async suggest(prompt: string) {
    return fallbackSuggest(prompt);
  },
  async explain(prompt: string) {
    return fallbackExplain(prompt);
  }
};
