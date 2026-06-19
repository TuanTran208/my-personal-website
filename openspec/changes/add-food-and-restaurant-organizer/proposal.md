# Change: Add Food and Restaurant Organizer (FoodieHub)

## Why
The user wants a centralized system to organize and categorize foods, manage a personal list of visited/preferred restaurants, and get tailored restaurant recommendations based on food types (e.g., finding where to get chicken). Currently, Pandory Hub lacks any food or restaurant tracking capabilities.

## What Changes
- Create a new frontend view `FoodieHubDashboard.vue` to manage categories, search/filter restaurants, and get recommendations.
- Add a new route `/foodie-hub` in the frontend router.
- Implement backend services and routes under `/api/foodie-hub` to manage categories, restaurants, and get recommendations.
- Store the data in a local JSON file (`data/foodie-hub.json`) for simple state persistence.
- Implement the "FoodieHub" Vibrant & Block-based design system using the selected warm palette (#DC2626, #F87171, #CA8A04, #FEF2F2, #450A0A) and typography (Playfair Display SC and Karla).

## Impact
- **Affected specs**: `food-organizer` (new capability)
- **Affected code**:
  - Frontend: `src/views/FoodieHubDashboard.vue`, `src/router/index.js`, `src/App.vue` (navbar/navigation)
  - Backend: `src/index.ts`, `src/routes/foodieHub.ts` (new), `src/services/foodieHubService.ts` (new)
