# PostgreSQL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Pandory Hub storage from local JSON files to a PostgreSQL database with Kitsu-compatible schemas and media metadata support.

**Architecture:** Connect to PostgreSQL using `pg` connection pooling. On backend startup, initialize tables and run a one-time migration to seed database tables if they are empty and JSON files exist. Refactor all active services to execute SQL queries.

**Tech Stack:** Node.js, Express, TypeScript, `pg` (node-postgres), `@types/pg`.

## Global Constraints
- All backend TypeScript code must compile without errors using `npm run build`.
- Environment variables must be read from `process.env`.
- Database connections must be pooled and properly closed where necessary.
- Tests should be written under `src/tests/` and can be run using `npx ts-node`.

---

### Task 1: Setup & Dependencies

**Files:**
- Modify: `pandory-hub-backend/package.json`
- Modify: `pandory-hub-backend/.env.example`
- Create: `pandory-hub-backend/src/tests/setup.test.ts`

**Interfaces:**
- Consumes: None
- Produces: None

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/setup.test.ts` to assert that `pg` is installed and can be imported.
  ```typescript
  import assert from 'assert';

  try {
    require('pg');
    console.log("PASS: pg imported successfully.");
  } catch (err: any) {
    console.error("FAIL: pg not installed.");
    assert.fail("pg module is not available.");
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/setup.test.ts`
  Expected: FAIL with "Cannot find module 'pg'"

- [ ] **Step 3: Write minimal implementation**
  Add dependencies to `pandory-hub-backend/package.json` and run install.
  Add the following lines under `"dependencies"`:
  ```json
  "pg": "^8.11.3"
  ```
  Add the following lines under `"devDependencies"`:
  ```json
  "@types/pg": "^8.11.2"
  ```
  Add `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pandory_hub` to `pandory-hub-backend/.env.example`.
  Install dependencies:
  Run: `npm install` inside `pandory-hub-backend/`

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/setup.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add package.json package-lock.json .env.example src/tests/setup.test.ts
  git commit -m "chore: add pg and types dependencies"
  ```

---

### Task 2: Connection Utility

**Files:**
- Create: `pandory-hub-backend/src/db.ts`
- Create: `pandory-hub-backend/src/tests/db.test.ts`

**Interfaces:**
- Consumes: `process.env.DATABASE_URL`
- Produces: `pool: Pool`, `query: (text: string, params?: any[]) => Promise<QueryResult>`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/db.test.ts` to assert that `pool` and `query` are exported and load the config correctly.
  ```typescript
  import assert from 'assert';

  // Attempt to load db.ts
  try {
    const db = require('../db');
    assert.ok(db.pool, 'db should export pool instance');
    assert.ok(typeof db.query === 'function', 'db should export query function');
    console.log("PASS: db.ts interface verified.");
  } catch (err: any) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/db.test.ts`
  Expected: FAIL with "Cannot find module '../db'"

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/db.ts`:
  ```typescript
  import { Pool } from 'pg';
  import dotenv from 'dotenv';

  dotenv.config();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  export const query = (text: string, params?: any[]) => pool.query(text, params);
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/db.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/db.ts src/tests/db.test.ts
  git commit -m "feat: add postgres connection utility and pool"
  ```

---

### Task 3: Table Creation & JSON Seeding

**Files:**
- Create: `pandory-hub-backend/src/dbInit.ts`
- Modify: `pandory-hub-backend/src/index.ts`
- Create: `pandory-hub-backend/src/tests/dbInit.test.ts`

**Interfaces:**
- Consumes: `pool: Pool` from `./db`
- Produces: `initializeDatabase(): Promise<void>`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/dbInit.test.ts` to assert that `initializeDatabase` runs and creates tables.
  ```typescript
  import assert from 'assert';
  import { initializeDatabase } from '../dbInit';
  import { query } from '../db';

  async function test() {
    try {
      await initializeDatabase();
      // Check if tables exist
      const res = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('categories', 'restaurants', 'vnindex_history', 'media_files');
      `);
      assert.strictEqual(res.rowCount, 4, 'All four tables should be created');
      console.log("PASS: Database tables initialized and verified.");
      process.exit(0);
    } catch (err: any) {
      console.error("FAIL:", err.message);
      process.exit(1);
    }
  }
  test();
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/dbInit.test.ts`
  Expected: FAIL (either `dbInit` cannot be imported or query fails because tables don't exist)

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/dbInit.ts`:
  ```typescript
  import { query } from './db';
  import fs from 'fs';
  import path from 'path';

  export async function initializeDatabase() {
    // 1. Create tables DDL
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50)
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
        rating NUMERIC(3, 2) DEFAULT 0.0,
        avg_price INTEGER DEFAULT 0,
        address TEXT,
        signature_dishes TEXT[] DEFAULT '{}',
        notes TEXT,
        is_unavailable BOOLEAN DEFAULT FALSE
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS vnindex_history (
        timestamp BIGINT PRIMARY KEY,
        open NUMERIC(10, 2) NOT NULL,
        high NUMERIC(10, 2) NOT NULL,
        low NUMERIC(10, 2) NOT NULL,
        close NUMERIC(10, 2) NOT NULL,
        volume BIGINT NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(512) NOT NULL,
        mimetype VARCHAR(100) NOT NULL,
        size_bytes BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Perform one-time migration from JSON files if categories table is empty
    const checkCat = await query('SELECT COUNT(*) FROM categories');
    if (parseInt(checkCat.rows[0].count) === 0) {
      const foodieHubPath = path.join(__dirname, '../data/foodie-hub.json');
      if (fs.existsSync(foodieHubPath)) {
        const data = JSON.parse(fs.readFileSync(foodieHubPath, 'utf8'));
        
        // Seed Categories
        for (const cat of data.categories || []) {
          await query(
            'INSERT INTO categories (id, name, icon) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
            [cat.id, cat.name, cat.icon]
          );
        }

        // Seed Restaurants
        for (const rest of data.restaurants || []) {
          await query(
            'INSERT INTO restaurants (id, name, category_id, rating, avg_price, address, signature_dishes, notes, is_unavailable) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
            [
              rest.id,
              rest.name,
              rest.categoryId,
              rest.rating,
              rest.avgPrice,
              rest.address,
              rest.signatureDishes || [],
              rest.notes,
              rest.isUnavailable || false
            ]
          );
        }
        console.log('Successfully seeded categories and restaurants from foodie-hub.json');
      }

      // Seed VNIndex history
      const checkVnIndex = await query('SELECT COUNT(*) FROM vnindex_history');
      if (parseInt(checkVnIndex.rows[0].count) === 0) {
        const vnindexPath = path.join(__dirname, '../data/vnindex.json');
        if (fs.existsSync(vnindexPath)) {
          const data = JSON.parse(fs.readFileSync(vnindexPath, 'utf8'));
          for (const item of data || []) {
            await query(
              'INSERT INTO vnindex_history (timestamp, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
              [item.timestamp, item.open, item.high, item.low, item.close, item.volume]
            );
          }
          console.log('Successfully seeded stock index records from vnindex.json');
        }
      }
    }
  }
  ```
  Modify `pandory-hub-backend/src/index.ts` to call `initializeDatabase()` right before starting the express server:
  Add import: `import { initializeDatabase } from './dbInit';`
  And inside startup, add:
  ```typescript
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize database:', err);
      process.exit(1);
    });
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/dbInit.test.ts` (Ensure local Postgres or mock test environment is active)
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/dbInit.ts src/index.ts src/tests/dbInit.test.ts
  git commit -m "feat: add database schema initialization and JSON migration on startup"
  ```

---

### Task 4: Services Refactoring

**Files:**
- Modify: `pandory-hub-backend/src/services/foodieHubService.ts`
- Modify: `pandory-hub-backend/src/services/vnindexService.ts`
- Create: `pandory-hub-backend/src/tests/services.test.ts`

**Interfaces:**
- Consumes: `query` from `../db`
- Produces: Relies on existing service interfaces, refactored to execute DB queries instead of local JSON file read/writes.

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/services.test.ts` to test foodieHub and vnIndex services.
  ```typescript
  import assert from 'assert';
  import { getCategories, addRestaurant, getRestaurants } from '../services/foodieHubService';
  import { getHistory, saveCandle } from '../services/vnindexService';

  async function test() {
    try {
      const categories = await getCategories();
      assert.ok(Array.isArray(categories), 'categories should be an array');

      const initialRestaurants = await getRestaurants();
      const testRestaurant = {
        name: 'TDD Postgres Test Rest',
        categoryId: 'test-category',
        rating: 4.5,
        avgPrice: 150000,
        address: '123 Test St',
        signatureDishes: ['Test Dish'],
        notes: 'Delicious',
        isUnavailable: false
      };

      const newRest = await addRestaurant(testRestaurant);
      assert.strictEqual(newRest.name, testRestaurant.name);

      const vnindexHistory = await getHistory();
      assert.ok(Array.isArray(vnindexHistory));

      console.log("PASS: Services Postgres refactoring verified.");
      process.exit(0);
    } catch (err: any) {
      console.error("FAIL:", err.message);
      process.exit(1);
    }
  }
  test();
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/services.test.ts`
  Expected: FAIL (fails because queries are not yet implemented in services or services still use filesystem fallback)

- [ ] **Step 3: Write minimal implementation**
  Refactor `pandory-hub-backend/src/services/foodieHubService.ts` to query database:
  - Replace read/writes of `foodie-hub.json` with SQL `SELECT` and `INSERT/UPDATE/DELETE` queries.
  Refactor `pandory-hub-backend/src/services/vnindexService.ts` to query database:
  - Replace read/writes of `vnindex.json` with SQL queries on `vnindex_history`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/services.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/foodieHubService.ts src/services/vnindexService.ts src/tests/services.test.ts
  git commit -m "refactor: migrate foodieHubService and vnindexService to use Postgres"
  ```

---

### Task 5: Verification

**Files:**
- Create: `pandory-hub-backend/src/tests/endpoints.test.ts`

**Interfaces:**
- Consumes: REST APIs `/api/foodie-hub/*` and `/api/vnindex`
- Produces: None

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/endpoints.test.ts` to test endpoint responses.
  ```typescript
  import assert from 'assert';

  async function test() {
    try {
      const resFoodie = await fetch('http://localhost:3001/api/foodie-hub/categories');
      assert.strictEqual(resFoodie.status, 200, 'Categories endpoint should return 200');
      const cats = await resFoodie.json();
      assert.ok(Array.isArray(cats));

      const resVnindex = await fetch('http://localhost:3001/api/vnindex');
      assert.strictEqual(resVnindex.status, 200, 'VNIndex endpoint should return 200');
      
      console.log("PASS: Endpoint checks verify backend successfully.");
      process.exit(0);
    } catch (err: any) {
      console.error("FAIL: API server not responding or returned errors:", err.message);
      process.exit(1);
    }
  }
  test();
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/endpoints.test.ts`
  Expected: FAIL (Ensure server is stopped)

- [ ] **Step 3: Write minimal implementation**
  Start the server:
  Run: `npm run dev` (Keep it running in the background)

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/endpoints.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/tests/endpoints.test.ts
  git commit -m "test: add backend REST endpoint verification tests"
  ```
