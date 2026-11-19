import Rental from '../models/Rental.js';
import Product from '../models/Product.js';

export const createRental = async (req, res, next) => {
  try {
    const { product_id, quantity, tenure, monthly_rate } = req.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const reqQty = Number(quantity);
    if (!reqQty || reqQty <= 0 || !Number.isInteger(reqQty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lease quantity. Quantity must be a positive integer.'
      });
    }
    const maxRental = product.rental_stock !== undefined ? product.rental_stock : 5;
    if (reqQty > maxRental) {
      return res.status(400).json({
        success: false,
        message: `Requested ${reqQty} units for lease, but only ${maxRental} units are currently available in the active rental fleet. Please adjust quantity or contact us for a custom procurement quote.`
      });
    }

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

    // Secure server-side tenure discount calculation (protecting against client price tampering)
    const baseMonthlyPrice = product.rental_price_monthly || 1350;
    const discountRate = tenure === '12_months' ? 0.15 : tenure === '6_months' ? 0.05 : 0;
    const verifiedMonthlyRate = Math.round(baseMonthlyPrice * (1 - discountRate));

    const rental = await Rental.create({
      user: req.user._id,
      product: product._id,
      quantity: reqQty,
      tenure: tenure || '6_months',
      monthly_rate: verifiedMonthlyRate,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      payment_status: 'pending'
    });

    // Decrement rental_stock
    await Product.findByIdAndUpdate(product._id, {
      $inc: { rental_stock: -reqQty }
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
    const { status, admin_notes, payment_status } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental record not found' });

    if (status) rental.status = status;
    if (admin_notes !== undefined) rental.admin_notes = admin_notes;
    if (payment_status) rental.payment_status = payment_status;

    await rental.save();
    res.status(200).json({ success: true, message: 'Rental status updated', rental });
  } catch (error) {
    next(error);
  }
};
