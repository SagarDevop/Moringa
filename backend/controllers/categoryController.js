import { Category } from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('-__v -_id');
    res.set('Cache-Control', 'public, max-age=60');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      id: 'cat_' + Date.now()
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category: ' + err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Category.findOneAndUpdate({ id }, req.body, { new: true });
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category: ' + err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.findOneAndDelete({ id });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category: ' + err.message });
  }
};
