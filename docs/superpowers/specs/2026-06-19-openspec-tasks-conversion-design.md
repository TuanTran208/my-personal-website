# Design Spec: Converted OpenSpec Changes to Superpowers Plan Format

## Context
We are migrating active specification-driven development tasks from the OpenSpec `tasks.md` format into the Superpowers plan format. This allows our agentic assistants to execute the steps sequentially using the `superpowers:subagent-driven-development` or `superpowers:executing-plans` skills, which enforce strict TDD cycles (test-first design).

## Goals
- Convert `openspec/changes/migrate-persistence-to-postgresql/tasks.md` to `docs/superpowers/plans/2026-06-19-migrate-persistence-to-postgresql.md`.
- Convert `openspec/changes/refactor-core-ui-and-discord-auth/tasks.md` to `docs/superpowers/plans/2026-06-19-refactor-core-ui-and-discord-auth.md`.
- Convert `openspec/changes/add-system-health-monitoring/tasks.md` to `docs/superpowers/plans/2026-06-19-add-system-health-monitoring.md`.
- Convert `openspec/changes/add-food-and-restaurant-organizer/tasks.md` to `docs/superpowers/plans/2026-06-19-add-food-and-restaurant-organizer.md`.

## Converted File Structure
All output plans will be stored in:
- `docs/superpowers/plans/`

### 1. PostgreSQL Migration Plan Delineation
- **Goal:** Migrate Pandory Hub storage from JSON files to a PostgreSQL database with Kitsu-compatible schemas and media metadata support.
- **Tasks Mapping:**
  - Task 1: Setup & Dependencies (Installing `pg`, `@types/pg`, `.env.example` update).
  - Task 2: Connection Utility (`src/db.ts` file creation).
  - Task 3: Table Schemas & JSON Seeding (`src/dbInit.ts` and `src/index.ts` hook).
  - Task 4: Services Refactoring (`src/services/foodieHubService.ts` and `src/services/vnindexService.ts`).
  - Task 5: Verification (Routing and system behavior checks).

### 2. Core UI & Discord Auth Plan Delineation
- **Goal:** Implement Discord OAuth login and Owner-only role restrictions, while fixing six P0 UI/UX bugs (memory leak, background color flash, DevTools crash, etc.).
- **Tasks Mapping:**
  - Task 1: Discord Authentication Backend (Dependencies, `AuthService`, callbacks, `authMiddleware`).
  - Task 2: Discord Authentication Frontend (Sidebar buttons, callback view, state logic, router guards).
  - Task 3: P0 UI/UX Fixes (Vite devtools, body background color, SVG icons, avatar URL, SystemHealthCard cleanup, HTML lang attribute).

### 3. System Health Monitoring Plan Delineation
- **Goal:** Provide visibility into the server's CPU, Memory, and Disk usage on the Pandory Hub dashboard.
- **Tasks Mapping:**
  - Task 1: Setup & Dependencies (Installing `systeminformation`).
  - Task 2: Health Service implementation (`src/services/healthService.ts`).
  - Task 3: API Route Registration (`src/routes/health.ts` and `src/index.ts` registration).
  - Task 4: Frontend System Health Card Widget (`SystemHealthCard.vue` and integration in `HomeView.vue`).

### 4. FoodieHub Plan Delineation
- **Goal:** Manage food categories, log restaurants, and search for dining recommendations.
- **Tasks Mapping:**
  - Task 1: Backend Seed File & Types (`data/foodie-hub.json` seeding).
  - Task 2: Service Layer Implementation (`src/services/foodieHubService.ts` and recommendation engine).
  - Task 3: API Router Setup (`src/routes/foodieHub.ts` and endpoints).
  - Task 4: Frontend View & Routing (`FoodieHubDashboard.vue` creation and views routing integration).
  - Task 5: Verification.

## Verification Strategy
- Run the Superpowers validation guidelines against the generated plans:
  - No placeholders (`TODO`, `TBD`, "handle edge cases").
  - Complete code and test examples in all steps.
  - Proper paths and line ranges.
