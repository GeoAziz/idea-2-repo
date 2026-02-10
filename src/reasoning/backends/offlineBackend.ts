import { ReasoningBackend } from '../types';

function fallbackSuggest(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  // Detect AI/ML projects
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine learning') || lower.includes('habit') || lower.includes('tracker')) {
    return `Suggested architecture for AI/ML project:
- src/
  - models/: ML models and inference logic
  - features/: Feature engineering and data processing
  - services/: API and business logic
  - utils/: Helper utilities
- api/: REST API endpoints
- tests/: Unit and integration tests
- docs/: Documentation and model cards
- requirements.txt: Python dependencies
- docker-compose.yml: Containerized setup`;
  }
  
  // Detect web projects
  if (lower.includes('web') || lower.includes('app') || lower.includes('dashboard') || lower.includes('saas')) {
    return `Suggested web app structure:
- src/
  - components/: React/Vue components
  - pages/: Page components
  - services/: API clients and business logic
  - hooks/: Custom React hooks
  - utils/: Helper functions
  - styles/: CSS/SCSS files
- tests/: Test suites
- public/: Static assets
- package.json: Dependencies
- README.md: Documentation`;
  }
  
  // Detect mobile projects
  if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) {
    return `Suggested mobile app structure:
- src/
  - screens/: Screens/Views
  - components/: Reusable components
  - navigation/: Navigation setup
  - services/: API and authentication
  - store/: State management
  - utils/: Helper functions
- assets/: Images and resources
- tests/: Test files`;
  }
  
  // Detect backend/API projects
  if (lower.includes('api') || lower.includes('backend') || lower.includes('server') || lower.includes('database')) {
    return `Suggested backend structure:
- src/
  - routes/: API endpoints
  - controllers/: Business logic
  - models/: Database models
  - middleware/: Request processing
  - services/: External services
  - utils/: Helper functions
- tests/: Test suites
- migrations/: Database migrations
- .env.example: Environment variables template`;
  }
  
  // Default suggestion for structure prompts
  if (lower.includes('structure') || lower.includes('folder') || lower.includes('scaffold')) {
    return `Suggested structure:
- src/: Source code
- tests/: Test suites
- docs/: Documentation
- .gitignore: Git ignore file
- README.md: Project readme
- package.json: Dependencies (Node)
- tsconfig.json: TypeScript config`;
  }

  return `Offline suggestion:
Consider starting with a clear README, a src/ directory for implementation,
and a tests/ folder for automated checks. Add docs/ for longer-form
documentation and a config file (package.json, pyproject.toml, or similar)
appropriate for your stack.`;
}

function fallbackExplain(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('architecture') || lower.includes('structure')) {
    return `Architecture explanation:
This structure follows these principles:
1. Separation of Concerns: Each module has a specific responsibility
2. Scalability: Easy to add new features and modules
3. Testability: Clear boundaries make unit testing straightforward
4. Maintainability: Organized structure helps team collaboration
5. Type Safety: TypeScript provides compile-time type checking`;
  }
  
  return `Explanation (offline mode):
The suggested architecture prioritizes:
• Clarity: Simple, obvious module boundaries
• Testability: Each module has one responsibility
• Maintainability: Clear structure for team collaboration
• Scalability: Easy to extend without major refactors
• Explainability: Design decisions are traceable`;
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
