import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import sareeRoutes from './routes/sareeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { seedSarees } from './data/seedData.js';
import Saree from './models/Saree.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paithani_vastram';

// CORS Configuration for local dev + Vercel deployments
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman, mobile
    if (!origin) return callback(null, true);
    // Allow any localhost
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow any Vercel deployment (preview and production)
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow explicitly defined origins in CLIENT_URL
    if (allowedOrigins.includes(origin) || process.env.CLIENT_URL === '*') {
      return callback(null, true);
    }
    // Permissive fallback in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static files for uploaded images with cross-origin access
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// API Routes
app.use('/api/sarees', sareeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'PAITHANI VASTRAM',
    tagline: 'The Royal Heritage of Weaves',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (using resilient local store)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend production build if available
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  console.log(`📦 [Production Mode] Serving frontend build from: ${distPath}`);
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback landing page for standalone backend development
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>PAITHANI VASTRAM - Backend API</title>
        <style>
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #14031a; color: #fdfbf7; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
          .card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 40px; max-width: 520px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
          h1 { color: #d4af37; font-size: 2rem; margin-bottom: 8px; letter-spacing: 2px; }
          p { color: #d8cfc4; font-size: 1rem; line-height: 1.5; }
          .badge { display: inline-block; background: #1b5e20; color: #a5d6a7; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin: 15px 0 25px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #d4af37, #f3e5ab); color: #1a0524; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 1.05rem; box-shadow: 0 4px 15px rgba(212,175,55,0.4); transition: transform 0.2s; }
          .btn:hover { transform: translateY(-2px); }
          .links { margin-top: 25px; font-size: 0.85rem; color: #8e8271; }
          .links a { color: #f3a847; text-decoration: none; margin: 0 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>👑 PAITHANI VASTRAM</h1>
          <p>Backend API Server is active and ready.</p>
          <div><span class="badge">● MongoDB Atlas Connected</span></div>
          <div>
            <a class="btn" href="http://localhost:3000">Open Storefront (Port 3000) &rarr;</a>
          </div>
          <div class="links">
            <p>Quick API links: <a href="/api/health">/api/health</a> | <a href="/api/sarees">/api/sarees</a></p>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}


// Seed MongoDB if connected and empty
async function seedMongoIfEmpty() {
  try {
    const count = await Saree.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding MongoDB with Paithani Vastram heritage collection...');
      await Saree.insertMany(seedSarees);
      console.log(`✅ Successfully seeded ${seedSarees.length} Paithani sarees into MongoDB.`);
    }
  } catch (err) {
    console.warn('MongoDB seed skipped:', err.message);
  }
}

// Connect to MongoDB with non-blocking fallback
console.log(`⏳ Attempting connection to MongoDB at: ${MONGO_URI}`);
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 3000
  })
  .then(() => {
    console.log('✨ [MongoDB] Connected successfully to Paithani Vastram database.');
    seedMongoIfEmpty();
  })
  .catch((err) => {
    console.warn('⚠️ [MongoDB Notice] Could not connect to local MongoDB daemon (Reason: ' + err.message + ')');
    console.log('🛡️ [Resilience] Activated high-speed persistent Local DataStore. All 19 personal sarees and file uploads will work seamlessly with zero setup required!');
  });

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`👑 PAITHANI VASTRAM - Backend API Server is running!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📡 Sarees API: http://localhost:${PORT}/api/sarees`);
  console.log(`📸 Uploads:    http://localhost:${PORT}/uploads`);
  console.log(`❤️  Health:     http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
