import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/facilities - Retrieve all 16 facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await dataStore.getFacilities();
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facilities',
      error: error.message,
    });
  }
});

// POST /api/facilities - Admin add new facility
router.post('/', async (req, res) => {
  try {
    const { title, description, icon, category, timings, details } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    const created = await dataStore.addFacility(req.body);
    res.status(201).json({
      success: true,
      message: 'Facility added successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create facility',
      error: error.message,
    });
  }
});

// PUT /api/facilities/:id - Admin update facility
router.put('/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateFacility(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Facility updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update facility',
      error: error.message,
    });
  }
});

// DELETE /api/facilities/:id - Admin delete facility
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dataStore.deleteFacility(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Facility deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility',
      error: error.message,
    });
  }
});

export default router;
