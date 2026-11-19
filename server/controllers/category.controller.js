import slugify from 'slugify';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1, createdAt: 1 });

    // Enrich with live product count
    const enriched = await Promise.all(
      categories.map(async (c) => {
        const count = await Product.countDocuments({
          $or: [
            { category: c.slug },
            { category: c.slug.replace(/s$/, '') },
            { category: c.slug + 's' },
            { category: c.name }
          ]
        });
        const obj = c.toObject();
        obj.product_count = count;
        return obj;
      })
    );

    res.status(200).json({ success: true, count: enriched.length, categories: enriched });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug: customSlug, default_gst_rate, hsn_sac, description, icon, sort_order, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const rawSlug = customSlug && customSlug.trim() ? customSlug.trim() : name;
    const slug = slugify(rawSlug, { lower: true, strict: true });

    // Check if category or slug already exists
    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name or slug already exists.' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      default_gst_rate: Number(default_gst_rate) || 18,
      hsn_sac: hsn_sac ? hsn_sac.trim() : '',
      description: description ? description.trim() : '',
      icon: icon || 'laptop',
      sort_order: Number(sort_order) || 0,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug: customSlug, default_gst_rate, hsn_sac, description, icon, sort_order, is_active } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name && name.trim()) {
      category.name = name.trim();
    }
    if (customSlug && customSlug.trim()) {
      category.slug = slugify(customSlug.trim(), { lower: true, strict: true });
    }
    if (default_gst_rate !== undefined) category.default_gst_rate = Number(default_gst_rate);
    if (hsn_sac !== undefined) category.hsn_sac = hsn_sac.trim();
    if (description !== undefined) category.description = description.trim();
    if (icon) category.icon = icon;
    if (sort_order !== undefined) category.sort_order = Number(sort_order);
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();
    res.status(200).json({ success: true, message: 'Category updated successfully', category });
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

    // Safety check: check if any products exist in this category
    const productCount = await Product.countDocuments({
      $or: [
        { category: category.slug },
        { category: category.slug.replace(/s$/, '') },
        { category: category.slug + 's' },
        { category: category.name }
      ]
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productCount} active products are currently assigned to this category. Please reassign those products first.`
      });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
