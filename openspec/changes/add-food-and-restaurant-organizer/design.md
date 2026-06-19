# Design: Food and Restaurant Organizer (FoodieHub)

## Context
The goal is to provide a clean, visually appealing UI and a simple backend to organize food categories and restaurants, search them, and get smart recommendations based on specific foods (like chicken).

## Goals / Non-Goals
### Goals
- Manage food categories (e.g., Fast Food, Vietnamese, Italian, Sushi).
- CRUD operations for restaurants (Add, Read, Update, Delete).
- Quick filter by category and text search by name/signature dishes.
- Search-centric recommendation engine to suggest where to eat specific items.
- Consistent UI design matching the proposed design system.

### Non-Goals
- Integration with external maps APIs (like Google Maps/Mapbox) for actual location coordinates (keep it to textual addresses for now).
- Multi-user separation or authentication for restaurants (use the existing dashboard authentication/owner gate if needed, or keep it open similar to the utilities dashboard).

## Decisions

### 1. Data Models
We will define the following interfaces in TypeScript:

```typescript
export interface Category {
  id: string;
  name: string;      // e.g. "Chicken", "Vietnamese"
  description?: string;
  icon?: string;      // SVG name
}

export interface Restaurant {
  id: string;
  name: string;
  categoryId: string; // foreign key
  rating: number;     // 1-5 stars
  avgPrice: number;   // approximate cost indicator
  address: string;
  signatureDishes: string[]; // e.g. ["Fried Chicken", "Garlic Wings"]
  notes?: string;
  isUnavailable?: boolean; // instead of deleting, we can flag or remove
}
```

### 2. Suggestion Engine
When a user searches for a food suggestion (e.g., "chicken"):
1. The backend or frontend checks if the keyword matches any category name (e.g., "Chicken").
2. The search inspects each restaurant's `signatureDishes` (case-insensitive substring match).
3. The search inspects each restaurant's `notes` and `name`.
4. Returns a ranked list sorted by:
   - Category match (highest weight)
   - Signature dish match
   - Rating (descending)

### 3. Styling & Fonts
- Google Fonts `Karla` and `Playfair Display SC` will be loaded in the main app.
- Styling will use the appetite-stimulating color scheme:
  - Primary (Red): `bg-red-600` / `text-red-600`
  - Secondary (Light Red): `bg-red-400` / `text-red-400`
  - Background (Warm Rose/Tint): `bg-rose-50/50` / `bg-rose-100`
  - CTA (Gold): `bg-amber-600` / `hover:bg-amber-700`
  - Text (Dark Red-Brown): `text-stone-900` or `text-red-950`
- Block layout UI elements with thick borders (`border-4 border-stone-900`) for that trendy neo-brutalist / vibrant-blocky vibe.

## Risks / Trade-offs
- **File System Storage**: Storing in `data/foodie-hub.json` is simple but doesn't handle concurrent writes well. Since this is a personal single-user app, this risk is negligible. We will use synchronous read/write helper utilities with error handling to avoid corruption.
