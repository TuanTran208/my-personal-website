## 1. Backend Implementation
- [x] 1.1 Create seed data file `data/foodie-hub.json` with initial categories and example restaurants.
- [x] 1.2 Implement `src/services/foodieHubService.ts` to manage categories, restaurants, and filter/recommendation logic.
- [x] 1.3 Create backend router `src/routes/foodieHub.ts` with endpoints for CRUD operations and suggestions.
- [x] 1.4 Register the `/api/foodie-hub` routes in `src/index.ts`.

## 2. Frontend Implementation
- [x] 2.1 Import Google Fonts (Karla and Playfair Display SC) in `index.html` or `main.js`.
- [x] 2.2 Create `src/views/FoodieHubDashboard.vue` with layout, category filters, restaurant list (add/edit/delete modals), and the suggestion search interface.
- [x] 2.3 Add `/foodie-hub` route to `src/router/index.js`.
- [x] 2.4 Add "FoodieHub" link to the navbar in `src/App.vue`.

## 3. Verification
- [x] 3.1 Test backend endpoints using curl/Postman.
- [x] 3.2 Verify the UI responsive behavior on mobile and desktop.
- [x] 3.3 Verify recommendation logic returns appropriate matches for keywords like "chicken".
