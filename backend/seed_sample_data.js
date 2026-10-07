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

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  bgColor: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  costPrice: { type: Number },
  unit: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const seedCategories = [
  { id: 'fruits', name: 'Fruits', icon: 'eco', bgColor: 'rgba(45, 138, 78, 0.1)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&auto=format&fit=crop&q=60' },
  { id: 'vegetables', name: 'Vegetables', icon: 'eco', bgColor: 'rgba(45, 138, 78, 0.1)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60' },
  { id: 'dairy', name: 'Dairy & Milk', icon: 'bakery_dining', bgColor: 'rgba(150, 75, 0, 0.1)', color: '#964b00', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60' },
  { id: 'beverages', name: 'Beverages', icon: 'local_cafe', bgColor: 'rgba(51, 153, 255, 0.1)', color: '#3399ff', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' },
  { id: 'snacks', name: 'Snacks', icon: 'cookie', bgColor: 'rgba(255, 102, 0, 0.1)', color: '#ff6600', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60' },
  { id: 'household', name: 'Household', icon: 'cleaning_services', bgColor: 'rgba(0, 150, 136, 0.1)', color: '#009688', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60' }
];

const seedProducts = [
  { id: 'p_mosambi', name: 'Mosambi Juice', category: 'beverages', price: 60, unit: '1 Litre', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60', description: 'Freshly pressed Mosambi Juice', available: true, featured: true },
  { id: 'p_anar', name: 'Anar (Pomegranate)', category: 'fruits', price: 120, unit: '1 kg', image: 'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=500&auto=format&fit=crop&q=60', description: 'Fresh Pomegranate', available: true, featured: true },
  { id: 'p_mango', name: 'Mango (Alphonso)', category: 'fruits', price: 180, unit: '1 kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60', description: 'Premium Alphonso Mango', available: true, featured: true },
  { id: 'p_kela', name: 'Kela (Banana)', category: 'fruits', price: 40, unit: '1 Dozen', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60', description: 'Fresh Yellow Banana', available: true, featured: true },
  { id: 'p_seb', name: 'Seb (Apple)', category: 'fruits', price: 150, unit: '1 kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60', description: 'Fresh Red Apple', available: true, featured: true }
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Cleaning collections...');

    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Inserting categories...');
    for (const cat of seedCategories) {
      await Category.create(cat);
      console.log(`Inserted category: ${cat.name}`);
    }

    console.log('Inserting products...');
    for (const prod of seedProducts) {
      await Product.create(prod);
      console.log(`Inserted product: ${prod.name}`);
    }

    console.log('Database seeded successfully with screenshot mockup data!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
