# idea2repo: From Idea to Repository in Seconds

**Transform a plain-English product idea into a fully structured, ready-to-start software repository—powered by intelligent AI reasoning.**

Instead of staring at a blank folder wondering "Where do I start?", describe your idea and let `idea2repo` generate:

- ✨ A sensible, opinionated project structure
- 📝 A clear, realistic README
- 🏗️ Architecture and roadmap documentation
- ✅ Actionable MVP TODOs  
- 🤔 Explainable architectural decisions
- **🚀 Works online OR offline** —with optional GitHub Copilot CLI for enhanced reasoning

## The Problem

Starting a new software project is deceptively hard. Developers struggle with:

- **Structure decisions**: "How should I organize the code?"
- **Documentation paralysis**: "How do I write a README before code exists?"
- **Task breakdown**: "What's actually the MVP?"
- **Architecture alignment**: "Does this structure match what I'm building?"

This often leads to over-engineering, poor documentation, stalled side projects, and wasted setup time.

## The Solution

```bash
idea2repo "AI-powered expense tracker for freelancers"
```

That's it. The CLI:

1. **Understands** your idea (normalizes intent, detects domain and risk)
2. **Reasons** intelligently:
   - With GitHub Copilot CLI: Real-time AI-powered architectural reasoning
   - Without: Smart rule-based suggestions (always available)
3. **Generates** a complete repo scaffold (files, docs, tasks)

All decisions are **explainable**—ask the CLI "why did you choose PostgreSQL?" and it tells you.

## Core Philosophy

- **Ideas first, files second**: Start with intention, not blank templates
- **Opinionated but editable**: Strong defaults that you can remix
- **Explainable decisions**: Every architectural choice is traceable and justified
- **Works everywhere**: Intelligent offline mode + optional AI enhancement with Copilot CLI
- **Smart reasoning**: AI-powered when available, always sensible as fallback

## Usage

### Basic: Single-Line Idea

```bash
idea2repo generate "Marketplace for verified land listings in Kenya"
```

### Interactive: Step-by-Step Setup

```bash
idea2repo init
```

Prompts for:
- Project name
- App type (web app / API / CLI / library)
- Stack preference (or auto-detect)
- Auth required?
- Database required?
- Team size

## What Gets Generated

### Folder Structure

A tailored, maintainable structure based on your idea:

```
my-project/
├─ README.md              (auto-generated, ready to edit)
├─ package.json           (Node.js setup)
├─ tsconfig.json          (TypeScript config)
├─ src/
│  ├─ cli/                (command routing)
│  ├─ core/               (business logic)
│  ├─ services/           (external integrations)
│  ├─ utils/              (helpers)
│  └─ index.ts
├─ docs/
│  ├─ architecture.md     (design rationale from Copilot)
│  ├─ roadmap.md          (phased feature plan)
│  └─ decisions.md        (architectural decisions record)
└─ TODO.md               (actionable MVP tasks)
```

### Generated Files

- **README.md**: Problem statement, core features, tech stack, local setup
- **architecture.md**: Why these tools? What's the design pattern?
- **roadmap.md**: Phase 1 (MVP), Phase 2, Phase 3 roadmap
- **TODO.md**: Specific, actionable tasks for implementation
- **package.json**: Dependencies inferred from stack choice

## Dual-Backend Reasoning

The tool uses a **smart fallback system**:

### With GitHub Copilot CLI (Enhanced Mode)
```bash
copilot -p "Design a clean, opinionated repository structure for this marketplace..."
```
- ✅ Real AI-powered architectural reasoning
- ✅ Context-aware decisions for your specific idea
- ✅ Capture why Copilot suggested each choice
- ✅ Fast: 5-second timeout ensures responsiveness

### Without Copilot CLI (Always-On Mode)
- ✅ Intelligent rule-based suggestions (no network needed)
- ✅ Domain detection: AI/ML, Web, Mobile, Backend
- ✅ Sensible defaults that work for most projects
- ✅ Zero dependencies beyond Node.js

**The tool automatically upgrades to AI when Copilot CLI is available, but always works offline.**

## Installation & Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- (Optional) **GitHub Copilot CLI** for enhanced AI reasoning:
  - Install: https://github.com/github/copilot-cli
  - Authenticate: `copilot -i "/login"` (one-time setup)
  - The tool works perfectly without it!

### Install & Quick Start

**Option 1: Run from source (recommended for development)**

```bash
npm install
npm run dev -- generate "Your app idea here"
```

**Option 2: Build and run with Node**

```bash
npm install
npm run build
node dist/bin/idea2repo.js generate "Your app idea here"
```

**Option 3: Interactive setup**

```bash
npm run dev -- init  # or npm run build && node dist/bin/idea2repo.js init
```

## Development

```bash
# Install dependencies
npm install

# Run tests (with coverage)
npm test

# Build TypeScript
npm run build

# Run locally
npm run start -- generate "idea here"

# Lint
npm run lint
```

### Local development (fast)

You can run the CLI directly from TypeScript sources using `ts-node`:

```bash
# Install dev dependencies once
npm install

# Run the CLI directly (no build)
npm run dev -- generate "Your idea here"
```

## Project Structure

- **src/cli/**: Command routing and help
- **src/core/**: Idea normalization, project classification, decision model
- **src/reasoning/**: Pluggable backend system (Copilot CLI + offline mode)
  - `backends/copilotCliBackend.ts`: Standalone Copilot CLI integration
  - `backends/offlineBackend.ts`: Smart rule-based fallback
- **src/scaffold/**: File generation and project structure building
- **src/commands/**: generate, init, explain, chat subcommands
- **tests/**: Jest test suites
- **docs/**: Architecture, features, examples, and user guides

## Test Coverage

```
Overall: 83% statement coverage
- copilot integration: 85%
- core logic: 100%
- explainability: 100%
- utils: 40%

All 8 tests passing ✅
```

## Examples

See [examples/](examples/) for complete walkthroughs:
- [Kenya Land Marketplace](examples/kenya-land-marketplace.md)
- [Expense Tracker](examples/expense-tracker.md)
- [CLI Tool](examples/cli-tool.md)

## Limitations & Future Work

See [docs/limitations.md](docs/limitations.md) for known constraints.

## License

MIT

---

**Built with GitHub Copilot CLI during the GitHub Copilot CLI Challenge 2026**
