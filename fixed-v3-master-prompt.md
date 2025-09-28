=== SOURCE_HTML ===
```html
<!DOCTYPE html>
<html lang="en">

[Rest of the code will go here]

</html>
```

=== UNIVERSAL_PROMPT ===
**System intent**
You are a senior full-stack engineer. Create a production-ready Next.js application that follows the exact foundation and conventions below. Do not use experimental features. Tailwind v3.4 only. Recharts for charts. Given the input anatomy and theme, normalize them to this guide and resolve conflicts in favor of the Universal Foundation.

## INPUT BLOCKS

### [Anatomy]

*   Global Layout
    *   Sidebar: dark, left, collapsible on mobile, persistent on desktop.
    *   Header bar: refresh button, live update status dot, user avatar with name/role.
    *   Main content: dynamic renderer for hash routes.
    *   Modals: reusable for Rocks and Employees create/edit.
*   Pages (hash routing)
    *   `#dashboard`: AI Analyst summary; company scorecards; Rocks overview; cross-org issues, todos, priorities.
    *   `#vto`: editable EOS document (core values, focus, 10-year target, marketing strategy, 3-year picture, 1-year plan).
    *   `#departments`: grid of departments (head, members, rocks count).
    *   `#departments/{id}`: dept scorecard, rocks, member rocks, open issues/todos, recent L10 with recording links.
    *   `#people`: accountability chart; employee directory.
    *   `#data`: company metrics and historical charts.
    *   `#issues`: list with priority/age; add/edit.
    *   `#rocks`: company/department/individual rocks; add via modal.
    *   `#l10`: tabs for Live Meeting and History & AI Insights (summaries, ratings, recordings).
    *   `#integrations`: placeholder calling `App.integrations()`.
*   Features
    *   AI summaries (dashboard analyst, meeting insights).
    *   Live updates indicator and manual refresh.
    *   Charts for scorecards and trends.
    *   Modals for CRUD.
    *   Department drilldowns.
    *   Accountability chart.
*   Data Model
    *   Scorecard metrics; Rocks (company/department/individual); Issues; Todos; Meetings (L10) with date, rating, sentiment, recordings; Departments; Employees.

### [Theme Design Guide] → to be translated into Tailwind v3.4 tokens

*   Colors
    *   Backgrounds: body `#111827` (gray-900), sidebar gray-950, cards/modals gray-800, inputs gray-900.
    *   Accent: indigo-600 primary; hover indigo-500; active nav indigo-600.
    *   Text: white/gray-100 primary; gray-300/200 secondary; muted gray-400/500/600; links indigo-400 hover indigo-300.
    *   Status: success green-600/300/400; warning yellow-500/300, amber-600; error red-600/400/300; info blue-600/300.
*   Typography
    *   Inter font; sizes: titles 3xl, sections 2xl, subsections xl, body sm, labels xs; weights: extra-bold logo, bold headers, semibold subheaders, medium emphasis, normal body.
*   Layout
    *   Dashboard grids: `grid grid-cols-1 xl:grid-cols-3 gap-6`; metrics grids; card grids.
    *   Spacing: page `p-4 sm:p-6`, card `p-6`, sections `space-y-6`.
*   Components
    *   Card styles: gray-800 with gray-700 border; elevated variant with shadow.
    *   Buttons: primary indigo, secondary gray, danger red, ghost muted.
    *   Inputs: gray-900 with gray-700 border, focus indigo-500.
    *   Tables: dark header, gray separators.
*   Interactions
    *   Hover/focus transitions; status indicators with ping; subtle shadows; z-index: sidebar 30, modals 50, overlay 20.

### [Project Needs]

*   Data persistence: yes (Postgres)
*   Auth: email magic link
*   Realtime: live updates indicator (SSE)
*   AI: dashboard analyst + meeting insights
*   Charts: dashboards and department scorecards (Recharts)
*   Emails: transactional (magic link; meeting recap optional)
*   Background jobs: optional later (not required for MVP)
*   File uploads: not required for MVP (recordings stored as URLs)

---

## UNIVERSAL FOUNDATION (always include, no substitutions)

*   Package manager: **pnpm**
*   Node: **Node 20 LTS**
*   Framework: **Next.js 15 (App Router)**
*   React: **`react@18.x`**, **`react-dom@18.x`**
*   Language: **`typescript@5.x`**
*   CSS: **Tailwind CSS 3.4.x**, **`postcss@8.x`**, **`autoprefixer@10.x`**
*   Lint/format: **`eslint@8.x`**, **`eslint-config-next@14.x`**, **`prettier@3.x`**
*   Icons: **`lucide-react@0.544.0`**
*   Forms & validation: **`react-hook-form@7.x`**, **`@hookform/resolvers@3.x`**, **`zod@3.x`**
*   RPC: **`@trpc/server@10.x`**, **`@trpc/react-query@10.x`**
*   Client data fetching & cache: **`@tanstack/react-query@5.x`**
*   State Management: **Zustand**
*   Env safety: **`@t3-oss/env-nextjs`**
*   Testing: **`vitest@1.x`**, **`@testing-library/react@15.x`**, **`@testing-library/jest-dom@6.x`**, **`msw@2.x`**
*   E2E: **`@playwright/test@1.x`**
*   Observability: **`@sentry/nextjs@8.x`**
*   Charts: **Recharts**
*   ORM: **Prisma**
*   Auth: **Auth.js (v5)** with **Prisma adapter**

**Scripts (exact)**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier -w .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "e2e": "playwright test",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

**Directory structure**

```
/src
  /app
    /(public)
      /auth
        sign-in/page.tsx
        sign-out/page.tsx
    /api
      /trpc/[trpc]/route.ts
      /sse/route.ts
    layout.tsx
    page.tsx
  /components
    /ui
    /layout
      Sidebar.tsx
      HeaderBar.tsx
      HashRouter.tsx
      Modal.tsx
    /charts
      Line.tsx
      Spark.tsx
  /features
    dashboard/
    vto/
    departments/
    department-detail/
    people/
    data/
    issues/
    rocks/
    l10/
    integrations/
  /server
    db.ts
    auth.ts
    trpc.ts
    /routers
      _app.ts
      dashboard.ts
      vto.ts
      departments.ts
      people.ts
      data.ts
      issues.ts
      rocks.ts
      l10.ts
    /rbac
      roles.ts
      guards.ts
  /lib
    env.ts
    /email
      send.ts
      /templates
        MagicLinkEmail.tsx
    /ai
      summarize.ts
      meetingInsights.ts
    utils.ts
  /styles
    globals.css
/prisma
  schema.prisma
  seed.ts
```

**Coding standards**

*   TypeScript strict; no `any`.
*   Server logic in Route Handlers or tRPC procedures only.
*   Zod-validate all external inputs.
*   RBAC checks on server only.
*   Use `@/*` import alias.
*   No experimental flags, no CDN script tags.

---

## OPTIONAL PACKS TO INCLUDE FOR THIS PROJECT

### Data & Database (Postgres + Prisma)

*   Packages: `@prisma/client@5.x`, `prisma@5.x`, `pg@8.x`.
*   Models:
    *   Auth: `User`, `Account`, `Session`, `VerificationToken` (Auth.js v5)
    *   Domain:
        `Department { id, name, headId, memberCount }`
        `Employee { id, userId, departmentId, role }`
        `Rock { id, level enum('company','department','individual'), title, ownerId, departmentId, status enum('on_track','off_track','done'), dueAt }`
        `Issue { id, title, departmentId, priority int, status, createdAt }`
        `Todo { id, title, departmentId, assigneeId, doneAt }`
        `ScorecardMetric { id, name, departmentId?, unit, target, series JSONB }`
        `Meeting { id, departmentId?, date, rating, sentiment, summary, notes, recordingUrl }`
*   Seed: admin user, departments, employees, sample rocks/issues/todos, scorecard time series, two L10 meetings.

### Auth (Auth.js v5 + Prisma adapter)

*   Packages: **Auth.js (v5)**, **Prisma adapter**.
*   Strategy: email magic link (Credentials + OAuth providers are also fine).
*   Pages: `/app/(public)/auth/*`. Session in DB; secure cookies; CSRF.

### RBAC

*   Roles: `admin`, `manager`, `member`, `viewer`.
*   `rbac/guards.ts` exposes `canEditRock`, `canManageDepartment`, `canViewMeeting`, etc., all Zod-typed. Enforce in server procedures.

### Realtime (SSE)

*   `/api/sse`: emits `heartbeat` every 20s and `metric:update`, `rock:update`, `issue:update` events.
*   Client utility with auto-reconnect and backoff; header dot reflects status.

### Emails (React Email + Nodemailer)

*   Packages: `react-email@2.x`, `@react-email/components@0.0.x`, `nodemailer@6.x`.
*   Templates: Magic Link, Meeting Recap. Local preview route.

### AI Utilities (server functions)

*   `lib/ai/summarize.ts` for dashboard analyst; `lib/ai/meetingInsights.ts` for L10 summaries.
*   Store outputs on `Meeting.summary` and `Meeting.sentiment`.

---

## OUTPUT REQUIREMENTS

1.  Generate `package.json`, `.env.example`, `.gitignore`, `.editorconfig`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, ESLint + Prettier configs.
2.  Scaffold the directory structure exactly as above.
3.  Normalize the provided Anatomy and Theme into Tailwind tokens and components.
4.  Include packs: Data & Database, Auth, RBAC, Realtime (SSE), Emails, AI Utilities.
5.  Prisma schema and seed as specified.
6.  tRPC `appRouter` with `healthcheck`, `whoami`, and routers: `dashboard`, `vto`, `departments`, `people`, `data`, `issues`, `rocks`, `l10`.
7.  One RHF+Zod form for “Add Rock,” with optimistic UI via React Query.
8.  Recharts wrappers themed for dark mode (`Line.tsx`, `Spark.tsx`).
9.  README with exact commands: install, migrate, dev, build, test.

## ACCEPTANCE CRITERIA

*   `pnpm install && pnpm dev` runs without errors.
*   `pnpm build` succeeds after `prisma generate`.
*   `pnpm test` passes.
*   Sign-in via magic link works locally.
*   Dashboard renders sample metrics with Recharts.
*   Add Rock modal saves via tRPC and revalidates list.
*   SSE indicator shows live connection and updates on events.
*   V/TO sections save and reload.
*   Department Detail shows scorecard, rocks, issues, todos, and recent L10 entries with recording links.

---

=== CONVERSION_GUIDE ===
**Input context**
You are given a single-file HTML/Tailwind/Chart.js SPA (posted below). Convert it to the Universal Foundation stack (Next.js 15 + TS + Tailwind 3.4 + tRPC + Prisma + Recharts + Auth.js v5 + React Query). No experimental flags. No CDN scripts. No inline API keys.

**Hard requirements**

1.  **Routing**
    *   Preserve legacy hash routes. Implement `#dashboard`, `#vto`, `#departments`, `#departments/{id}`, `#people`, `#data`, `#issues`, `#rocks`, `#l10`, `#integrations`.
    *   Implement `src/components/layout/HashRouter.tsx` watching `window.location.hash` and rendering matching feature components.
    *   Sidebar links set `location.hash` and highlight the active item.

2.  **Layout & theming**
    *   Convert the HTML structure into React components:
        *   `src/components/layout/Sidebar.tsx`
        *   `src/components/layout/HeaderBar.tsx` (refresh button, live dot, avatar)
        *   `src/components/layout/Modal.tsx` (portal with focus trap)
        *   `src/app/layout.tsx` wraps everything; uses `next/font/google` for Inter.
    *   Move all inline `<style>` and custom CSS into `src/styles/globals.css` or Tailwind utilities.
    *   Tailwind via config (no CDN). Colors from the Theme Guide mapped to Tailwind tokens (`extend.colors`).

3.  **Icons & images**
    *   Replace ad-hoc SVG strings with **lucide-react** components (e.g., `Home`, `Target`, `Users`, `BarChart3`, `Bug`, `Mountain`, `Video`, `PlugZap`, `Bot`).

4.  **State & data**
    *   Replace the global `App` object and DOM mutation with React state and feature components.
    *   Preserve current demo data as a **seed** in `prisma/seed.ts`; also provide a **mock client store** for dev mode (`USE_MOCK=1`) so the UI runs without a DB.
    *   Migrate `localStorage` persistence to:
        *   short term: React Query cache + localStorage hydration (mock mode)
        *   long term: Prisma Postgres models per the Foundation (User, Department, Employee, Rock, Issue, Todo, ScorecardMetric, Meeting, etc.).

5.  **Forms & modals**
    *   Convert all form DOM access to **react-hook-form** + **zod** schemas with inline errors.
    *   Implement “Add/Edit Rock”, “Add/Edit Employee”, “Add Metric” as reusable RHF forms inside `Modal`.

6.  **Charts**
    *   **Remove all Chart.js usage and rebuild charts with Recharts (Line, Bar, Area, Pie).**
    *   Dashboard sales trend ⇒ `<ResponsiveContainer><LineChart/></ResponsiveContainer>` (Recharts)
    *   Metric sparklines ⇒ small LineCharts (no axes, no legend)
    *   Use dark-mode friendly axis/tick styles and responsive containers.

7.  **Live updates**
    *   Replace the simulated webhook timers with an SSE endpoint:
        *   `src/app/api/sse/route.ts` emits `heartbeat`, `metric:update`, `rock:update`, `issue:update`.
        *   Header dot reflects connection (open/closed).

8.  **AI assistant**
    *   Strip any inline API keys from the source HTML and route all AI calls through `/api/ai`.
    *   Create `src/app/api/ai/route.ts` that reads from `process.env.AI_PROVIDER` and `process.env.AI_API_KEY` (document this in `.env.example`).
    *   Client uses a simple chat state; messages are sanitized and rendered via React (no `innerHTML`).

9.  **Security**
    *   Eliminate direct `innerHTML` and dynamic string-to-DOM rendering. No `dangerouslySetInnerHTML` unless required, and if used, sanitize.
    *   Keep the original `Security.escapeHtml` idea but prefer typed state → JSX.

10. **RBAC**
    *   Add `rbac/roles.ts` and `rbac/guards.ts` with roles: `admin`, `manager`, `member`, `viewer`.
    *   Server-only enforcement inside tRPC procedures.

11. **Acceptance tests (must pass)**
    *   `pnpm dev` boots with mock data (no DB) and shows all pages via hash routing.
    *   `Add Rock` creates a rock and re-renders lists without refresh (React Query optimistic update).
    *   Dashboard charts render via Recharts; no Chart.js bundles in output.
    *   Live dot flips when SSE endpoint is stopped/started.
    *   No console errors in DevTools.

**Mapping table (from your HTML to files)**

| Source (HTML id/section) | Destination file/component |
| --- | --- |
| `aside#sidebar` + nav | `src/components/layout/Sidebar.tsx` |
| Header (refresh, status, avatar) | `src/components/layout/HeaderBar.tsx` |
| `#main-app` pages | `src/features/*` (one folder per page) |
| Rock modal / Employee modal / Metric modal | `src/components/layout/Modal.tsx` + `src/features/{rocks,people,data}/forms/*` |
| AI chat button + modal | `src/features/ai/Assistant.tsx` + `/api/ai/route.ts` |
| Chart canvases (`canvas` elements) | `src/components/charts/Line.tsx`, `Spark.tsx` (Recharts) |
| Local storage `Persistence` | React Query cache (mock) + Prisma DB (real) |
| `App.router()` + `window.hashchange` | `HashRouter.tsx` |
| “simulateWebhookUpdate” | SSE push + mock timers behind `USE_MOCK` |

**Specific replacements**

*   Inter font: use `next/font/google` (`const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700'] })`) and apply on `<body>`.
*   Remove `<script src="https://cdn.tailwindcss.com">` and `<script src="chart.js">`.
*   Replace custom SVG strings with `<IconName className="w-5 h-5" />` from lucide-react.
*   Replace DOM event listeners (`addEventListener`) with component-level handlers and controlled inputs.

**Config & env**

*   Add `.env.example` keys: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER_*`, `AI_PROVIDER`, `AI_API_KEY`.
*   Never hardcode API keys in the repo. Strip any API keys from input.