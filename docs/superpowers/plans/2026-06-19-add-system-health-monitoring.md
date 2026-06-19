# System Health Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide visibility into the server's CPU, Memory, and Disk usage on the Pandory Hub dashboard.

**Architecture:** Use the `systeminformation` library in the backend to retrieve hardware utilization metrics. Expose this data via a REST endpoint `/api/health`. Create a frontend widget `SystemHealthCard.vue` to fetch and display the metrics in real time.

**Tech Stack:** Node.js, Express, TypeScript, `systeminformation`, Vue 3, Chart.js.

## Global Constraints
- System stats must be returned as formatted percentages.
- The frontend card must cleanly dispose of any refresh intervals on unmount to prevent memory leaks.
- All backend TypeScript code must compile without errors using `npm run build`.

---

### Task 1: Setup & Dependencies

**Files:**
- Modify: `pandory-hub-backend/package.json`
- Create: `pandory-hub-backend/src/tests/healthSetup.test.ts`

**Interfaces:**
- Consumes: None
- Produces: None

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/healthSetup.test.ts` to assert that `systeminformation` can be imported.
  ```typescript
  import assert from 'assert';

  try {
    require('systeminformation');
    console.log("PASS: systeminformation imported successfully.");
  } catch (err: any) {
    console.error("FAIL: systeminformation not installed.");
    assert.fail("systeminformation module is not available.");
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/healthSetup.test.ts`
  Expected: FAIL with "Cannot find module 'systeminformation'"

- [ ] **Step 3: Write minimal implementation**
  Add dependency to `pandory-hub-backend/package.json` under `"dependencies"`:
  ```json
  "systeminformation": "^5.29.0"
  ```
  Install dependencies:
  Run: `npm install` inside `pandory-hub-backend/`

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/healthSetup.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add package.json package-lock.json src/tests/healthSetup.test.ts
  git commit -m "chore: add systeminformation dependency for hardware metrics"
  ```

---

### Task 2: Health Service Implementation

**Files:**
- Create: `pandory-hub-backend/src/services/healthService.ts`
- Create: `pandory-hub-backend/src/tests/healthService.test.ts`

**Interfaces:**
- Consumes: `systeminformation` APIs
- Produces: `getSystemStats(): Promise<{ cpu: number, mem: number, fs: number }>`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/healthService.test.ts` to verify the returned structure and values of healthService.
  ```typescript
  import assert from 'assert';

  try {
    const { getSystemStats } = require('../services/healthService');
    getSystemStats().then((stats: any) => {
      assert.ok(typeof stats.cpu === 'number', 'cpu utilization should be a number');
      assert.ok(stats.cpu >= 0 && stats.cpu <= 100, 'cpu should be between 0 and 100');
      assert.ok(typeof stats.mem === 'number', 'mem utilization should be a number');
      assert.ok(stats.mem >= 0 && stats.mem <= 100, 'mem should be between 0 and 100');
      assert.ok(typeof stats.fs === 'number', 'fs utilization should be a number');
      assert.ok(stats.fs >= 0 && stats.fs <= 100, 'fs should be between 0 and 100');
      console.log("PASS: getSystemStats returns correct interface and ranges.");
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
  Run: `npx ts-node src/tests/healthService.test.ts`
  Expected: FAIL with "Cannot find module '../services/healthService'"

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/services/healthService.ts`:
  ```typescript
  import si from 'systeminformation';

  export async function getSystemStats() {
    try {
      const currentLoad = await si.currentLoad();
      const mem = await si.mem();
      const fsSize = await si.fsSize();

      // CPU load percentage
      const cpu = Math.round(currentLoad.currentLoad);

      // Memory utilization percentage
      const memUsed = mem.active;
      const memTotal = mem.total;
      const memPercent = Math.round((memUsed / memTotal) * 100);

      // Main disk utilization percentage (first disk partition found)
      const mainFs = fsSize[0];
      const fsPercent = mainFs ? Math.round(mainFs.use) : 0;

      return {
        cpu,
        mem: memPercent,
        fs: fsPercent
      };
    } catch (err) {
      console.error('Error fetching system stats:', err);
      return { cpu: 0, mem: 0, fs: 0 };
    }
  }
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/healthService.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/healthService.ts src/tests/healthService.test.ts
  git commit -m "feat: implement healthService using systeminformation library"
  ```

---

### Task 3: API Route Registration

**Files:**
- Create: `pandory-hub-backend/src/routes/health.ts`
- Modify: `pandory-hub-backend/src/index.ts`
- Create: `pandory-hub-backend/src/tests/healthRoute.test.ts`

**Interfaces:**
- Consumes: `/api/health` REST request
- Produces: JSON response with hardware stats

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/healthRoute.test.ts` to query the router.
  ```typescript
  import assert from 'assert';
  import express from 'express';
  import healthRouter from '../routes/health';

  const app = express();
  app.use('/api/health', healthRouter);

  // Simple test function using http server simulation or direct function call
  try {
    const routerModule = require('../routes/health').default;
    assert.ok(routerModule, 'health router should default export');
    console.log("PASS: Health route module resolves.");
  } catch (err: any) {
    console.error("FAIL:", err.message);
    assert.fail(err.message);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/healthRoute.test.ts`
  Expected: FAIL (route file does not exist)

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub-backend/src/routes/health.ts`:
  ```typescript
  import { Request, Response, Router } from 'express';
  import { getSystemStats } from '../services/healthService';

  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const stats = await getSystemStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve system stats.' });
    }
  });

  export default router;
  ```
  Register in `pandory-hub-backend/src/index.ts`:
  ```typescript
  import healthRoutes from './routes/health';
  app.use('/api/health', healthRoutes);
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/healthRoute.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/routes/health.ts src/index.ts src/tests/healthRoute.test.ts
  git commit -m "feat: register /api/health endpoint in express router"
  ```

---

### Task 4: Frontend System Health Card Widget

**Files:**
- Create: `pandory-hub/src/components/tools/SystemHealth/SystemHealthCard.vue`
- Modify: `pandory-hub/src/views/HomeView.vue`

**Interfaces:**
- Consumes: `/api/health` REST endpoint
- Produces: Displays metrics visually, and cleans up polling on unmount.

- [ ] **Step 1: Write the failing test**
  Write a component check script `pandory-hub/src/tests/healthCard.test.js` to assert file and cleanup properties exist.
  ```javascript
  import fs from 'fs';
  import assert from 'assert';
  import path from 'path';

  const cardPath = path.resolve('src/components/tools/SystemHealth/SystemHealthCard.vue');
  assert.ok(fs.existsSync(cardPath), 'SystemHealthCard.vue must exist');
  const cardContent = fs.readFileSync(cardPath, 'utf8');

  // Verify memory leak protection
  assert.ok(
    cardContent.includes('clearInterval') || cardContent.includes('onUnmounted'),
    'SystemHealthCard must clear active polling intervals on unmount'
  );
  console.log("PASS: SystemHealthCard cleanup checks pass.");
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `node src/tests/healthCard.test.js`
  Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  Create `pandory-hub/src/components/tools/SystemHealth/SystemHealthCard.vue` with progress bars or charts showing CPU, memory, and disk usage. Query `/api/health` every 10 seconds. Implement `onUnmounted(() => clearInterval(interval))` to prevent memory leaks.
  Integrate `SystemHealthCard` in `pandory-hub/src/views/HomeView.vue` in the list of tools.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node src/tests/healthCard.test.js`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/tools/SystemHealth/SystemHealthCard.vue src/views/HomeView.vue
  git commit -m "feat: add frontend SystemHealthCard widget with polling cleanup"
  ```
