import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  bgColor: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
