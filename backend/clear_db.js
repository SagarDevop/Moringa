import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bandamart';

if (MONGODB_URI.startsWith('mongodb+srv')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('Failed to set custom DNS servers:', err.message);
  }
}

const categorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Clearing dummy products and categories...');

    const deletedCategories = await Category.deleteMany({});
    const deletedProducts = await Product.deleteMany({});

    console.log(`Deleted ${deletedCategories.deletedCount} categories.`);
    console.log(`Deleted ${deletedProducts.deletedCount} products.`);
    console.log('Database cleared of dummy data successfully! Admin credentials have been preserved.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
