# Architecture

## Copilot CLI Prompt
```
Design a clean, opinionated repository structure for this cli: A CLI tool that automates developer workflows with interactive prompts and config management (Customizations: includeTelemetry: true). Prioritize MVP speed and clarity. Explain rationale.
```

## Copilot CLI Response
```
I'll analyze the current repository structure and design a clean, opinionated structure optimized for this CLI tool.
```

## System Diagram
```mermaid
Suggested architecture for AI/ML project:
- src/
  - models/: ML models and inference logic
  - features/: Feature engineering and data processing
  - services/: API and business logic
  - utils/: Helper utilities
- api/: REST API endpoints
- tests/: Unit and integration tests
- docs/: Documentation and model cards
- requirements.txt: Python dependencies
- docker-compose.yml: Containerized setup
```

## Summary
- **App type**: cli
- **Domain**: devtools
- **Risk sensitivity**: low
- **Complexity**: mvp

## Notes
Use the Copilot rationale above to guide implementation decisions.