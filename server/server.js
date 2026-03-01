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

// Initialize Memory DB Before Routes
const startServer = async () => {
  try {
    await connectDB();

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
      res.json({ status: 'OK', message: 'Eastern Vacations API is running' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!', error: err.message });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
