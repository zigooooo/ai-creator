import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { router } from './api/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);
app.use('/', router);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Autonomous AI Creator API', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production if built
const clientBuildPath = path.join(process.cwd(), 'client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend static build not found. Run npm run build.');
    }
  });
});

if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Autonomous AI Creator Engine running on port ${PORT}`);
    console.log(`  API Base URL: http://localhost:${PORT}/api`);
    console.log(`  SSE Event Stream: http://localhost:${PORT}/api/events`);
    console.log(`=======================================================`);
  });
}

export default app;
