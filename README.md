# Health Craft

AI-powered recipe book and meal planner Progressive Web App.

## Performance & Reliability

- Uses Next.js Image optimization with remote patterns for responsive images.
- Dynamic imports code-split client components to reduce bundle size.
- Core Web Vitals are reported via `reportWebVitals`.
- Background jobs support automatic retries via Inngest and QStash wrappers.

## Development

This repository hosts a minimal Next.js 15 app configured with the App Router, TypeScript, and Tailwind CSS.

### Prerequisites

- Node.js 20+

### Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – run the production build
- `npm run lint` – run ESLint
- `npm test` – run unit and contract tests
- `npm run test:e2e` – run Playwright end-to-end tests
- `npm run test:lhci` – run a Lighthouse audit

For the complete project specification and roadmap, see [docs/PROJECT_PROMPT.md](docs/PROJECT_PROMPT.md).
For details on the testing approach, see [docs/testing-strategy.md](docs/testing-strategy.md).
