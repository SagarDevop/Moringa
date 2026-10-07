import mongoose from 'mongoose';
import dns from 'dns';
import { seedDefaultAdmin } from '../models/Admin.js';

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bandamart';

  if (MONGODB_URI.startsWith('mongodb+srv')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
      console.warn('Failed to set custom DNS servers, using system defaults:', err.message);
    }
  }

  try {
    await mongoose.connect(MONGODB_URI, { maxPoolSize: 50 });
    console.log('Connected to MongoDB successfully!');
    await seedDefaultAdmin();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
