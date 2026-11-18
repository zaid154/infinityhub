import Rental from '../models/Rental.js';
import Product from '../models/Product.js';

export const createRental = async (req, res, next) => {
  try {
    const { product_id, quantity, tenure, monthly_rate } = req.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const startDate = new Date();
    const monthsMap = {
      '1_month': 1,
      '3_months': 3,
      '6_months': 6,
      '12_months': 12
    };
    const durationMonths = monthsMap[tenure] || 6;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const rental = await Rental.create({
      user: req.user._id,
      product: product._id,
      quantity: Number(quantity) || 1,
      tenure: tenure || '6_months',
      monthly_rate: Number(monthly_rate) || product.rental_price_monthly,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      payment_status: 'paid'
    });

    res.status(201).json({ success: true, message: 'Rental fleet booking confirmed', rental });
  } catch (error) {
    next(error);
  }
};

export const getMyRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('product', 'title brand category images specs')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: rentals.length, rentals });
  } catch (error) {
    next(error);
  }
};

export const getAllRentalsAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [rentals, total] = await Promise.all([
      Rental.find(query)
        .populate('user', 'name email phone company_name')
        .populate('product', 'title brand category images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Rental.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: rentals.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      rentals
    });
  } catch (error) {
    next(error);
  }
};

export const updateRentalStatus = async (req, res, next) => {
  try {
    const { status, admin_notes } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental record not found' });

    if (status) rental.status = status;
    if (admin_notes !== undefined) rental.admin_notes = admin_notes;

    await rental.save();
    res.status(200).json({ success: true, message: 'Rental status updated', rental });
  } catch (error) {
    next(error);
  }
};
