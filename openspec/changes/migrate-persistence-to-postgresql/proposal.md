# Change: Migrate Persistence to PostgreSQL

## Why
Currently, the application stores data locally in JSON files (`data/foodie-hub.json` and `data/vnindex.json`). Because the developer machine and the web server host are two separate machines, the data is not synchronized between them. In addition, the user wants a database that can handle larger volumes of data, support video and image metadata, and share the same database instance as their anime tracker, Kitsu (which runs on PostgreSQL).

## What Changes
- Install `pg` (node-postgres) and its TypeScript definitions.
- Create a PostgreSQL database connection utility in `src/db.ts` loaded via a `DATABASE_URL` connection string in the `.env` file.
- Create database tables for:
  - `categories` (Food categories)
  - `restaurants` (Restaurant listings, reviews, and signature dishes)
  - `vnindex_history` (Stock market tracking history)
- Migrate the `foodieHubService.ts` and `vnindexService.ts` backends to read/write from the PostgreSQL database instead of JSON files.
- Design files table structure to store metadata for uploaded images/videos while saving the actual files in the filesystem.

## Impact
- **Affected specs**: `db-migration` (new spec delta)
- **Affected code**:
  - Backend: `src/services/foodieHubService.ts`, `src/services/vnindexService.ts`, new file `src/db.ts`, configuration `.env.example` and `.env`.
  - Dependencies: Add `pg`, `@types/pg` devDependency.
