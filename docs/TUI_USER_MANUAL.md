# idea2repo — TUI User Manual

This short manual explains how to run the CLI and access the interactive terminal UI (TUI) for generating projects, initializing interactive sessions, and chatting about a generated project.

## Prerequisites

- Node.js 16+ and npm installed
- TypeScript (installed via `npm install`)
- (Optional but recommended) **GitHub Copilot CLI** for enhanced AI reasoning:
  - Install standalone: https://github.com/github/copilot-cli
  - Or: `brew install gh-copilot` / `winget install GitHub.Copilot`
  - Authenticate: Run `copilot -i "/login"` to authenticate with GitHub
  - Without Copilot CLI, the tool uses an intelligent offline backend with excellent fallback suggestions

## Install / Run options

1) Run directly from source (recommended for development)

```bash
# install deps once
npm install

# run the CLI from TypeScript sources (uses ts-node)
ts-node bin/idea2repo.ts
```

Examples:

```bash
# Start the interactive setup (TUI)
ts-node bin/idea2repo.ts init

# Generate quickly from an idea (non-interactive if idea is provided)
ts-node bin/idea2repo.ts generate "AI expense tracker for freelancers"
```

2) Build and run the packaged CLI

```bash
npm run build
node dist/bin/idea2repo.js
```

Example:

```bash
npm run build
node dist/bin/idea2repo.js generate "Marketplace for verified land listings" -o ./out
```

3) Global install (optional)

```bash
# Publish/install globally (if package is published) or use local link
npm install -g idea2repo

# then run
idea2repo init
```

## Accessing the TUI (interactive mode)

The TUI is provided by the interactive commands. Use one of the following commands to enter interactive mode:

- `init` — guided, step-by-step project creation (prompts for name, app type, stack, auth, database, etc.)
- `chat` — interactive conversation about a generated project
- `generate` (without an idea or with `--interactive`) — run prompts instead of passing a one-line idea

Examples:

```bash
# Guided project creation
ts-node bin/idea2repo.ts init

# Chat about a project (opens TUI session)
ts-node bin/idea2repo.ts chat "My sample app"

# Force interactive prompts for generate (if supported)
ts-node bin/idea2repo.ts generate --interactive
```

### Typical prompt controls

- Use the arrow keys to move between list options
- Press Enter to confirm / submit text input
- Press Space to toggle checkboxes or selects
- Press Esc or Ctrl+C to cancel/exit at any time

These are standard controls for `inquirer`/`prompts` style TUIs used in the codebase.

## Non-interactive usage (scripts / CI)

You can script generation by providing arguments/flags on the command line:

```bash
# Provide idea and output path
ts-node bin/idea2repo.ts generate "Expense tracker for freelancers" --out ./my-app

# Example: set language and include team docs
ts-node bin/idea2repo.ts generate "API for invoices" --lang node --team
```

## Troubleshooting

### TypeScript Compilation Errors

If you see "Could not find a declaration file for module 'gradient-string'":
- This has been fixed in the latest version
- Run `npm install` to ensure all dependencies are installed

### Copilot CLI Setup

If the CLI doesn't use GitHub Copilot CLI for suggestions:
- Install standalone Copilot CLI: https://github.com/github/copilot-cli
- Authenticate: `copilot -i "/login"`
- The tool will automatically fall back to intelligent offline mode if Copilot CLI is unavailable

**Note:** The deprecated `gh copilot` extension is no longer supported. Use the standalone `copilot` CLI instead.

- If `ts-node` commands fail due to missing `ts-node`, run `npm install` to install dev dependencies.
- For permission errors during global install, use `sudo` or prefer local dev workflow above.

## Examples (Quick Walkthrough)

1. Setup and create a project interactively:

```bash
# Install dependencies once
npm install

# (Optional) Activate GitHub Copilot CLI for enhanced AI reasoning
copilot -i "/login"  # Only needed once

# Start interactive guided project creation
ts-node bin/idea2repo.ts init

# Follow prompts: project name, app type, stack, auth? database?
```

2. Generate from a single-line idea, then inspect and run:

```bash
ts-node bin/idea2repo.ts generate "Marketplace for verified land listings in Kenya" --out ./kenya-marketplace
ls ./kenya-marketplace

cd ./kenya-marketplace
npm install
npm run dev
```

## Architecture & Reasoning Backend

**How idea2repo thinks:**

The tool uses a pluggable **reasoning backend** for AI suggestions with advanced features:

1. **Copilot CLI Backend** (if available): Uses GitHub's Copilot CLI for real-time AI reasoning
   - Provides context-aware architecture suggestions
   - Explains architectural decisions
   - Configurable timeout and retries (see environment variables)
   - Automatic circuit-breaker to prevent failures from cascading

2. **Offline Backend** (always available): Smart rule-based suggestions
   - Detects project type (AI/ML, Web, Mobile, Backend)
   - Generates domain-specific architecture
   - No network required, always works
   - Serves as automatic fallback if Copilot CLI is unavailable

3. **Caching & Performance**: 
   - Results are cached locally in `.idea2repo/reasoning-cache.json` using SHA1 hashes of prompts
   - Repeated requests for the same idea use cached results, avoiding re-querying Copilot
   - Circuit-breaker state persisted in `.idea2repo/circuit-breaker.json`

The tool automatically falls back to offline mode if Copilot CLI is unavailable. **You don't need Copilot CLI to use idea2repo—it just enhances the experience.**

### Environment Variables for Hardening

Control Copilot CLI behavior with these environment variables:

```bash
# CLI invocation and availability
export COPILOT_CLI_CMD="copilot"  # Command to invoke the CLI (default: "copilot")
export REASONING_BACKEND="offline"  # Force backend: "offline" or unset for auto-select

# Timeout and retries
export COPILOT_CLI_TIMEOUT_MS="15000"  # Timeout per call in milliseconds (default: 15000)
export COPILOT_CLI_RETRIES="2"  # Max retry attempts after failure (default: 2)

# Debugging
export VERBOSE_REASONING="1"  # Enable debug logs for reasoning backend failures
```

### CLI Flags for Scaffolding

Enhanced command-line options:

```bash
# Dry-run and preview mode
ts-node bin/idea2repo.ts generate "Your idea" --dry-run

# Specify language
ts-node bin/idea2repo.ts generate "Your idea" --lang python

# Team mode
ts-node bin/idea2repo.ts generate "Your idea" --team

# Output directory
ts-node bin/idea2repo.ts generate "Your idea" --out ./my-app
```

### Generated Files & Structure

**Database Support**

idea2repo now generates starter database schemas tailored to your choice:

- **PostgreSQL**: `migrations/001_init.sql` (SQL), `prisma/schema.prisma` (for Node.js/TypeScript)
- **MySQL**: `migrations/001_init.sql` (SQL), `prisma/schema.prisma`
- **SQLite**: `migrations/001_init.sql` (SQL)
- **MongoDB**: `models/index.ts` (Mongoose, Node.js) or `models.py` (Python)

**Language-Specific Scaffolds**

- **Node.js/TypeScript**: Complete src/, package.json, tsconfig.json, Jest tests, GitHub Actions CI
- **Python**: src/, requirements.txt, pyproject.toml, pytest tests, GitHub Actions CI
- **Go**: cmd/, go.mod, tests, GitHub Actions CI
- **Rust**: src/, Cargo.toml, GitHub Actions CI

**CI/CD Templates**

GitHub Actions workflows are auto-generated based on your language:

- `.github/workflows/node.yml` — Node.js matrix build (18.x, 20.x)
- `.github/workflows/python.yml` — Python matrix build (3.10, 3.11)
- `.github/workflows/go.yml` — Go matrix build (1.21, 1.22)
- `.github/workflows/rust.yml` — Rust stable build

**Starter Tests**

Each project includes runnable test stubs:

- Node.js: `tests/main.test.ts` with Jest examples
- Python: `tests/test_main.py` with pytest examples
- Go: `tests/main_test.go` with `testing` package examples

## Advanced: Running Tests

```bash
# Run all unit tests
npm test

# Run e2e tests only
npm run test:e2e

# Run tests with coverage
npm test -- --coverage
```

### CI/CD Setup

For GitHub, the generated `.github/workflows/*.yml` files are ready to use:

1. Commit and push your generated repo to GitHub
2. GitHub Actions will automatically run tests on every push/PR
3. Tests use offline reasoning backend to avoid Copilot CLI dependency in CI

To use Copilot CLI in CI, install it in your workflow:

```yaml
- run: |
    # Install Copilot CLI (example)
    brew install gh-copilot
    gh-copilot --login
```

Or set `REASONING_BACKEND=offline` in CI for deterministic behavior without external dependencies.

## Where to look next

- CLI command routing: [src/cli/commandRouter.ts](../../src/cli/commandRouter.ts)
- Interactive flows & prompts: [src/commands/](../../src/commands/)
- Reasoning backend: [src/reasoning/](../../src/reasoning/)
- Copilot integration: [src/copilot/](../../src/copilot/)
