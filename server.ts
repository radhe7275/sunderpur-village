import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './digital-village/backend/config/db.js';
import villageRoutes from './digital-village/backend/routes/villageRoutes.js';
import facilityRoutes from './digital-village/backend/routes/facilityRoutes.js';
import projectRoutes from './digital-village/backend/routes/projectRoutes.js';
import eventRoutes from './digital-village/backend/routes/eventRoutes.js';
import galleryRoutes from './digital-village/backend/routes/galleryRoutes.js';
import contactRoutes from './digital-village/backend/routes/contactRoutes.js';
import newsRoutes from './digital-village/backend/routes/newsRoutes.js';
import suggestionRoutes from './digital-village/backend/routes/suggestionRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Digital Village – Our Village, Our Pride 🌾',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API route not found' });
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Digital Village Server active on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

export default app;
