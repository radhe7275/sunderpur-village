import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import villageRoutes from './routes/villageRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Endpoints
app.use('/api/village', villageRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Digital Village - Our Village, Our Pride 🌾',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback for SPA routing if requested
app.get('*', (req, res) => {
  // If API route was not matched, return 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message,
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Digital Village Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving frontend from ${frontendPath}`);
  });
}

export default app;
