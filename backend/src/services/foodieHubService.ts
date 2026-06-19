import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/foodie-hub.json');

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  categoryId: string;
  rating: number;
  avgPrice: number;
  address: string;
  signatureDishes: string[];
  notes?: string;
  isUnavailable?: boolean;
}

export interface FoodieHubData {
  categories: Category[];
  restaurants: Restaurant[];
}

// Ensure database file is loaded correctly with default structure if missing
const initializeDataFile = (): FoodieHubData => {
  const defaultData: FoodieHubData = {
    categories: [
      { id: "cat-1", name: "Chicken", icon: "Flame" },
      { id: "cat-2", name: "Vietnamese", icon: "Soup" },
      { id: "cat-3", name: "Fast Food", icon: "Beef" },
      { id: "cat-4", name: "Sushi", icon: "Fish" },
      { id: "cat-5", name: "Italian", icon: "Pizza" }
    ],
    restaurants: [
      {
        id: "rest-1",
        name: "Crispy Gold Chicken",
        categoryId: "cat-1",
        rating: 4.8,
        avgPrice: 120000,
        address: "123 Food Street, District 1",
        signatureDishes: ["Fried Chicken Legs", "Honey Garlic Wings"],
        notes: "Best crunchy chicken in town. Highly recommend the garlic wings."
      },
      {
        id: "rest-2",
        name: "Pho Traditional",
        categoryId: "cat-2",
        rating: 4.9,
        avgPrice: 75000,
        address: "456 Heritage Road, District 3",
        signatureDishes: ["Pho Rare Beef", "Pho Chicken"],
        notes: "Super rich broth. Open early in the morning."
      },
      {
        id: "rest-3",
        name: "Gourmet Pizza Hub",
        categoryId: "cat-5",
        rating: 4.5,
        avgPrice: 250000,
        address: "789 Oven Boulevard, District 7",
        signatureDishes: ["Pepperoni Deluxe", "BBQ Chicken Pizza"],
        notes: "Woodfired pizzas. Great cheese pull."
      }
    ]
  };

  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to initialize foodie-hub.json:', error);
    return defaultData;
  }
};

export const getFoodieHubData = (): FoodieHubData => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading foodie-hub data:', error);
  }
  return initializeDataFile();
};

export const saveFoodieHubData = (data: FoodieHubData): boolean => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving foodie-hub data:', error);
    return false;
  }
};

export const addRestaurant = (restaurantData: Omit<Restaurant, 'id'>): Restaurant => {
  const data = getFoodieHubData();
  const newRestaurant: Restaurant = {
    ...restaurantData,
    id: `rest-${Date.now()}`
  };
  data.restaurants.push(newRestaurant);
  saveFoodieHubData(data);
  return newRestaurant;
};

export const updateRestaurant = (id: string, updatedFields: Partial<Restaurant>): Restaurant | null => {
  const data = getFoodieHubData();
  const index = data.restaurants.findIndex(r => r.id === id);
  if (index === -1) return null;

  const updatedRestaurant = {
    ...data.restaurants[index],
    ...updatedFields
  };
  data.restaurants[index] = updatedRestaurant;
  saveFoodieHubData(data);
  return updatedRestaurant;
};

export const deleteRestaurant = (id: string): boolean => {
  const data = getFoodieHubData();
  const initialLength = data.restaurants.length;
  data.restaurants = data.restaurants.filter(r => r.id !== id);
  if (data.restaurants.length === initialLength) return false;
  saveFoodieHubData(data);
  return true;
};

export const getSuggestions = (query: string): Restaurant[] => {
  const data = getFoodieHubData();
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  // Find category IDs matching query
  const matchingCategoryIds = data.categories
    .filter(c => c.name.toLowerCase().includes(cleanQuery))
    .map(c => c.id);

  return data.restaurants.filter(r => {
    // 1. Matches Category
    if (matchingCategoryIds.includes(r.categoryId)) return true;

    // 2. Matches Restaurant Name
    if (r.name.toLowerCase().includes(cleanQuery)) return true;

    // 3. Matches Signature Dishes
    const dishMatch = r.signatureDishes.some(dish => dish.toLowerCase().includes(cleanQuery));
    if (dishMatch) return true;

    // 4. Matches Notes
    if (r.notes && r.notes.toLowerCase().includes(cleanQuery)) return true;

    return false;
  }).sort((a, b) => b.rating - a.rating); // Sort by highest rating first
};
