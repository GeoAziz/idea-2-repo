# How GitHub Copilot CLI Powers idea2repo

This document explains how GitHub Copilot CLI is integrated into `idea2repo` to provide intelligent architectural reasoning and code generation.

## Setup

idea2repo works with or without GitHub Copilot CLI:

- **With Copilot CLI** (enhanced): Install standalone from https://github.com/github/copilot-cli, then authenticate: `copilot -i "/login"`
- **Without Copilot CLI** (always works): Uses intelligent offline backend with domain-aware suggestions

## Core Integration Points

### 1. Reasoning Backend (`src/reasoning`)

Copilot is treated as a **pluggable reasoning backend**, not a hard-coded dependency. The system includes:

#### Copilot CLI Backend (`src/reasoning/backends/copilotCliBackend.ts`)

Uses the standalone Copilot CLI command with structured prompts:

```typescript
// Uses standalone 'copilot' command (not deprecated 'gh copilot' extension)
const cmd = `copilot -p "${escapePrompt(prompt)}" --allow-all`;
const result = execSync(cmd, { 
  encoding: 'utf8', 
  timeout: 5000  // Fast timeout - fail over to offline if slow
});
```

**Key improvements:**
- Uses standalone `copilot` CLI (not `gh copilot` extension)
- Uses `-p` flag for structured prompt input
- Includes `--allow-all` for non-interactive mode
- 5-second timeout for responsive fallback to offline backend

#### Offline Backend (`src/reasoning/backends/offlineBackend.ts`)

Provides intelligent rule-based suggestions that work without any API calls:

```typescript
// Detects: AI/ML, Web, Mobile, Backend projects
// Returns domain-specific architecture suggestions
if (prompt.includes('ai') || prompt.includes('ml')) {
  return `Suggested AI/ML architecture:
- src/models/: ML models and inference
- src/features/: Feature engineering
- src/services/: API and business logic
- requirements.txt: Python dependencies`;
}
// Similar patterns for Web, Mobile, Backend
```

### 2. Fallback Strategy (`src/reasoning/index.ts`)

The reasoning system automatically attempts Copilot CLI first, then falls back:

```typescript
async function withFallback<T>(fn, prompt) {
  const backend = selectedBackend();
  try {
    return await fn(backend);  // Try Copilot CLI first
  } catch (error) {
    logger.warn(`${backend.name} backend failed, falling back to offline.`);
    return fn(offlineBackend);  // Always available fallback
  }
}
```

**Benefits:**
- ✅ Works offline with intelligent suggestions
- ✅ Upgrades to AI when Copilot CLI is available
- ✅ Fast failover (5-second timeout)
- ✅ No blocking on network latency

### 2. The Generate Workflow (`src/commands/generate.ts`)

Here's how Copilot CLI fits into the full pipeline:

```typescript
// 1. User provides an idea
const idea = "Marketplace for verified land listings in Kenya";

// 2. Normalize the idea into structured intent
const normalized = normalize(idea);
// → { problem: "...", domain: "real estate", appType: "marketplace", ... }

// 3. Classify the project
const classification = classify(idea);
// → { kind: "web", complexity: "medium", ... }

// 4. NOW: Delegate reasoning to GitHub Copilot CLI
const copilotPrompt = `Design a clean, opinionated repository structure for this ${normalized.appType}: ${normalized.problem}. Prioritize MVP speed and clarity. Explain rationale.`;

const copilotSuggestion = await suggest(copilotPrompt);
// → Copilot returns structured recommendations

// 5. Build the actual repository structure using Copilot's guidance
const structure = buildStructure({
  idea,
  normalized,
  classification,
  copilotInput: copilotPrompt,
  copilotOutput: copilotSuggestion  // Captured for explainability
});
```

### 3. Prompts (`src/copilot/prompts.ts`)

All Copilot CLI interactions use carefully crafted prompts that:

- **Include context**: domain, risk level, team size, timeline
- **Request explainability**: "Explain your choices"
- **Guide toward MVP thinking**: "Prioritize MVP speed"
- **Ask for tradeoffs**: "What are alternatives and why this choice?"

Example prompt structure:

```
You are designing a repository scaffold for a new project.

Project Type: {appType}
Domain: {domain}
Problem: {problem}

Requirements:
1. Generate a sensible folder structure
2. Recommend tech stack (prioritize MVP speed)
3. Propose which parts are core, which are optional
4. Explain each choice and consider alternatives

Output should be clear, opinionated, and ready to implement.
```

## Why This Approach?

### 1. Real Reasoning, Not Templates

Instead of matching keywords to templates, Copilot CLI actually reasons about:
- Domain expertise ("marketplaces need search and filters")
- Team dynamics ("solo dev benefits from simple structure")
- Tech tradeoffs ("Postgres for data integrity, not Firebase for speed")

### 2. Explainability Built-In

Every generated repo includes:
- **decisions.md**: Why we chose this stack
- **architecture.md**: How Copilot suggested this structure
- **roadmap.md**: Phased approach justified by complexity

Users can ask "why PostgreSQL?" and get a real answer, not a guess.

### 3. Context Preservation

The reasoning session captures:
```typescript
interface ReasoningSession {
  input: string;                // Original idea
  normalized: NormalizedIdea;
  classification: Classification;
  copilotPrompt: string;        // What we asked Copilot
  copilotOutput: string;        // What Copilot suggested
  decisions: Decision[];        // Final choices made
  timestamp: Date;
}
```

This enables future commands like:
- `idea2repo explain "why this structure?"`
- `idea2repo adjust "add GraphQL to the tech stack"`

## Graceful Degradation

If GitHub Copilot CLI is not installed or unavailable:

```typescript
logger.warn('GitHub Copilot CLI not available. Using offline suggestion.');
return fallbackSuggest(prompt);
```

Fallback suggestions are reasonable defaults based on the project type, ensuring the tool works even without Copilot CLI, but with less intelligence.

## Testing Copilot Integration

To test locally:

```bash
# Ensure gh CLI and copilot extension are installed
${COPILOT_CLI_CMD:-gh copilot} --version

# Run the tool with debug logging
DEBUG=* npm run start -- generate "Your idea here"

# Check the reasoning session for what Copilot was asked
npm test -- copilot.test.ts
```

## Future Enhancements

1. **Interactive sessions**: Keep Copilot context alive for follow-up questions
2. **Decision review**: Show alternative architectures Copilot considered
3. **Learning loop**: Capture what decisions worked well, inform future suggestions
4. **Team-aware**: Ask Copilot to optimize for team size and experience level

## Conclusion

GitHub Copilot CLI transforms `idea2repo` from a template matcher into an **intelligent architectural co-founder**. Every repo is reasoned from first principles, not looked up in a database.
