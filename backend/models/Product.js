import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  costPrice: { type: Number },
  unit: { type: String, required: true },
  image: { type: String, default: '' },
  image1: { type: String, default: '' },
  image2: { type: String, default: '' },
  image3: { type: String, default: '' },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number },
      costPrice: { type: Number }
    }
  ]
}, { timestamps: true });

productSchema.index({ createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
