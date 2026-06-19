## Context
We want to add Discord authentication to the Pandory Hub. Currently, the dashboard is fully public, except some utility actions that are protected by a static access key (`x-access-key`). We want to keep general tools public but gate "power features" (Stock Tracker, NAS Server, AI Agent, Home Assistant, Course Management) so only the system owner can access them. Additionally, we are bundling 6 critical P0 fixes from the recent UI/UX review.

## Goals / Non-Goals
- **Goals**: Handle Discord OAuth securely, map a specific Discord ID to the 'Owner' role, protect specific routes/components, fix 6 P0 UI/UX bugs.
- **Non-Goals**: Implement other OAuth providers (Google), handle complex RBAC involving groups or multiple roles, fix non-critical P1/P2 UI issues.

## Decisions
- **Decision**: Use the Discord OAuth2 authorization code grant. The backend will exchange the code for an access token, fetch user info, and issue its own JWT to the frontend.
- **Decision**: Store the JWT Bearer token in `localStorage` in the frontend along with the user profile context, parsing it to find the authenticated role.
- **Decision**: Introduce an `isOwner` flag in the frontend based on the decoded JWT (if the Discord ID matches a configured owner ID). Unauthenticated or non-owner users trying to access protected views will see an "Access Denied" or be redirected.
- **Decision**: Use inline SVG paths for standardizing icons as opposed to pulling in external giant component libraries just for 8 home-screen icons, to keep the footprint small.

## Risks / Trade-offs
- **Risk**: Hardcoding the owner's Discord ID requires code changes if ownership changes. 
  **Mitigation**: Put `OWNER_DISCORD_ID` in the backend `.env` file instead of compiling it into the source.

## Migration Plan
None required. Users without a JWT will fall back to "Guest" access by default.

## Open Questions
- Should the static `x-access-key` be fully replaced by JWT for backend `api/utilities` requests? (Assuming we want to transition to fully JWT-based).
