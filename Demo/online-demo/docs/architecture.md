# Architecture

## Copilot CLI Prompt
```
Design a clean, opinionated repository structure for this web: AI expense tracker for freelancers. Prioritize MVP speed and clarity. Explain rationale.
```

## Copilot CLI Response
```
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
- **App type**: web
- **Domain**: ai
- **Risk sensitivity**: low
- **Complexity**: mvp

## Notes
Use the Copilot rationale above to guide implementation decisions.