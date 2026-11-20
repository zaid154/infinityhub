import Rental from '../models/Rental.js';
import Product from '../models/Product.js';
import PaymentAuditLog from '../models/PaymentAuditLog.js';

// @desc    Create new enterprise rental lease booking
// @route   POST /api/rentals
// @access  Private
export const createRental = async (req, res, next) => {
  try {
    const {
      product_id,
      quantity,
      tenure,
      deployment_address,
      company_name,
      gstin
    } = req.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Security Check: Inactive products cannot be rented
    if (product.is_active === false) {
      return res.status(400).json({
        success: false,
        message: `Product "${product.title}" is currently not available for leasing.`
      });
    }

    // Security Check: Sale-only products cannot be rented
    if (product.available_for === 'sale') {
      return res.status(400).json({
        success: false,
        message: `Product "${product.title}" is available for direct purchase only, not rental leasing.`
      });
    }

    // Security Check: Product must have a valid rental price
    if (!product.rental_price_monthly || product.rental_price_monthly <= 0) {
      return res.status(400).json({
        success: false,
        message: `Rental pricing not configured for "${product.title}". Please contact procurement.`
      });
    }

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

    // 100% Server-Side Calculations (Tamper-Proof)
    const baseMonthlyPrice = product.rental_price_monthly;
    const discountRate = tenure === '12_months' ? 0.15 : tenure === '6_months' ? 0.05 : 0;
    const verifiedMonthlyRate = Math.round(baseMonthlyPrice * (1 - discountRate));

    const monthly_subtotal = verifiedMonthlyRate * reqQty;
    const monthly_gst = Math.round(monthly_subtotal * 0.18); // 18% GST statutory rate for hardware leasing
    const total_monthly_recurring = monthly_subtotal + monthly_gst;

    const rental = await Rental.create({
      user: req.user._id,
      product: product._id,
      quantity: reqQty,
      tenure: tenure || '6_months',
      monthly_rate: verifiedMonthlyRate,
      monthly_subtotal,
      monthly_gst,
      total_monthly_recurring,
      company_name: company_name || req.user.company_name || '',
      gstin: gstin || req.user.gstin || '',
      deployment_address: deployment_address || {},
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      payment_status: 'pending'
    });

    // Decrement rental_stock atomically
    await Product.findByIdAndUpdate(product._id, {
      $inc: { rental_stock: -reqQty }
    });

    // Record in Audit Log
    await PaymentAuditLog.create({
      rental: rental._id,
      user: req.user._id,
      event_type: 'rental_initiated',
      amount: total_monthly_recurring,
      gateway: 'po_invoice',
      status: 'pending',
      tampering_detected: false,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      metadata: {
        agreement_number: rental.agreement_number,
        tenure: rental.tenure,
        monthly_rate: verifiedMonthlyRate
      }
    });

    res.status(201).json({ success: true, message: 'Rental fleet booking confirmed', rental });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's rentals
// @route   GET /api/rentals/my-rentals
// @access  Private
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

// @desc    Get all rentals (Admin only)
// @route   GET /api/rentals
// @access  Admin only
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

// @desc    Update rental status & manage fleet lifecycle reconciliation
// @route   PUT /api/rentals/:id/status
// @access  Admin only
export const updateRentalStatus = async (req, res, next) => {
  try {
    const status = req.body.status || req.body.rental_status;
    const admin_notes = req.body.admin_notes !== undefined ? req.body.admin_notes : req.body.notes;
    const payment_status = req.body.payment_status;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental record not found' });

    const previousStatus = rental.status;

    // Inventory Lifecycle Reconciliation:
    // If transitioning from active/allocated to returned/completed, restore rental_stock to warehouse
    if (status && status !== previousStatus) {
      const activeStates = ['active', 'allocated', 'pending'];
      const returnedStates = ['returned', 'completed', 'cancelled'];

      if (returnedStates.includes(status) && activeStates.includes(previousStatus)) {
        await Product.findByIdAndUpdate(rental.product, {
          $inc: { rental_stock: rental.quantity }
        });
      } else if (activeStates.includes(status) && returnedStates.includes(previousStatus)) {
        // If transitioning from returned back to active, decrement stock
        await Product.findByIdAndUpdate(rental.product, {
          $inc: { rental_stock: -rental.quantity }
        });
      }
      rental.status = status;
    }

    if (payment_status && payment_status !== rental.payment_status) {
      await PaymentAuditLog.create({
        rental: rental._id,
        user: req.user._id,
        event_type: 'status_changed',
        amount: rental.total_monthly_recurring || rental.monthly_rate,
        status: 'success',
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: {
          previous_payment_status: rental.payment_status,
          new_payment_status: payment_status,
          updated_by: req.user.email
        }
      });
      rental.payment_status = payment_status;
    }

    if (admin_notes !== undefined) rental.admin_notes = admin_notes;

    await rental.save();
    res.status(200).json({ success: true, message: 'Rental status updated', rental });
  } catch (error) {
    next(error);
  }
};
