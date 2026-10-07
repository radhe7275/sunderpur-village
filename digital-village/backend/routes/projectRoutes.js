import express from 'express';
import dataStore from '../config/store.js';

const router = express.Router();

// GET /api/projects - Retrieve all development projects
router.get('/', async (req, res) => {
  try {
    const projects = await dataStore.getProjects();
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message,
    });
  }
});

// POST /api/projects - Admin add new project
router.post('/', async (req, res) => {
  try {
    const { title, description, status, progress } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Project title and description are required',
      });
    }

    const created = await dataStore.addProject(req.body);
    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message,
    });
  }
});

// PUT /api/projects/:id - Admin update project / status / progress
router.put('/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message,
    });
  }
});

export default router;
