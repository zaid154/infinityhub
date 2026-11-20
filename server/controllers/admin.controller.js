import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import Rental from '../models/Rental.js';
import User from '../models/User.js';
import BuybackRequest from '../models/BuybackRequest.js';
import CustomerDemand from '../models/CustomerDemand.js';

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
      inventoryAgg,
      recentInquiries,
      recentOrders,
      topDemands
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
      Product.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: null,
            totalSaleStock: { $sum: '$sale_stock' },
            totalRentalStock: { $sum: '$rental_stock' },
            totalStock: { $sum: '$stock_quantity' }
          }
        }
      ]),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
      Order.find().populate('user', 'name email phone company_name').sort({ createdAt: -1 }).limit(5),
      CustomerDemand.find({ is_unstocked: true, procurement_status: { $ne: 'dismissed' } })
        .sort({ frequency: -1, last_queried_at: -1 })
        .limit(5)
    ]);

    const totalRevenue = ordersAgg.length > 0 ? ordersAgg[0].totalRevenue : 0;
    const stockStats = inventoryAgg.length > 0 ? inventoryAgg[0] : { totalSaleStock: 0, totalRentalStock: 0, totalStock: 0 };

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        newInquiries,
        activeRentals,
        totalCustomers,
        pendingBuybacks,
        totalSaleStock: stockStats.totalSaleStock || 0,
        totalRentalStock: stockStats.totalRentalStock || 0,
        totalOperationalUnits: (stockStats.totalSaleStock || 0) + (stockStats.totalRentalStock || 0)
      },
      recentInquiries,
      recentOrders,
      topDemands
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

    // Enrich with corporate commercial counts (orders & rentals)
    const enrichedCustomers = await Promise.all(
      customers.map(async (c) => {
        const [ordersCount, rentalsCount] = await Promise.all([
          Order.countDocuments({ user: c._id }),
          Rental.countDocuments({ user: c._id })
        ]);
        const obj = c.toObject();
        obj.orders_count = ordersCount;
        obj.rentals_count = rentalsCount;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedCustomers.length,
      customers: enrichedCustomers
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_blocked, block_reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer record not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be blocked.' });
    }

    user.is_blocked = typeof is_blocked === 'boolean' ? is_blocked : !user.is_blocked;
    if (block_reason !== undefined) {
      user.block_reason = user.is_blocked ? (block_reason || 'Administrative policy violation') : '';
    } else if (!user.is_blocked) {
      user.block_reason = '';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: user.is_blocked
        ? `Corporate account ${user.company_name || user.name} has been suspended.`
        : `Corporate account ${user.company_name || user.name} has been reactivated.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        is_blocked: user.is_blocked,
        block_reason: user.block_reason
      }
    });
  } catch (error) {
    next(error);
  }
};
