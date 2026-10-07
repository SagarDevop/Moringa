import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-__v -_id').sort({ createdAt: -1 });
    res.set('Cache-Control', 'public, max-age=60');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      id: 'p_' + Date.now()
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product: ' + err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findOneAndDelete({ id });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product: ' + err.message });
  }
};
