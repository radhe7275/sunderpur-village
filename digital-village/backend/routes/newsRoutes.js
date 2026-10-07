import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/news - Retrieve all news & announcements
router.get('/', async (req, res) => {
  try {
    const news = await dataStore.getNews();
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message,
    });
  }
});

// POST /api/news - Admin publish news
router.post('/', async (req, res) => {
  try {
    const { title, summary, category, date, details, isPinned } = req.body;
    if (!title || !summary) {
      return res.status(400).json({
        success: false,
        message: 'News title and summary are required',
      });
    }

    const created = await dataStore.addNews({
      title,
      summary,
      category,
      date,
      details,
      isPinned,
    });

    res.status(201).json({
      success: true,
      message: 'News announcement published successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish news',
      error: error.message,
    });
  }
});

// DELETE /api/news/:id - Admin delete news
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dataStore.deleteNews(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'News item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'News item deleted',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete news item',
      error: error.message,
    });
  }
});

export default router;
