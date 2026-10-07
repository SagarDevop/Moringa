import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bandamart';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  bgColor: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

const seedCategories = [
  { id: 'grocery_kirana', name: 'Grocery & Kirana', icon: 'storefront', bgColor: 'rgba(0, 106, 106, 0.1)', color: '#006A6A', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60' },
  { id: 'fruits_veg', name: 'Fruits & Vegetables', icon: 'eco', bgColor: 'rgba(45, 138, 78, 0.1)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60' },
  { id: 'dairy_bakery', name: 'Dairy & Bakery', icon: 'bakery_dining', bgColor: 'rgba(150, 75, 0, 0.1)', color: '#964b00', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60' },
  { id: 'beverages', name: 'Beverages', icon: 'local_cafe', bgColor: 'rgba(51, 153, 255, 0.1)', color: '#3399ff', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' },
  { id: 'snacks_namkeen', name: 'Snacks & Namkeen', icon: 'cookie', bgColor: 'rgba(255, 102, 0, 0.1)', color: '#ff6600', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60' },
  { id: 'home_kitchen', name: 'Home & Kitchen', icon: 'kitchen', bgColor: 'rgba(103, 80, 164, 0.1)', color: '#6750A4', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60' },
  { id: 'cleaning_household', name: 'Cleaning & Household', icon: 'cleaning_services', bgColor: 'rgba(0, 150, 136, 0.1)', color: '#009688', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60' },
  { id: 'baby_care', name: 'Baby Care', icon: 'child_care', bgColor: 'rgba(255, 217, 228, 0.3)', color: '#ff4081', image: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=500&auto=format&fit=crop&q=60' },
  { id: 'stationery', name: 'Stationery', icon: 'edit', bgColor: 'rgba(188, 240, 174, 0.2)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60' },
  { id: 'electronics_accessories', name: 'Electronics & Accessories', icon: 'devices', bgColor: 'rgba(103, 80, 164, 0.15)', color: '#6750A4', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60' },
  { id: 'fashion_clothing', name: 'Fashion & Clothing', icon: 'checkroom', bgColor: 'rgba(255, 218, 214, 0.3)', color: '#ba1a1a', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60' },
  { id: 'footwear', name: 'Footwear', icon: 'directions_walk', bgColor: 'rgba(255, 222, 168, 0.3)', color: '#7c5800', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
  { id: 'others', name: 'Others', icon: 'category', bgColor: 'rgba(128, 128, 128, 0.1)', color: '#808080', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60' },
  { id: 'flowers_garlands', name: 'Flowers & Garlands', icon: 'local_florist', bgColor: 'rgba(204, 51, 51, 0.1)', color: '#cc3333', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&auto=format&fit=crop&q=60' }
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Seeding categories...');

    for (const cat of seedCategories) {
      await Category.findOneAndUpdate(
        { id: cat.id },
        cat,
        { upsert: true, new: true }
      );
      console.log(`Upserted category: ${cat.name}`);
    }

    console.log('Categories seeded successfully!');
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
