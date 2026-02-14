# Copilot Instructions for idea2repo

## Project Overview

`idea2repo` is a CLI tool that transforms plain-English product ideas into fully structured repositories. It uses a pluggable reasoning backend system that integrates with GitHub Copilot CLI (enhanced mode) or falls back to intelligent offline suggestions.

## Build, Test, and Lint

```bash
# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Development (run without building)
npm run dev -- generate "your idea"

# Tests
npm test                # Run all tests with coverage
npm run test:e2e        # E2E tests only
jest path/to/test.ts    # Single test file

# Lint
npm run lint
```

**Environment variables for testing:**
- `REASONING_BACKEND=offline` - Force offline backend (default in CI)
- `VERBOSE_REASONING=1` - Debug reasoning system logs
- `COPILOT_CLI_TIMEOUT_MS=15000` - Copilot CLI timeout (default: 15s)
- `COPILOT_CLI_RETRIES=2` - Retry attempts (default: 2)

## Architecture

### Dual-Backend Reasoning System

The core architectural pattern is a **pluggable reasoning backend** with automatic fallback:

1. **Copilot CLI Backend** (`src/reasoning/backends/copilotCliBackend.ts`)
   - Uses standalone `copilot` command (not deprecated `gh copilot`)
   - Async execution with configurable timeout and retries
   - Circuit breaker pattern: trips after 3 failures, auto-resets after 60s
   - Caches responses in `.idea2repo/reasoning-cache.json` (SHA-1 hashed prompts)

2. **Offline Backend** (`src/reasoning/backends/offlineBackend.ts`)
   - Domain-aware rule-based suggestions (AI/ML, Web, Mobile, Backend)
   - Always available, zero network dependencies
   - Acts as automatic fallback when Copilot CLI fails/unavailable

3. **Reasoning Coordinator** (`src/reasoning/index.ts`)
   - Selects backend via `REASONING_BACKEND` env var
   - Implements fallback strategy: try selected backend → offline on failure
   - Provides `suggest()` and `explain()` functions with caching

### Data Flow

```
User Idea
  → Normalize (src/core/ideaNormalizer.ts)
  → Classify (src/core/projectClassifier.ts)
  → Risk Assessment (src/core/riskAssessment.ts)
  → Reasoning Backend (suggest architecture)
  → Scaffold Generator (src/scaffold/scaffoldGenerator.ts)
  → File Writer + Git Init
```

### Key Components

- **CLI Layer** (`src/cli/`): Command routing and help
- **Commands** (`src/commands/`): `generate`, `init`, `explain`, `migrate`, `chat`, `use`, `examples`
- **Core** (`src/core/`): Idea normalization, project classification, risk assessment, decision model
- **Reasoning** (`src/reasoning/`): Backend abstraction, caching, circuit breaker
- **Scaffold** (`src/scaffold/`): Structure building, template registry, file writing
- **Templates** (`src/templates/`): Risk-based doc templates (low/medium/high/critical)

## Key Conventions

### Risk-Driven Template Selection

Projects are assessed for risk factors (payments, PII, health data, etc.) and assigned a risk level:
- **LOW**: Basic quick-start docs
- **MEDIUM**: Deployment checklist + monitoring setup
- **HIGH/CRITICAL**: Security checklist, compliance docs, incident response, data privacy policies

See `src/core/riskAssessment.ts` for scoring algorithm (payments: +25, health data: +30, etc.)

### Decision Traceability

All architectural decisions are captured in a `ReasoningSession` and written to `docs/decisions.md` for explainability. The system records:
- Original idea
- Normalized intent
- Copilot prompt and response
- Final decisions made

### Project Classification

Complexity scoring based on keywords:
- `real-time|stream|chat`: +2
- `marketplace|payments|billing`: +2
- `ai|ml|recommendation`: +1
- `multi-tenant|enterprise`: +2
- `offline|sync|mobile`: +1

Result: `mvp` (<2), `medium` (2-3), `high` (4+)

### Circuit Breaker Pattern

`src/utils/retry.ts` implements a circuit breaker for Copilot CLI:
- Tracks consecutive failures
- Trips after threshold (default: 3 failures)
- Auto-resets after cooldown (default: 60s)
- Persists state to `.idea2repo/circuit-breaker.json`

Prevents repeated failing calls to Copilot CLI when it's unavailable.

### Caching Strategy

Reasoning responses are cached by SHA-1 hash of the prompt:
- Cache file: `.idea2repo/reasoning-cache.json`
- Persists across CLI invocations
- First run: 15-20s (Copilot calls)
- Subsequent similar ideas: instant (cache hit)

### TypeScript Strict Mode

The project uses TypeScript strict mode with:
- `target: ES2020`
- `module: CommonJS` (for Node.js compatibility)
- Output to `dist/` (declaration files included)

## Important Patterns

### Backend Selection

```typescript
// In src/reasoning/index.ts
function selectedBackend(): ReasoningBackend {
  const choice = process.env.REASONING_BACKEND?.toLowerCase();
  if (choice === 'offline') return offlineBackend;
  return copilotCliBackend;
}
```

Always check `REASONING_BACKEND` env var before assuming Copilot CLI is used.

### Error Handling with Fallback

```typescript
async function withFallback<T>(fn, prompt) {
  const backend = selectedBackend();
  try {
    return await fn(backend);
  } catch (error) {
    logger.warn(`${backend.name} failed, using offline reasoning.`);
    return fn(offlineBackend);
  }
}
```

All reasoning calls automatically degrade to offline mode on failure.

### Template Registration

Templates are registered in `src/scaffold/templateRegistry.ts` based on risk level. When adding new risk-based templates, update `src/templates/{low,medium,high}-risk/` and register in the template registry.

## Testing Patterns

- **Unit tests**: Mock the reasoning backend to avoid actual Copilot CLI calls
- **E2E tests**: Use `REASONING_BACKEND=offline` to test full workflow without external dependencies
- **Copilot integration tests**: Test in `tests/copilot.test.ts` with actual CLI (requires `copilot` installed)

## Generated Output Structure

Generated projects follow this pattern:
```
project-name/
├── README.md              (auto-generated)
├── package.json           (inferred deps)
├── tsconfig.json
├── src/                   (structure based on kind: cli/api/web/library)
├── docs/
│   ├── architecture.md    (Copilot reasoning)
│   ├── roadmap.md         (phased plan)
│   ├── decisions.md       (decision log)
│   └── [risk-based docs]  (security/compliance if needed)
└── TODO.md               (actionable MVP tasks)
```

## Development Notes

- The tool generates demo projects in `Demo/`, `trax/`, `Marketplace for verified land listings in Kenya/`, etc. These are examples of generated output, not core source code.
- Config is stored in `~/.idea2repo/config.json` (managed by `src/config/configManager.ts`)
- The CLI entry point is `bin/idea2repo.ts` → `src/index.ts` → `src/cli/commandRouter.ts`
