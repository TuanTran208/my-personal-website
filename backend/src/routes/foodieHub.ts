import express, { Request, Response } from 'express';
import {
  getFoodieHubData,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getSuggestions
} from '../services/foodieHubService';

const router = express.Router();

// Get all foodie hub data (categories and restaurants)
router.get('/', (req: Request, res: Response) => {
  try {
    const data = getFoodieHubData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching FoodieHub data:', error);
    res.status(500).json({ error: 'Failed to fetch FoodieHub data.' });
  }
});

// Add a new restaurant
router.post('/restaurants', (req: Request, res: Response) => {
  try {
    const { name, categoryId, rating, avgPrice, address, signatureDishes, notes } = req.body;

    if (!name || !categoryId || rating === undefined || avgPrice === undefined || !address) {
      return res.status(400).json({ error: 'Missing required restaurant fields.' });
    }

    const newRestaurant = addRestaurant({
      name,
      categoryId,
      rating: Number(rating),
      avgPrice: Number(avgPrice),
      address,
      signatureDishes: Array.isArray(signatureDishes) ? signatureDishes : [],
      notes: notes || '',
      isUnavailable: false
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Failed to add restaurant.' });
  }
});

// Update an existing restaurant
router.put('/restaurants/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = updateRestaurant(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Failed to update restaurant.' });
  }
});

// Delete a restaurant
router.delete('/restaurants/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = deleteRestaurant(id);

    if (!success) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json({ success: true, message: 'Restaurant successfully deleted.' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant.' });
  }
});

// Get food/restaurant suggestions
router.get('/suggest', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }

    const suggestions = getSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions.' });
  }
});

export default router;
