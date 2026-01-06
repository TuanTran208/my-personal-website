# Change: Add System Health Monitoring

## Why
The current Pandory Hub dashboard lacks visibility into the server's resource usage. Since the server runs resource-intensive tasks like video transcoding (ffmpeg) and file conversions, it is critical to monitor real-time CPU, RAM, and disk usage to prevent overloads and ensure stability.

## What Changes
- Add a new "System Health" card to the HomeView dashboard.
- Create a new backend API endpoint `/api/health` to stream or return current system stats.
- Integrate `systeminformation` or similar library on the backend to fetch metrics.
- Visualize metrics using `vue-chartjs` on the frontend.

## Impact
- **Affected specs**: `monitoring` (new capability)
- **Affected code**: 
    - Frontend: `src/views/HomeView.vue`, new component `src/components/SystemHealthCard.vue`
    - Backend: `src/index.ts` (or routes file), new service `src/services/healthService.ts`
