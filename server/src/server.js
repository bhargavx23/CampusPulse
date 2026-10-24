import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env configuration
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('[CRITICAL] MongoDB failed to initialize on startup:', err.message);
});

// Allowed CORS origins — supports multiple comma-separated URLs via CLIENT_URL
const allowedOrigins = [
  ...(process.env.CLIENT_URL || '').split(','),
  process.env.CLIENT_URL_LOCAL,
  'http://localhost:5173',
].map((origin) => origin?.trim()).filter(Boolean);

// Security & Parsing Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin/students', studentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'CampusPulse',
    brand: 'StackMitra',
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB (Connected)',
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error occurred.',
  });
});

// Start listening if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`[SERVER] CampusPulse API Server running at http://localhost:${PORT}`);
  });
}

export default app;
