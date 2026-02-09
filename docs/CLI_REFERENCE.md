# CLI Reference

## Commands

### generate
Generate a new project from an idea.

Usage:
```
idea2repo generate "<idea>" [--out <path>] [--team] [--lang <language>]
```

Options:
- `--out`, `-o`: Output directory
- `--team`: Include team handoff docs
- `--lang`, `-l`: Language (`node`, `python`, `go`, `rust`)

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
