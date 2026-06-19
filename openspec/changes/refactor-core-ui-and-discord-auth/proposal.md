# Change: Refactor Core UI and Add Discord Auth

## Why
1. The UI has critical usability and aesthetic bugs (6 P0 issues from the recent UI/UX review) that degrade the professional feel of the dashboard and break the development server.
2. We need a way to confidently gate specific, sensitive dashboard utilities (Stock Tracker, NAS Server, AI Agent, Home Assistant, Course Management) tightly to the owner, while keeping the rest of the tools publicly accessible for everyone. Discord OAuth provides a seamless, secure login experience without password management overhead.

## What Changes
- Implement Discord OAuth in the backend, handling the OAuth code exchange.
- Introduce JWT session management and RBAC (Owner vs. Guest) based on the authenticated Discord User ID.
- Update frontend to support Discord login and conditionally restrict access to protected tools for guests.
- Remove `vite-plugin-vue-devtools` to fix the dev server crash.
- Fix body CSS conflict in `main.css`.
- Replace emoji icons with SVG icons (Lucide/Heroicons) in all 8 tool cards.
- Fix the profile image URL in `AboutModal`.
- Add `onUnmounted` cleanup for the 30-second `setInterval` in `SystemHealthCard` to avert memory leaks.
- Set `<html lang="en">` in `index.html`.

## Impact
- **Affected specs**: `ui`, `auth`
- **Affected code**:
  - **Frontend**: `vite.config.js`, `index.html`, `src/assets/main.css`, `src/App.vue`, `src/views/HomeView.vue`, `src/components/tools/*`, `src/components/global/AboutModal.vue`, `src/components/tools/SystemHealth/SystemHealthCard.vue`
  - **Backend**: `src/routes/auth.ts`, `src/services/authService.ts`, `src/middleware/authMiddleware.ts`
