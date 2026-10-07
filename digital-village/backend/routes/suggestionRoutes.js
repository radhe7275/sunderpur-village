import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/suggestions - Admin / Citizen view suggestions
router.get('/', async (req, res) => {
  try {
    const suggestions = await dataStore.getSuggestions();
    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: error.message,
    });
  }
});

// POST /api/suggestions - Citizen submit village development suggestion
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please provide a constructive suggestion (min 5 characters)' });
    }

    const saved = await dataStore.addSuggestion({
      name: name.trim(),
      email: email.trim(),
      phone: phone || '',
      category: category || 'Village Development',
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your valuable suggestion has been submitted to the Gram Sabha planning board! Thank you for contributing to our village.',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit suggestion',
      error: error.message,
    });
  }
});

export default router;
