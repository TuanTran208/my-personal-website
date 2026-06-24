# Core UI and Discord Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement secure Discord OAuth login with Owner-only role restrictions, and fix six critical P0 UI/UX bugs (including dev server crash, memory leak, dark mode flash, and emoji standardization).

**Architecture:** Exchange Discord OAuth codes on the backend and issue a JWT containing a robust `isOwner` check (coercing values to trimmed strings to prevent type mismatch on page refresh). Save the token in frontend `localStorage`, using navigation guards to protect private routes. Apply clean UI fixes to remove Vue DevTools in production, clean body CSS, replace emojis with inline SVGs, and resolve memory leaks.

**Tech Stack:** Vue 3 (Composition API), Vite, Express, TypeScript, `jsonwebtoken`, `axios`.

## Global Constraints
- Avoid importing bulky UI frameworks; use custom, native inline SVG icons for all tool cards.
- String-based user IDs from Discord must be compared safely by casting to `String()` and calling `.trim()`.
- Use Vue lifecycle hooks (`onUnmounted`) to properly clean up intervals.

---

### Task 1: Discord Authentication Backend

**Files:**
- Modify: `pandory-hub-backend/src/services/authService.ts`
- Modify: `pandory-hub-backend/src/routes/auth.ts`
- Modify: `pandory-hub-backend/src/middleware/authMiddleware.ts`
- Create: `pandory-hub-backend/src/tests/auth.test.ts`

**Interfaces:**
- Consumes: Discord OAuth redirect code
- Produces: JWT containing `{ id, username, avatar, isOwner }`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub-backend/src/tests/auth.test.ts` to assert that `generateToken` sets `isOwner` properly, and handles string coercion safely.
  ```typescript
  import assert from 'assert';
  import { authService } from '../services/authService';

  // Mock process.env
  process.env.DISCORD_OWNER_ID = ' 779261512308752394 '; // With spaces

  const mockUserStringId = { id: '779261512308752394', username: 'testuser', avatar: 'avatar_hash' };
  const mockUserNumberId = { id: 779261512308752394, username: 'testuser', avatar: 'avatar_hash' };

  try {
    const token1 = authService.generateToken(mockUserStringId);
    const payload1: any = authService.verifyToken(token1);
    assert.strictEqual(payload1.isOwner, true, 'Should match string IDs');

    const token2 = authService.generateToken(mockUserNumberId);
    const payload2: any = authService.verifyToken(token2);
    assert.strictEqual(payload2.isOwner, true, 'Should match number IDs after coercion');

    console.log("PASS: AuthService robust generation test.");
    process.exit(0);
  } catch (err: any) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ts-node src/tests/auth.test.ts`
  Expected: FAIL (type mismatch or untrimmed string checks fail)

- [ ] **Step 3: Write minimal implementation**
  Modify `generateToken` in `pandory-hub-backend/src/services/authService.ts`:
  ```typescript
  generateToken(discordUser: any) {
      const ownerId = (process.env.DISCORD_OWNER_ID || '').trim();
      const jwtSecret = process.env.JWT_SECRET || 'pandory_fallback_secret';
      const isOwner = ownerId !== '' && String(discordUser.id).trim() === ownerId;
      
      const payload = {
          id: String(discordUser.id).trim(),
          username: discordUser.username,
          avatar: discordUser.avatar,
          isOwner
      };

      return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  }
  ```
  Modify `/api/auth/discord/callback` in `pandory-hub-backend/src/routes/auth.ts`:
  ```typescript
  router.post('/discord/callback', async (req: Request, res: Response) => {
      const { code } = req.body;
      if (!code) {
          return res.status(400).json({ error: 'Missing authorization code.' });
      }

      try {
          const discordUser = await authService.handleDiscordLogin(code);
          const token = authService.generateToken(discordUser);
          const ownerId = (process.env.DISCORD_OWNER_ID || '').trim();
          
          res.json({
              success: true,
              token,
              user: {
                  id: String(discordUser.id).trim(),
                  username: discordUser.username,
                  avatar: discordUser.avatar,
                  isOwner: ownerId !== '' && String(discordUser.id).trim() === ownerId
              }
          });
      } catch (error: any) {
          console.error('Discord authentication error:', error.message);
          res.status(401).json({ error: 'Authentication failed.' });
      }
  });
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ts-node src/tests/auth.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/authService.ts src/routes/auth.ts src/tests/auth.test.ts
  git commit -m "fix: resolve role mismatch on token generation by coercing ID comparisons"
  ```

---

### Task 2: Discord Authentication Frontend

**Files:**
- Modify: `pandory-hub/src/composables/useAuth.js`
- Modify: `pandory-hub/src/router/index.js`
- Create: `pandory-hub/src/tests/useAuth.test.js`

**Interfaces:**
- Consumes: `localStorage.getItem('pandory_jwt')`
- Produces: `isOwner: Ref<boolean>`, `user: Ref<UserObject>`

- [ ] **Step 1: Write the failing test**
  Create `pandory-hub/src/tests/useAuth.test.js` to assert that `useAuth` correctly initializes the state on import if a token exists in `localStorage`.
  ```javascript
  import assert from 'assert';
  import { JSDOM } from 'jsdom';

  // Setup DOM environment
  const dom = new JSDOM('', { url: 'http://localhost' });
  global.window = dom.window;
  global.localStorage = dom.window.localStorage;

  // Mock a token
  const testPayload = { id: '779261512308752394', username: 'test', isOwner: true, exp: Math.floor(Date.now() / 1000) + 3600 };
  const mockToken = `header.${btoa(JSON.stringify(testPayload))}.signature`;
  localStorage.setItem('pandory_jwt', mockToken);

  try {
    const { useAuth } = await import('../composables/useAuth.js');
    const { isOwner } = useAuth();
    assert.strictEqual(isOwner.value, true, 'isOwner should remain true after initial load from storage');
    console.log("PASS: useAuth initialization verified.");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `node src/tests/useAuth.test.js`
  Expected: FAIL (assertion fails or imports break)

- [ ] **Step 3: Write minimal implementation**
  Review and clean up `pandory-hub/src/composables/useAuth.js` to ensure the token check and decoding matches the backend payload. Ensure `isOwner` evaluates correctly on module import.
  Ensure router navigation guard in `pandory-hub/src/router/index.js` properly checks the `isOwner` state.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node src/tests/useAuth.test.js`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/composables/useAuth.js src/router/index.js src/tests/useAuth.test.js
  git commit -m "fix: ensure useAuth correctly decodes isOwner flag from stored token"
  ```

---

### Task 3: P0 UI/UX Fixes

**Files:**
- Modify: `pandory-hub/vite.config.js`
- Modify: `pandory-hub/src/assets/main.css`
- Modify: `pandory-hub/src/views/HomeView.vue`
- Modify: `pandory-hub/src/components/global/AboutModal.vue`
- Modify: `pandory-hub/src/components/tools/SystemHealth/SystemHealthCard.vue` (If exists)
- Modify: `pandory-hub/index.html`

**Interfaces:**
- Consumes: None
- Produces: None

- [ ] **Step 1: Write the failing test**
  Write a script to lint/validate the UI components and assert `vite-plugin-vue-devtools` is commented out/removed.
  Create `pandory-hub/src/tests/ui.test.js`:
  ```javascript
  import fs from 'fs';
  import assert from 'assert';
  import path from 'path';

  const configPath = path.resolve('vite.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');

  // Assert vueDevTools is not active
  assert.ok(
    !configContent.includes('vueDevTools()') || configContent.includes('// vueDevTools()'),
    'vueDevTools should be disabled to prevent dev crash'
  );

  const mainCssPath = path.resolve('src/assets/main.css');
  const mainCssContent = fs.readFileSync(mainCssPath, 'utf8');
  assert.ok(
    !mainCssContent.includes('@apply bg-gray-900 text-white'),
    'Should not enforce bg-gray-900 on body'
  );

  console.log("PASS: P0 UI rules verified.");
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `node src/tests/ui.test.js`
  Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Edit `pandory-hub/vite.config.js` to ensure `vueDevTools` is fully commented out or removed.
  - Edit `pandory-hub/src/assets/main.css` to remove the body `@apply` rule that overrides background colors.
  - Edit `pandory-hub/src/views/HomeView.vue` to replace emojis with clean SVG icon paths.
  - Edit `pandory-hub/src/components/global/AboutModal.vue` to correct the avatar profile link.
  - Edit `pandory-hub/src/components/tools/SystemHealth/SystemHealthCard.vue` (or corresponding polling system) to add `onUnmounted(() => clearInterval(...))`.
  - Add `lang="en"` to `<html>` tag in `pandory-hub/index.html`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node src/tests/ui.test.js`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add vite.config.js src/assets/main.css src/views/HomeView.vue src/components/global/AboutModal.vue index.html src/tests/ui.test.js
  git commit -m "fix: resolve critical P0 UI/UX bugs, disable devtools and remove body bg override"
  ```
