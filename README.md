# Health Craft

AI-powered recipe book and meal planner Progressive Web App.

## Performance & Reliability

- Uses Next.js Image optimization with remote patterns for responsive images.
- Dynamic imports code-split client components to reduce bundle size.
- Core Web Vitals are reported via `reportWebVitals`.
- Background jobs support automatic retries via Inngest and QStash wrappers.

## Development

This repository hosts a minimal Next.js 15 app configured with the App Router, TypeScript, and Tailwind CSS. Dependencies are managed with Yarn 4 via Corepack.

### Prerequisites

- Node.js 20+
- Yarn 4 (managed via Corepack; run `corepack enable` if needed)

### Scripts

- `yarn dev` – start the development server
- `yarn build` – create a production build
- `yarn start` – run the production build
- `yarn lint` – run ESLint
- `yarn test` – run unit and contract tests
- `yarn test:e2e` – run Playwright end-to-end tests
- `yarn test:lhci` – run a Lighthouse audit

For the complete project specification and roadmap, see [docs/PROJECT_PROMPT.md](docs/PROJECT_PROMPT.md).
For detailed local environment setup instructions, see [docs/local-development.md](docs/local-development.md).
For details on the testing approach, see [docs/testing-strategy.md](docs/testing-strategy.md).
