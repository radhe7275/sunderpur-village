import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/contact - Admin view contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await dataStore.getContacts();
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact inquiries',
      error: error.message,
    });
  }
});

// POST /api/contact - Citizen submit contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Message must be at least 5 characters long.' });
    }

    const saved = await dataStore.addContact({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject || 'Citizen Inquiry',
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been submitted to the Gram Panchayat. Our team will contact you shortly.',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again.',
      error: error.message,
    });
  }
});

export default router;
