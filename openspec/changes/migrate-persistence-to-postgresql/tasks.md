## 1. Setup & Dependencies
- [ ] 1.1 Backend: Install `pg` and devDependency `@types/pg`.
- [ ] 1.2 Configuration: Add `DATABASE_URL` to `.env.example` file.
- [ ] 1.3 Connection Utility: Create `src/db.ts` to initialize the PostgreSQL pool.

## 2. Table Creation & JSON Seeding
- [ ] 2.1 Initialization Script: Create `src/dbInit.ts` defining table schemas and JSON-to-Postgres migration.
- [ ] 2.2 Startup Hooks: Register the database initialization call on server startup in `src/index.ts`.

## 3. Services Refactoring
- [ ] 3.1 Refactor Service: Update `src/services/foodieHubService.ts` to execute SQL queries for categories, restaurants, and suggestions.
- [ ] 3.2 Refactor Service: Update `src/services/vnindexService.ts` to save and read stock index records from the database.

## 4. Verification
- [ ] 4.1 Verify: Test endpoint `/api/foodie-hub` to ensure correct listing.
- [ ] 4.2 Verify: Test endpoint `/api/vnindex` to ensure correct stock list retrieval.
- [ ] 4.3 Verify: Ensure builds compile without typescript compilation errors.
