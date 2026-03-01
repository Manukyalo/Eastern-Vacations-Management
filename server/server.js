const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./memoryDb');
const aiRoutes = require('./routes/ai'); // AI Engine

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Memory DB Promise for Vercel Serverless
let dbInitPromise = null;

// Ensure DB is connected before handling any routes
app.use(async (req, res, next) => {
  if (!dbInitPromise) {
    dbInitPromise = connectDB();
  }
  try {
    await dbInitPromise;
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/ai', aiRoutes); // Embedded AI Recovery
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eastern Vacations API is running on Vercel' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Local Development Fallback
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Vercel requires the raw express App to be exported
module.exports = app;
