# Local Development Setup

This guide walks through installing everything required to run the Health Craft application locally for day-to-day development.

## 1. Clone the repository

```bash
git clone https://github.com/<your-org>/health_craft.git
cd health_craft
```

## 2. Install core prerequisites

| Dependency | Recommended Version | Notes |
| --- | --- | --- |
| [Node.js](https://nodejs.org/en/download/package-manager) | 20.x (LTS) | Required for Next.js 15. The project assumes npm is available (bundled with Node). |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ | Used by Prisma for the application data store. |
| [Git](https://git-scm.com/downloads) | Latest | Needed for cloning the repository and contributing changes. |

> Tip: If you use [nvm](https://github.com/nvm-sh/nvm), install Node 20 with `nvm install 20 && nvm use 20`.

### Optional tooling

- [Docker](https://www.docker.com/) for running PostgreSQL without installing it directly on your machine.
- [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/) if you prefer an alternative package manager. (All examples below use npm.)
- [VS Code](https://code.visualstudio.com/) with the Prisma, ESLint, and Tailwind extensions for a better DX.

## 3. Set up environment variables

Copy the example environment file and fill in the secrets relevant to your local stack:

```bash
cp .env.example .env.local
```

At a minimum you need to provide a local `DATABASE_URL`. Other values can remain empty if the associated integrations (OpenAI, AWS, Upstash, etc.) are not required for your current work. When you eventually need them, update the variables in `.env.local`.

Next.js automatically loads `.env.local` when you run the development server.

## 4. Provision PostgreSQL

### Option A – Docker (recommended)

```bash
docker run --name health-craft-postgres \
  -e POSTGRES_DB=health_craft \
  -e POSTGRES_USER=healthcraft \
  -e POSTGRES_PASSWORD=healthcraft \
  -p 5432:5432 \
  -d postgres:15
```

Update the `DATABASE_URL` in `.env.local` to match the values above, for example:

```
DATABASE_URL="postgresql://healthcraft:healthcraft@localhost:5432/health_craft"
```

### Option B – Native installation

1. Install PostgreSQL via your OS package manager.
2. Create a database and user that matches the connection string you plan to use locally.
3. Update `DATABASE_URL` accordingly.

## 5. Install dependencies

```bash
npm install
```

This installs Next.js, Prisma, Tailwind CSS, Playwright, and all other runtime and development dependencies defined in `package.json`.

## 6. Prepare the database schema

Use Prisma to sync the schema to your local database:

```bash
npx prisma db push
```

This command introspects `prisma/schema.prisma` and applies the models to your development database. If you need to inspect or edit data, Prisma Studio is available via `npx prisma studio`.

## 7. Run the application

Start the Next.js development server:

```bash
npm run dev
```

The app is served at [http://localhost:3000](http://localhost:3000). Hot reloading is enabled out of the box.

## 8. Run automated checks

Before opening a pull request, run the automated test suites to ensure everything passes locally:

```bash
npm run lint        # ESLint
npm test            # Unit + contract tests
npm run test:e2e    # Playwright end-to-end tests
npm run test:lhci   # Lighthouse smoke test
```

> The `npm run test:e2e` and `npm run test:lhci` commands require a running development server. Start it in a separate terminal via `npm run dev` before executing these commands.

## 9. Troubleshooting tips

- **Port already in use (3000):** Stop the process occupying the port or run `npm run dev -- --port 3001`.
- **Database connection errors:** Confirm the PostgreSQL container (or service) is running and that your `.env.local` `DATABASE_URL` matches its credentials.
- **Prisma client out of date:** Run `npx prisma generate` after updating the schema.
- **Playwright missing browsers:** Execute `npx playwright install --with-deps` to install browser binaries.

With these steps you should have a fully functioning local development environment for Health Craft.
