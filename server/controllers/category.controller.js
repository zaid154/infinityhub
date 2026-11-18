import slugify from 'slugify';
import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, default_gst_rate, icon, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const category = await Category.create({
      name,
      slug,
      default_gst_rate: default_gst_rate || 18,
      icon: icon || 'box',
      sort_order: sort_order || 0
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, default_gst_rate, icon, sort_order } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (default_gst_rate !== undefined) category.default_gst_rate = default_gst_rate;
    if (icon) category.icon = icon;
    if (sort_order !== undefined) category.sort_order = sort_order;

    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
