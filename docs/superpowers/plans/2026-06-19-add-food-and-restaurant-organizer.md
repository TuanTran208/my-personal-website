# FoodieHub (Food & Restaurant Organizer) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide a food and restaurant organization board (FoodieHub) where users can manage food categories, log restaurants with notes/ratings, and search for tailored dining recommendations.

**Architecture:** Create backend endpoints under `/api/foodie-hub` to support restaurant CRUD operations, category loading, and a search-centric suggestion engine. Persistence uses a simple JSON database file `data/foodie-hub.json`. Build a dedicated frontend dashboard `/foodie-hub` in a neobrutalist/block-styled UI matching the design guidelines.

**Tech Stack:** Vue 3, Vite, Express, TypeScript, Google Fonts (Karla & Playfair Display SC).

## Global Constraints
- Do not make external Maps API network requests; use text-based fields for addresses.
- Store database data in `pandory-hub-backend/data/foodie-hub.json` with safe reading/writing error handling.
- Suggestion ranking must prioritize category matches, then signature dishes, then average rating.

---

### Task 1: Backend Seed File & Types

**Files:**
- Create: `pandory-hub-backend/data/foodie-hub.json`
- Create: `pandory-hub-backend/src/tests/foodieSetup.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `data/foodie-hub.json` JSON schema

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/foodieSetup.test.ts` to assert seed file exists and is valid JSON.
  ```typescript
  import assert from 'assert';
  import fs from 'fs';
  import path from 'path';

  const seedPath = path.resolve(__dirname, '../../data/foodie-hub.json');

  try {
    assert.ok(fs.existsSync(seedPath), 'Seed data file foodie-hub.json should exist');
    const content = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    assert.ok(Array.isArray(content.categories), 'Seed should contain categories array');
    assert.ok(Array.isArray(content.restaurants), 'Seed should contain restaurants array');
    console.log("PASS: Seed data format verified.");
    process.exit(0);
  } catch (err: any) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/foodieSetup.test.ts`
  Expected: FAIL (file does not exist)

- [ ] **Step 3: Write minimal implementation**
  Create directory `pandory-hub-backend/data/` if it does not exist.
  Create `pandory-hub-backend/data/foodie-hub.json`:
  ```json
  {
    "categories": [
      { "id": "chicken", "name": "Chicken", "icon": "chicken-icon" },
      { "id": "vietnamese", "name": "Vietnamese", "icon": "vietnamese-icon" }
    ],
    "restaurants": [
      {
        "id": "rest-1",
        "name": "Vibrant Chicken Diner",
        "categoryId": "chicken",
        "rating": 4.5,
        "avgPrice": 120000,
        "address": "123 Poultry Rd",
        "signatureDishes": ["Fried Chicken", "Buffalo Wings"],
        "notes": "Excellent crispiness.",
        "isUnavailable": false
      }
    ]
  }
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/foodieSetup.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add data/foodie-hub.json src/tests/foodieSetup.test.ts
  git commit -m "chore: add FoodieHub seed JSON file with initial mock data"
  ```

---

### Task 2: Service Layer Implementation

**Files:**
- Create: `pandory-hub-backend/src/services/foodieHubService.ts`
- Create: `pandory-hub-backend/src/tests/foodieService.test.ts`

**Interfaces:**
- Consumes: JSON file `data/foodie-hub.json`
- Produces: `getCategories(): Promise<Category[]>`, `getRestaurants(): Promise<Restaurant[]>`, `addRestaurant(rest): Promise<Restaurant>`, `deleteRestaurant(id): Promise<boolean>`, `getSuggestions(keyword): Promise<Restaurant[]>`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/foodieService.test.ts` to assert that suggestion logic ranks matches properly.
  ```typescript
  import assert from 'assert';

  try {
    const { getSuggestions } = require('../services/foodieHubService');
    getSuggestions('chicken').then((results: any[]) => {
      assert.ok(results.length > 0, 'Should find at least one match for chicken');
      assert.strictEqual(results[0].name, 'Vibrant Chicken Diner', 'Should rank category match highest');
      console.log("PASS: FoodieHub suggestion engine verified.");
      process.exit(0);
    }).catch((err: any) => {
      console.error("FAIL in promise:", err);
      process.exit(1);
    });
  } catch (err: any) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/foodieService.test.ts`
  Expected: FAIL (service file does not exist)

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/services/foodieHubService.ts`:
  - Implement read/write helper methods using `fs.readFileSync` and `fs.writeFileSync`.
  - Implement `getSuggestions(keyword: string)` ranking:
    1. Check category matches (highest weight).
    2. Check signature dishes (case-insensitive substring match).
    3. Check name and notes.
    4. Sort by matching weight, then by rating descending.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/foodieService.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/foodieHubService.ts src/tests/foodieService.test.ts
  git commit -m "feat: implement FoodieHub service and recommendation ranking engine"
  ```

---

### Task 3: API Router Setup

**Files:**
- Create: `pandory-hub-backend/src/routes/foodieHub.ts`
- Modify: `pandory-hub-backend/src/index.ts`
- Create: `pandory-hub-backend/src/tests/foodieRoutes.test.ts`

**Interfaces:**
- Consumes: REST requests under `/api/foodie-hub`
- Produces: JSON payload for CRUD operations and suggestions query

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/foodieRoutes.test.ts` to verify the routes object loads.
  ```typescript
  import assert from 'assert';

  try {
    const router = require('../routes/foodieHub').default;
    assert.ok(router, 'Should default export Express router');
    console.log("PASS: Router routes verify successfully.");
    process.exit(0);
  } catch (err: any) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/foodieRoutes.test.ts`
  Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/routes/foodieHub.ts` with routes for:
  - `GET /categories`
  - `GET /restaurants`
  - `POST /restaurants`
  - `DELETE /restaurants/:id`
  - `GET /suggestions?q=keyword`
  Register the route file in `pandory-hub-backend/src/index.ts` as `app.use('/api/foodie-hub', foodieHubRoutes);`

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/foodieRoutes.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/routes/foodieHub.ts src/index.ts src/tests/foodieRoutes.test.ts
  git commit -m "feat: expose foodieHub router endpoints"
  ```

---

### Task 4: Frontend View & Routing

**Files:**
- Modify: `pandory-hub/index.html`
- Create: `pandory-hub/src/views/FoodieHubDashboard.vue`
- Modify: `pandory-hub/src/router/index.js`
- Modify: `pandory-hub/src/App.vue`

**Interfaces:**
- Consumes: API endpoints `/api/foodie-hub/*`
- Produces: Interactive dashboard UI showing categories, restaurant forms, and recommendations.

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub/src/tests/foodieUI.test.js` to assert view file existence and typography configuration in index.html.
  ```javascript
  import fs from 'fs';
  import assert from 'assert';
  import path from 'path';

  const viewPath = path.resolve('src/views/FoodieHubDashboard.vue');
  assert.ok(fs.existsSync(viewPath), 'FoodieHubDashboard.vue should exist');

  const htmlPath = path.resolve('index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(
    htmlContent.includes('Karla') && htmlContent.includes('Playfair+Display+SC'),
    'Google fonts should be configured in index.html'
  );
  console.log("PASS: Frontend UI config checklist matches.");
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `node src/tests/foodieUI.test.js`
  Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  Add Karla and Playfair Display SC links to `pandory-hub/index.html`.
  Create `pandory-hub/src/views/FoodieHubDashboard.vue` with warm palette styles (#DC2626 red, #CA8A04 gold) and thick-border layouts.
  Add route in `pandory-hub/src/router/index.js`.
  Add link in navbar `pandory-hub/src/App.vue`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node src/tests/foodieUI.test.js`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add index.html src/views/FoodieHubDashboard.vue src/router/index.js src/App.vue src/tests/foodieUI.test.js
  git commit -m "feat: implement frontend FoodieHubDashboard view and layout routes"
  ```
