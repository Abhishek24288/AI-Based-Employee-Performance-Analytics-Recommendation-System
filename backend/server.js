const dns = require('dns');
// Force Node.js to use Google's Public DNS to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('⚠️ Custom DNS configuration failed, using system defaults.');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidate-shortlist', {
  serverSelectionTimeoutMS: 2000
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('⚠️ MongoDB connection error (falling back to JSON File Database):', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      if (mongoose.connection.readyState !== 1) {
        console.log('📂 Guruji AI is operating in fallback Local File Database mode.');
      }
    });
  });
