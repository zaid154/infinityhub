import mongoose from 'mongoose';
import slugify from 'slugify';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filters, search, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      condition,
      available_for,
      search,
      sort,
      page = 1,
      limit = 12,
      minPrice,
      maxPrice
    } = req.query;

    const andConditions = [{ is_active: true }];

    if (category && category !== 'all') {
      const singular = category.replace(/s$/, '');
      andConditions.push({ category: { $in: [category, singular, `${singular}s`] } });
    }
    if (brand && brand !== 'all') {
      andConditions.push({ brand: new RegExp(`^${brand}$`, 'i') });
    }
    if (condition && condition !== 'all') {
      andConditions.push({ condition });
    }
    if (available_for && available_for !== 'all') {
      andConditions.push({
        $or: [{ available_for }, { available_for: 'both' }]
      });
    }

    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      andConditions.push({ sale_price: priceFilter });
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const escaped = cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { brand: searchRegex },
          { model: searchRegex },
          { category: searchRegex },
          { description: searchRegex },
          { 'specs.processor': searchRegex },
          { 'specs.ram': searchRegex },
          { 'specs.storage': searchRegex },
          { 'specs.screen_size': searchRegex },
          { 'specs.gpu_model': searchRegex },
          { 'specs.generation': searchRegex },
          { 'specs.operating_system': searchRegex }
        ]
      });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    // Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { sale_price: 1 };
    if (sort === 'price_desc') sortQuery = { sale_price: -1 };
    if (sort === 'featured') sortQuery = { is_featured: -1, createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.slug);
    const query = isObjectId
      ? { $or: [{ slug: req.params.slug }, { _id: req.params.slug }], is_active: true }
      : { slug: req.params.slug, is_active: true };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products from same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      is_active: true
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured & hot deal products for home page
// @route   GET /api/products/featured/list
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const [featured, hotDeals] = await Promise.all([
      Product.find({ is_featured: true, is_active: true }).limit(6),
      Product.find({ is_hot_deal: true, is_active: true }).limit(6)
    ]);

    res.status(200).json({
      success: true,
      featured,
      hotDeals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin only
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      brand,
      model,
      category,
      condition,
      available_for,
      sale_price,
      rental_price_monthly,
      stock_quantity,
      images,
      specs,
      gst_rate,
      is_featured,
      is_hot_deal
    } = req.body;

    if (!title || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product title, brand, and category are required.'
      });
    }

    // Unique slug creation
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // If GST rate not specified, check category default
    let finalGstRate = gst_rate !== undefined ? Number(gst_rate) : 18;
    if (gst_rate === undefined) {
      const catObj = await Category.findOne({ slug: category });
      if (catObj && catObj.default_gst_rate !== undefined) {
        finalGstRate = catObj.default_gst_rate;
      }
    }

    const parsedSaleStock = req.body.sale_stock !== undefined ? Number(req.body.sale_stock) : (available_for === 'rent' ? 0 : Number(stock_quantity) || 1);
    const parsedRentalStock = req.body.rental_stock !== undefined ? Number(req.body.rental_stock) : (available_for === 'sale' ? 0 : Number(stock_quantity) || 0);

    const resolvedSalePrice = Number(sale_price !== undefined ? sale_price : req.body.price) || 0;
    const resolvedRentalPrice = Number(rental_price_monthly !== undefined ? rental_price_monthly : req.body.monthly_rental_price) || 0;

    const is_active = req.body.is_active !== undefined ? Boolean(req.body.is_active) : true;

    const product = await Product.create({
      title,
      slug,
      description: description || '',
      brand,
      model: model || '',
      category,
      condition: condition || 'grade_a_plus',
      available_for: available_for || 'both',
      is_active,
      sale_price: resolvedSalePrice,
      rental_price_monthly: resolvedRentalPrice,
      stock_quantity: Number(stock_quantity) || (parsedSaleStock + parsedRentalStock) || 1,
      sale_stock: parsedSaleStock,
      rental_stock: parsedRentalStock,
      images: images || [],
      specs: specs || {},
      gst_rate: finalGstRate,
      is_featured: Boolean(is_featured),
      is_hot_deal: Boolean(is_hot_deal)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Admin only
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    // If title changed, update slug
    if (updates.title && updates.title !== product.title) {
      let baseSlug = slugify(updates.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin only
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
