# idea2repo Architecture

## High-Level Design
idea2repo is a CLI that transforms project ideas into structured repositories using Copilot-backed reasoning. It emphasizes explainability, security awareness, and developer experience.

## Components

### CLI Layer
- Command routing and input parsing
- Rich terminal UI for banners, spinners, and summaries

### Core Layer
- Idea normalization and project classification
- Risk assessment and decision logging

### Copilot Layer
- Architecture prompts and content generation
- Migration planning and dependency recommendations

### Scaffold Layer
- File structure generation
- Template rendering and file writing

## Data Flow
1. Parse CLI input
2. Normalize idea and classify
3. Consult Copilot for architecture guidance
4. Generate scaffold + docs
5. Optionally initialize Git
