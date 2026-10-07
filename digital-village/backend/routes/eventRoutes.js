import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/events - Retrieve upcoming village events
router.get('/', async (req, res) => {
  try {
    const events = await dataStore.getEvents();
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    });
  }
});

// POST /api/events - Admin add new event
router.post('/', async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    if (!title || !date || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, location, and description are required',
      });
    }

    const created = await dataStore.addEvent(req.body);
    res.status(201).json({
      success: true,
      message: 'Event scheduled successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
    });
  }
});

// PUT /api/events/:id - Admin edit event
router.put('/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message,
    });
  }
});

// DELETE /api/events/:id - Admin delete event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dataStore.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message,
    });
  }
});

export default router;
