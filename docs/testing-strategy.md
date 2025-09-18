# Testing Strategy

This project uses a multi-layered testing approach derived from the project prompt.

## Unit Tests
- **Framework**: [Vitest](https://vitest.dev/)
- **Scope**: deterministic functions such as recipe parsers, tag generators, schema validators, and utilities.
- **Goal**: fast feedback and complete schema coverage.

## Contract Tests
- **Framework**: Vitest + Supertest
- **Scope**: Next.js API routes and server actions. External AI calls are mocked to verify request/response shapes.
- **Goal**: guarantee backward compatible contracts for clients.

## End-to-End Tests
- **Framework**: Playwright
- **Goal**: verify real user flows across devices and offline support.
- **Acceptance Flows**:
  1. **URL ingestion** – submit a recipe URL and receive a populated editor.
  2. **Image ingestion** – upload a photo and extract ingredients and steps.
  3. **Natural language ingestion** – describe a dish and receive a generated recipe.
  4. **Search** – filter by text and facets within 300ms.
  5. **Meal planning** – generate a weekly plan honoring allergies and leftovers.
  6. **Offline** – view recipes and queue edits while offline, syncing on reconnect.
  7. **Cooking mode** – step‑by‑step view with timers and optional voice navigation.

## Lighthouse CI
- **Tool**: `@lhci/cli`
- **Goal**: enforce PWA performance budgets (LCP < 2.5s, CLS < 0.1, INP < 200ms) on each PR.
- **Usage**: `yarn test:lhci` runs a single-page audit against Example.com; CI will supply the deployed URL.

## Directory Layout
```
/tests
  /unit
  /contract
/e2e
```

Each folder mirrors the strategy above.
