import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/gallery - Retrieve photo gallery, optional ?category=Nature
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const items = await dataStore.getGallery(category);
    res.status(200).json({
      success: true,
      count: items.length,
      category: category || 'All',
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message,
    });
  }
});

// POST /api/gallery - Admin add photo
router.post('/', async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required',
      });
    }

    const created = await dataStore.addGalleryItem(req.body);
    res.status(201).json({
      success: true,
      message: 'Photo added to village gallery',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add gallery item',
      error: error.message,
    });
  }
});

// DELETE /api/gallery/:id - Admin delete photo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dataStore.deleteGalleryItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Photo deleted from gallery',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
      error: error.message,
    });
  }
});

export default router;
