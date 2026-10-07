import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/village - Get comprehensive village profile & statistics
router.get('/', async (req, res) => {
  try {
    const village = await dataStore.getVillage();
    const places = await dataStore.getPlaces();
    const heroes = await dataStore.getHeroes();
    const culture = await dataStore.getCulture();

    res.status(200).json({
      success: true,
      data: {
        ...village,
        places,
        heroes,
        culture,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch village data',
      error: error.message,
    });
  }
});

// PUT /api/village - Admin update village details
router.put('/', async (req, res) => {
  try {
    const updated = await dataStore.updateVillage(req.body);
    res.status(200).json({
      success: true,
      message: 'Village profile updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update village profile',
      error: error.message,
    });
  }
});

export default router;
