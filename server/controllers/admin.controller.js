import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import Rental from '../models/Rental.js';
import User from '../models/User.js';
import BuybackRequest from '../models/BuybackRequest.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      ordersAgg,
      newInquiries,
      activeRentals,
      totalCustomers,
      pendingBuybacks,
      recentInquiries,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments({ is_active: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { payment_status: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$grand_total' } } }
      ]),
      Inquiry.countDocuments({ status: 'new' }),
      Rental.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'customer' }),
      BuybackRequest.countDocuments({ status: 'new' }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
      Order.find().populate('user', 'name email phone company_name').sort({ createdAt: -1 }).limit(5)
    ]);

    const totalRevenue = ordersAgg.length > 0 ? ordersAgg[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        newInquiries,
        activeRentals,
        totalCustomers,
        pendingBuybacks
      },
      recentInquiries,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    next(error);
  }
};
