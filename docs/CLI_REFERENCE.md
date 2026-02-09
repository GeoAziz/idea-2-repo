# CLI Reference

## Commands

### generate
Generate a new project from an idea.

Usage:
```
idea2repo generate "<idea>" [--out <path>] [--team] [--lang <language>]
```

Options:
- `--out`, `-o`: Output directory (default: current directory with project name)
- `--team`: Include team handoff and collaboration docs  
- `--lang`, `-l`: Language (`node`, `python`, `go`, `rust`)

**Modes:**
- **With GitHub Copilot CLI** (if installed): AI-powered suggestions
- **Without Copilot CLI**: Intelligent offline mode

### chat
Interactive conversation about a generated project.

Usage:
```
idea2repo chat "<idea>" [--load] [--clear]
```

### explain
Explain decisions for a generated project.

Usage:
```
idea2repo explain [--path <project>] [question]
```

### migrate
Scan an existing project and propose a migration plan.

Usage:
```
idea2repo migrate <path> [--restructure]
```

### examples
List curated example projects.

Usage:
```
idea2repo examples
```

### use
Generate from a curated example.

Usage:
```
idea2repo use <number>
```

### config
Manage defaults and preferences.

Usage:
```
idea2repo config show
idea2repo config set <key> <value>
idea2repo config reset
idea2repo config edit
```

---

## Reasoning Backends

### Copilot CLI Backend (Enhanced)
- ✅ Real-time AI-powered architecture suggestions
- 📦 Install: https://github.com/github/copilot-cli
- 🔐 Setup: `copilot -i "/login"` (one-time authentication)
- ⏱️ Timeout: 5 seconds (fast fallback if slow)

### Offline Backend (Always-On)
- ✅ Zero dependencies, no network required
- 🎯 Domain-aware: Detects AI/ML, Web, Mobile, Backend
- ⚡ Instant results with sensible defaults
- 🔄 Auto-activated if Copilot CLI unavailable

**Force offline mode:**
```bash
REASONING_BACKEND=offline npm run dev -- generate "Your idea"
```

---

## Quick Examples

```bash
npm run dev -- generate "AI expense tracker"
npm run dev -- init
REASONING_BACKEND=offline npm run dev -- generate "Your idea"
npm run dev -- chat my-project-name
```
