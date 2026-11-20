import CustomerDemand from '../models/CustomerDemand.js';
import Product from '../models/Product.js';

// @desc    Get all captured customer demand & unstocked inquiries
// @route   GET /api/demand
// @access  Admin only
export const getCustomerDemands = async (req, res, next) => {
  try {
    const { status, source, sort = 'frequency', page = 1, limit = 25 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.procurement_status = status;
    }
    if (source && source !== 'all') {
      query.source = source;
    }

    const sortOption = sort === 'recent' ? { last_queried_at: -1 } : { frequency: -1, last_queried_at: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [demands, total, statsAgg, topDemands] = await Promise.all([
      CustomerDemand.find(query)
        .populate('user', 'name email phone company_name designation')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      CustomerDemand.countDocuments(query),
      CustomerDemand.aggregate([
        {
          $group: {
            _id: null,
            totalQueries: { $sum: '$frequency' },
            unstockedCount: {
              $sum: { $cond: ['$is_unstocked', '$frequency', 0] }
            },
            plannedCount: {
              $sum: {
                $cond: [{ $eq: ['$procurement_status', 'procurement_planned'] }, 1, 0]
              }
            },
            stockedCount: {
              $sum: {
                $cond: [{ $eq: ['$procurement_status', 'stocked_listed'] }, 1, 0]
              }
            }
          }
        }
      ]),
      CustomerDemand.find({ is_unstocked: true, procurement_status: { $ne: 'dismissed' } })
        .sort({ frequency: -1, last_queried_at: -1 })
        .limit(5)
    ]);

    const stats = statsAgg.length > 0 ? statsAgg[0] : { totalQueries: 0, unstockedCount: 0, plannedCount: 0, stockedCount: 0 };

    res.status(200).json({
      success: true,
      demands,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      stats: {
        totalQueries: stats.totalQueries || 0,
        unstockedCount: stats.unstockedCount || 0,
        plannedCount: stats.plannedCount || 0,
        stockedCount: stats.stockedCount || 0
      },
      topDemands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update procurement status or notes for a demand record
// @route   PUT /api/demand/:id
// @access  Admin only
export const updateCustomerDemand = async (req, res, next) => {
  try {
    const { procurement_status, admin_notes } = req.body;

    const demand = await CustomerDemand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand record not found' });
    }

    if (procurement_status) demand.procurement_status = procurement_status;
    if (admin_notes !== undefined) demand.admin_notes = admin_notes;

    await demand.save();

    res.status(200).json({
      success: true,
      message: 'Demand status updated successfully',
      demand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a demand entry
// @route   DELETE /api/demand/:id
// @access  Admin only
export const deleteCustomerDemand = async (req, res, next) => {
  try {
    const demand = await CustomerDemand.findByIdAndDelete(req.params.id);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Demand record deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a search query from customer catalog search
// @route   POST /api/demand/log-search
// @access  Public
export const logSearchQuery = async (req, res, next) => {
  try {
    const { query, results_count = 0 } = req.body;
    if (!query || query.trim().length < 2) {
      return res.status(200).json({ success: true });
    }

    const cleanQuery = query.trim();

    // Check if results were 0 (unstocked search)
    const isUnstocked = Number(results_count) === 0;

    // Detect basic brand
    let brand = '';
    const lower = cleanQuery.toLowerCase();
    if (lower.includes('dell')) brand = 'Dell';
    else if (lower.includes('hp')) brand = 'HP';
    else if (lower.includes('lenovo') || lower.includes('thinkpad')) brand = 'Lenovo';
    else if (lower.includes('apple') || lower.includes('macbook')) brand = 'Apple';
    else if (lower.includes('nvidia') || lower.includes('rtx') || lower.includes('gtx')) brand = 'NVIDIA';
    else if (lower.includes('asus')) brand = 'Asus';
    else if (lower.includes('acer')) brand = 'Acer';

    // Find if same query exists
    const existing = await CustomerDemand.findOne({
      query_text: { $regex: new RegExp(`^${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      source: 'catalog_search'
    });

    if (existing) {
      existing.frequency += 1;
      existing.last_queried_at = new Date();
      if (req.user) {
        existing.user = req.user._id;
        existing.user_name = req.user.name || existing.user_name;
        existing.user_email = req.user.email || existing.user_email;
        existing.user_company = req.user.company_name || existing.user_company;
      }
      await existing.save();
    } else {
      await CustomerDemand.create({
        query_text: cleanQuery,
        detected_brand: brand,
        detected_model: cleanQuery,
        category: 'laptop',
        source: 'catalog_search',
        intent: isUnstocked ? 'unstocked_request' : 'general',
        is_unstocked: isUnstocked,
        frequency: 1,
        last_queried_at: new Date(),
        user: req.user ? req.user._id : null,
        user_name: req.user?.name || '',
        user_email: req.user?.email || '',
        user_company: req.user?.company_name || ''
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    // Fail silently for background analytics
    console.warn('[LogSearch Error]', error.message);
    res.status(200).json({ success: true });
  }
};
