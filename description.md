Top-Level Repository Structure
idea2repo/
├─ README.md
├─ package.json
├─ tsconfig.json
├─ .gitignore
├─ .npmignore
├─ LICENSE
│
├─ bin/
│  └─ idea2repo.ts
│
├─ src/
│  ├─ index.ts
│  │
│  ├─ cli/
│  │  ├─ commandRouter.ts
│  │  ├─ help.ts
│  │  └─ version.ts
│  │
│  ├─ commands/
│  │  ├─ init.ts
│  │  ├─ generate.ts
│  │  └─ explain.ts
│  │
│  ├─ core/
│  │  ├─ ideaNormalizer.ts
│  │  ├─ projectClassifier.ts
│  │  ├─ decisionModel.ts
│  │  └─ reasoningSession.ts
│  │
│  ├─ copilot/
│  │  ├─ copilotClient.ts
│  │  ├─ prompts.ts
│  │  └─ responseParser.ts
│  │
│  ├─ scaffold/
│  │  ├─ structureBuilder.ts
│  │  ├─ fileWriter.ts
│  │  └─ templateRegistry.ts
│  │
│  ├─ explainability/
│  │  ├─ explanationBuilder.ts
│  │  └─ tradeoffRenderer.ts
│  │
│  ├─ output/
│  │  ├─ readmeGenerator.ts
│  │  ├─ architectureDoc.ts
│  │  ├─ roadmapDoc.ts
│  │  └─ todoGenerator.ts
│  │
│  ├─ config/
│  │  ├─ defaults.ts
│  │  └─ constraints.ts
│  │
│  └─ utils/
│     ├─ shell.ts
│     ├─ fs.ts
│     ├─ logger.ts
│     └─ validation.ts
│
├─ docs/
│  ├─ architecture.md
│  ├─ philosophy.md
│  ├─ copilot-usage.md
│  └─ limitations.md
│
├─ examples/
│  ├─ kenya-land-marketplace.md
│  ├─ expense-tracker.md
│  └─ cli-tool.md
│
└─ tests/
   ├─ core.test.ts
   ├─ copilot.test.ts
   └─ explain.test.ts

Now let’s unpack why this structure exists, because that’s the entire point of your project.

Critical Files (What Judges Will Look At)
bin/idea2repo.ts

This is the executable entry point.

Responsibilities:

Parse raw CLI args

Hand control to src/index.ts

Zero business logic

This keeps the CLI thin and boring—which is exactly what you want.

src/core/ — The Brain Around Copilot

This is the most important directory.

ideaNormalizer.ts

Turns messy human input into structured intent.

Example output:

{
  problem: "Fraud in land listings",
  domain: "real estate",
  region: "Kenya",
  riskSensitivity: "high",
  appType: "marketplace"
}

This is how you avoid “Copilot hallucinated a crypto exchange.”

projectClassifier.ts

Detects:

CLI vs Web vs API

CRUD-heavy vs compute-heavy

MVP vs production-leaning

This file embodies your opinionated defaults.

decisionModel.ts

Stores decisions, not files.

Example:

{
  stack: "Node + PostgreSQL",
  auth: false,
  rationale: "MVP speed and legal sensitivity",
  alternativesConsidered: ["Firebase", "Django"]
}

This feeds directly into idea2repo explain.

reasoningSession.ts

A full run context:

input

Copilot prompts

Copilot responses

final decisions

This is how you make reasoning inspectable.

src/copilot/ — Copilot as a First-Class Actor

This directory is your proof that Copilot CLI is not cosmetic.

copilotClient.ts

Wraps:

gh copilot suggest
gh copilot explain

No direct AI APIs. This is a challenge-aligned design choice.

prompts.ts

Pre-written, high-quality prompts.

Example:

Design a repository structure for this project.
Optimize for clarity, MVP speed, and explainability.
Avoid premature abstractions.
Explain tradeoffs.

Judges will read this file carefully.

responseParser.ts

Turns Copilot’s text into:

folder trees

explanations

task lists

This is where AI meets determinism.

src/scaffold/ — Turning Ideas into Files
structureBuilder.ts

Consumes Copilot output and produces a folder graph.

No writing yet. Just intent.

fileWriter.ts

The only place that touches the filesystem.

This separation is clean, testable, and grown-up.

templateRegistry.ts

Minimal, not fancy.

Used only for:

README skeleton

license

gitignore

This avoids “template soup.”

src/explainability/ — Your Differentiator
explanationBuilder.ts

Generates output for:

idea2repo explain

Example output:

Why this stack

Why these folders

What was intentionally excluded

tradeoffRenderer.ts

Explicitly shows:

What was not chosen

Why

When those choices might be better

This makes the tool trustworthy.

src/output/ — Generated Project Content

These generate files inside the target repo, not the CLI repo.

readmeGenerator.ts

architectureDoc.ts

roadmapDoc.ts

todoGenerator.ts

Each consumes:

decisions

Copilot explanations

constraints

No magic. Everything traceable.

docs/ — For the DEV Post & Judges

These are not fluff.

philosophy.md → why this tool exists

copilot-usage.md → exact commands used

limitations.md → honesty earns points

examples/ — Storytelling Ammo

Each example:

Input idea

Generated structure

Explanation output

Your Kenya land marketplace belongs here.

Final Judgment

This structure says:

“I didn’t just wire up Copilot. I designed a system around it.”

That’s rare. That’s memorable.