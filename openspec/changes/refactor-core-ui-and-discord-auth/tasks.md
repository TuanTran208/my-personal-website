## 1. Discord Authentication Backend
- [ ] 1.1 Install dependencies (`jsonwebtoken`, `axios`).
- [ ] 1.2 Implement `AuthService.handleDiscordLogin` to exchange authorization code for Discord user profile.
- [ ] 1.3 Implement `AuthService.generateToken` to issue JWTs containing user ID, username, and owner status based on the `DISCORD_OWNER_ID` env variable.
- [ ] 1.4 Implement backend callback route for Discord OAuth (`/api/auth/discord/callback`).
- [ ] 1.5 Update `authMiddleware.ts` to accept Bearer JWT tokens.

## 2. Discord Authentication Frontend
- [ ] 2.1 Add "Login with Discord" and "Logout" buttons in `SideNavigation.vue` or App header.
- [ ] 2.2 Create an OAuth callback view/route to receive the JWT and store it in `localStorage`.
- [ ] 2.3 Implement frontend state logic (Vue composition setup) for authentication (`user` object, `isOwner` flag).
- [ ] 2.4 Add Vue Router navigation guards `beforeEach` to protect route paths for: Stock Tracker, NAS Server, AI Agent, Home Assistant, and Course Management.

## 3. P0 UI/UX Fixes
- [ ] 3.1 Remove or conditionally comment out `vite-plugin-vue-devtools` in `vite.config.js`.
- [ ] 3.2 Remove the `@apply bg-gray-900 text-white` enforced rule from `body` in `src/assets/main.css`.
- [ ] 3.3 Replace emoji icons with SVG paths in `HomeView.vue` tool definitions to align with professional UI recommendations.
- [ ] 3.4 Correct the GitHub Avatar Image URL in `AboutModal.vue` to `TuanTran208`'s profile image.
- [ ] 3.5 Add `onUnmounted(() => clearInterval(...))` in `SystemHealthCard.vue` to plug the memory leak.
- [ ] 3.6 Add `lang="en"` to the `<html>` tag in `index.html`.
