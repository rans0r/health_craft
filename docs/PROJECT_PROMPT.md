# Project Prompt: AI‑Powered Recipe PWA (Next.js + TypeScript, App Router, Vercel)

## 1) Goal & Elevator Pitch

Build a fast, offline‑capable Progressive Web App that becomes a personal, AI‑assisted recipe book and meal planner. Users can add recipes from images, URLs, or natural language; organize with auto‑generated editable tags; and generate/edit weekly meal plans tailored to household dietary needs. The app adapts to device capabilities (voice, touch, screen size) and runs seamlessly on web, mobile, and installable PWA.

---

## 2) Core Objectives

1. **Recipe Ingestion**

   * **Image → Recipe**: Upload a photo/screenshot; OCR + vision model extracts ingredients, steps, yields, cook times; suggest substitutions and nutrition.
   * **URL → Recipe**: Server‑side scrape (respect robots/ToS) → semantic parser normalizes to internal schema.
   * **NL → Recipe**: User describes a dish in natural language; LLM generates complete recipe conforming to schema.
2. **Recipe Management**

   * Auto‑generate tags (cuisine, diet, course, difficulty, cooking method, equipment, seasonality) with user edits.
   * Full‑text & faceted search; favorites; ratings; version history.
3. **Meal Planning**

   * AI‑assisted weekly planner using user’s recipe library + household dietary preferences and constraints (time budget, calories, macros, budget per meal, leftovers).
   * Editable plan with drag‑drop, automatic recalculation of shopping list.
4. **Shopping Lists & Pantry**

   * Auto‑compiled list from plan (deduped, quantities summed, store sections).
   * Pantry tracking and substitutions; warn for allergens.
5. **PWA & Device Adaptation**

   * Installable, offline read, background sync, responsive UI, voice dictation where available, camera capture on mobile, keyboard shortcuts on desktop.

---

## 3) Non‑Goals (MVP‑exclude)

* Social network features (public feeds, comments).
* Complex multi‑store price comparisons.
* Native apps (PWA only at launch).

---

## 4) Tech Stack & Hosting

* **Framework**: Next.js 14+ (App Router) + TypeScript.
* **UI**: Tailwind CSS + shadcn/ui + Radix primitives.
* **State**: React Server Components (RSC) + server actions; client state via Zustand or React Query for optimistic updates.
* **DB**: Postgres (Vercel Postgres or Neon) + Prisma.
* **Cache/Search**: Redis/Upstash for session/cache; Postgres full‑text + pgvector for semantic search.
* **Storage**: Vercel Blob or S3‑compatible (image uploads, scraped HTML, parsed JSON).
* **Background Jobs**: Vercel Cron + Inngest/Upstash Q for long tasks (scrape, parse, nutrition).
* **AI**: OpenAI (vision + text), optional: Nutrition model/service; embeddings for semantic tags & search.
* **Scraping**: Serverless fetch with headless browser (Playwright on an external worker) or Mercury/Readability fallback; comply with robots.txt & rate limits.
* **Auth**: NextAuth.js (Email/Passkey/OAuth).
* **Deploy**: Vercel (Production + Preview environments).

---

## 5) Key User Roles & Data

* **User**: Has profiles, households, dietary prefs, allergens, macros targets, units preference.
* **Household**: Members, ages, diets, schedule constraints.
* **Recipe**: Title, description, ingredients (with quantities/units), steps, yields, times, equipment, tags, nutrition, images, source metadata, versions.
* **MealPlan**: Calendar (week), slots (breakfast/lunch/dinner/snacks), assigned recipes, servings.
* **ShoppingList**: Line items with quantity, unit, aisle/category, pantry flag.

---

## 6) Data Model (Prisma sketch)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  image        String?
  households   HouseholdMember[]
  settings     Json
  createdAt    DateTime @default(now())
}

model Household {
  id          String  @id @default(cuid())
  name        String
  members     HouseholdMember[]
  dietary     Json    // {diets: ["keto"...], allergens: ["peanut"...], dislikes:[], caloriesTarget: number}
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
}

model HouseholdMember {
  id           String @id @default(cuid())
  householdId  String
  userId       String?
  profile      Json   // age, height, prefs
  household    Household @relation(fields: [householdId], references: [id])
}

model Recipe {
  id           String   @id @default(cuid())
  ownerId      String
  title        String
  description  String?
  yield        String?
  prepMinutes  Int?
  cookMinutes  Int?
  totalMinutes Int?
  ingredients  Json     // [{name, qty, unit, notes, allergens:[]}]
  steps        Json     // ordered strings or {step, time, image}
  equipment    String[]
  tags         String[]
  nutrition    Json?    // calories, macros, micronutrients
  images       String[]
  source       Json?    // {type: url|image|nl, url, rawHtmlBlobId, attribution}
  version      Int      @default(1)
  embedding    Bytes?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model MealPlan {
  id          String @id @default(cuid())
  householdId String
  weekStart   DateTime // Monday 00:00
  slots       Json     // {"2025-08-04": {dinner: {recipeId, servings}}}
  notes       String?
}

model ShoppingList {
  id          String @id @default(cuid())
  planId      String?
  ownerId     String
  items       Json   // [{name, qty, unit, aisle, checked, fromRecipeId}]
  createdAt   DateTime @default(now())
}
```

---

## 7) App Structure (App Router)

```
/app
  /(marketing)
    page.tsx
  /(auth)
    sign-in/page.tsx
  /(app)
    layout.tsx
    dashboard/page.tsx
    recipes/
      page.tsx            // list & search
      new/page.tsx        // image/url/nl intake
      [id]/page.tsx       // view
      [id]/edit/page.tsx
    meal-plans/
      page.tsx            // week overview
      new/page.tsx        // AI generate wizard
      [week]/page.tsx
    shopping-lists/
      [id]/page.tsx
  /api
    recipes/ingest (POST)
    recipes/[id] (GET/PATCH/DELETE)
    parse/url (POST)
    parse/image (POST)
    generate/recipe (POST)
    plan/generate (POST)
    plan/update (POST)
    tags/suggest (POST)
    nutrition/calc (POST)
    search (POST)
```

---

## 8) PWA Requirements

* **Manifest** with icons/splash, display: standalone, theme/background colors.
* **Service Worker** using Workbox/Serwist:

  * Cache‑first for static assets (immutable).
  * Stale‑while‑revalidate for HTML/data requests.
  * Background sync queue for recipe uploads and edits when offline.
  * Push notifications (optional, VAPID) for reminders (e.g., “Start dinner prep”).
* **Offline Mode**: Read recipes & meal plans, add edits queued for sync. Graceful fallbacks.

---

## 9) Device Adaptation & UX

* **Capability Detection**:

  * Use the Web Capabilities API checks to enable: camera capture (mobile), speech recognition (if available), haptics, OS share, file system access (desktop), install prompts.
* **Layout**:

  * Mobile: bottom nav, large tap targets, camera‑first ingestion.
  * Tablet: two‑pane planner (calendar + recipe drawer).
  * Desktop: 3‑column (filters, content, details). Shortcut keys (/, g r, g p, n).
* **Voice**:

  * Dictate ingredients/steps; voice commands while cooking ("next step").
* **Cooking Mode**:

  * Step‑by‑step timer view; large fonts; keep‑awake; hands‑free controls.

---

## 10) AI Workflows & Prompts

### 10.1 Image → Recipe

1. Upload → store blob.
2. OCR with vision model.
3. Normalize with structured extraction prompt to schema.
4. Run allergen/entity tagger; generate tags/embeddings.
5. (Optional) nutrition estimation by mapping ingredients to USDA DB.

**System prompt skeleton (extraction):**

```
You are a strict information extractor. Output valid JSON only matching this TypeScript type:
RecipeExtract = {
  title: string; description?: string; yield?: string; prepMinutes?: number; cookMinutes?: number; totalMinutes?: number;
  ingredients: {name: string; qty?: number; unit?: string; notes?: string;}[];
  steps: {order: number; text: string; timeMinutes?: number;}[];
  equipment?: string[]; tags?: string[];
}
Rules: Do not invent quantities; use nulls sparingly; preserve original wording in steps; convert times to minutes.
```

### 10.2 URL → Recipe

* Fetch HTML (headless if required) → extract JSON‑LD/Schema.org if present → fallback to Readability → LLM normalize using the same schema. Store raw HTML for reproducibility.

**System prompt (normalize page):**

```
Given: {cleaned_text, microdata_json_ld}
Return RecipeExtract JSON. Infer missing fields when strongly implied. Strip chatter, ads, unrelated content.
```

### 10.3 NL → Recipe Generation

**System prompt (generate):**

```
You are a professional recipe developer. Generate a reliable home‑cook recipe that matches the user's brief and the household dietary constraints. Output RecipeExtract JSON and a "notes" field with tips, difficulty, and suggested sides.
```

### 10.4 Tagging & Embeddings

* Call embeddings on title+ingredients+steps; classify cuisine/diet/method/season.
* Store tags[] plus vector for semantic search and “More like this”.

### 10.5 Meal Plan Generation

Inputs: weekStart, household profile, time/budget constraints, pantry, past 4 weeks for variety.
Output: 7×(breakfast/lunch/dinner/snack) with recipeIds, servings, prep notes; ensure macro/diet compliance.

**Planner prompt (constrained):**

```
From the user's recipe library below, build a 7-day plan (breakfast, lunch, dinner) for N people. Respect diets/allergens. Prefer 30-minute on weekdays. Include leftovers strategically. Output JSON schema PlanWeek = {days: [{date, meals:[{slot, recipeId, servings, notes}]}], grocery: [{name, qty, unit, aisle}]}
```

---

## 11) API Contracts (Zod)

* **POST /api/parse/url**: `{ url: string }` → `{ recipe: Recipe }`
* **POST /api/parse/image**: `{ fileId: string }` → `{ recipe: Recipe }`
* **POST /api/generate/recipe**: `{ prompt: string, constraints?: {...} }` → `{ recipe: Recipe }`
* **POST /api/plan/generate**: `{ weekStart: string, householdId: string, constraints?: {...} }` → `{ plan: PlanWeek, list: ShoppingList }`
* **POST /api/search**: `{ q: string, filters?: {...} }` → `{ results: Recipe[] }`
* **PATCH /api/recipes/[id]**: partial update with optimistic concurrency.

Include proper input validation (Zod) and error shapes: `{error: {code, message}}`.

---

## 12) Security, Privacy, Compliance

* Store minimal PII; encrypt tokens at rest; secrets via Vercel env vars.
* Respect robots.txt and site ToS when scraping; exponential backoff and cache; provide a manual paste fallback.
* Rate limiting via middleware (IP+user) with sliding window.
* Content Safety: block disallowed scraping hosts list.

---

## 13) Performance & Reliability

* Core Web Vitals budget (LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms).
* Image optimization (Next/Image), responsive sizes.
* RSC where possible; defer hydration; code‑split routes; edge caching for public pages.
* Background retry + dead‑letter queue for parsing jobs.

---

## 14) Accessibility & i18n

* WCAG 2.2 AA: focus rings, reduced motion, ARIA for step navigation.
* Keyboard‑first cooking mode; voice hints togglable.
* i18n ready (next‑intl), units conversion (metric/imperial).

---

## 15) Analytics & Observability

* Event tracking (PostHog/Telemetry): recipe_add_{source}, plan_generate, cook_mode_start, offline_queue_size.
* Error reporting (Sentry). Health checks for queues/workers.

---

## 16) Testing Strategy

* Unit tests (vitest/jest) for parsers and schema validation.
* Contract tests for API (supertest) with mocked AI.
* E2E (Playwright) for flows: add via image, add via URL, generate plan, offline edit & sync.
* Lighthouse CI for PWA metrics in PRs.

---

## 17) UX Flows (Acceptance Criteria)

1. **Add recipe via URL**

   * Given a valid URL, when user submits, then server fetches, parses, and returns a populated editor within 10s; tags auto‑filled; user can edit & save. Error path shows paste‑HTML fallback.
2. **Add via image**

   * Given a mobile camera upload, OCR runs; quantities normalized; steps preserved order; allergens highlighted; user saves.
3. **Generate via natural language**

   * Given “quick gluten‑free pasta for 4, 500 kcal”, LLM returns RecipeExtract; nutrition estimate within ±15% of target.
4. **Search & tags**

   * Typing “vegan 30‑min Mexican” filters results via facets + semantic search within 300ms p95.
5. **Meal plan create**

   * Given household (2 adults, 2 kids, nut allergy), planner fills a week; no allergen recipes; at least 3 new recipes; leftovers used twice; list compiled and grouped by aisle.
6. **Offline**

   * With wifi off, user can view saved recipes & plan; edits queue and sync on reconnect.
7. **Cooking mode**

   * Steps displayed one‑per‑screen, timers inline; voice command “next step” advances if supported.

---

## 18) UI Components (shadcn)

* RecipeCard, TagChip, IngredientList, StepList, Timer, VoiceButton, PlanGrid, RecipeDrawer, PantryEditor, ShoppingList, UploadDropzone, URLInput, NLPromptEditor, DeviceActionBar.

---

## 19) Search & Ranking

* Rank by recency, rating, fit to filters, and semantic similarity to query. Penalize repetition in weekly plan. Include “Explore similar” using pgvector.

---

## 20) Roadmap

* **M1 (4 weeks)**: Skeleton app, auth, DB, recipe add via URL + NL, basic tags/search, PWA shell.
* **M2 (4 weeks)**: Image OCR pipeline, meal planner v1, shopping list, cooking mode, offline queue.
* **M3 (3 weeks)**: Pantry, nutrition calc, voice, analytics, accessibility polish, share/import/export.

---

## 21) Deliverables

* Deployed Vercel project (prod + preview) with CI.
* Seed data and fixtures.
* Postman/Thunder tests or REST Client scripts.
* README with setup, env vars, AI prompt docs, and troubleshooting.

---

## 22) Definition of Done

* Lighthouse PWA passes (installable). All acceptance criteria green in E2E. No P0/S1 errors. Docs complete. Security review (secrets, rate limits, robots compliance) signed off.

---

## 23) Nice‑to‑Have (Post‑MVP)

* Multi‑user sharing within a household; recipe import from popular apps; wearable timer companion; image‑to‑ingredient detection from pantry photo; cost estimation by store.

---

### Notes for the Builder

* Provide strict Zod schemas and return types.
* Log and store original sources for reproducibility.
* Ensure AI outputs are always validated and corrected into schema before persisting.
* Build deterministic prompts and maintain prompt versions.
