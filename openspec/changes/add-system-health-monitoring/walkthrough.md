# Walkthrough - System Health Monitoring

I have added a System Health Monitoring feature to the Pandory Hub.

## Changes

### Backend (`pandory-hub-backend`)
- **New Dependency**: `systeminformation`
- **New Service**: `src/services/healthService.ts` - Fetches CPU, Memory, and Storage metrics.
- **New Route**: `src/routes/health.ts` - Exposes metrics at `/api/health`.
- **Update**: Registered the route in `src/index.ts`.

### Frontend (`pandory-hub`)
- **New Component**: `src/components/tools/SystemHealth/SystemHealthCard.vue` - a dashboard widget visualizing:
    - CPU Load (Progress Bar)
    - RAM Usage (Progress Bar)
    - Disk Usage (Progress Bar)
- **Update**: Added `SystemHealthCard` to `src/views/HomeView.vue`.

## Verification Results

### Automated Tests
- `curl http://localhost:3001/api/health` was attempted.
- **Status**: The backend server process was running an older version of the code and could not be automatically restarted by the agent.
- **Action Required**: You must restart the backend server manually to see the changes.

### Manual Verification Steps
1. **Restart Backend**:
   ```bash
   cd pandory-hub-backend
   npm run dev
   ```
2. **Verify API**:
   Open `http://localhost:3001/api/health` in your browser. You should see a JSON object with `cpu`, `memory`, and `storage`.
3. **Check Dashboard**:
   Open the Pandory Hub frontend. You should see a new "System Health" card in the Utilities category (or "All").

## Next Steps
- Validate the UI appearance (colors, responsiveness).
- If the CPU load isn't showing, wait a few seconds as it requires a sampling interval (handled by `systeminformation`).
