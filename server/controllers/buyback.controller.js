import BuybackRequest from '../models/BuybackRequest.js';

export const createBuybackRequest = async (req, res, next) => {
  try {
    const {
      company_name,
      contact_person,
      phone,
      email,
      asset_type,
      approx_quantity,
      city,
      description
    } = req.body;

    if (!company_name || !contact_person || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Company name, contact person, and phone number are required.'
      });
    }

    const buyback = await BuybackRequest.create({
      company_name,
      contact_person,
      phone,
      email: email || '',
      asset_type: asset_type || 'Used Laptops / Desktops',
      approx_quantity: Number(approx_quantity) || 10,
      city: city || '',
      description: description || '',
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Asset liquidation request received! Our valuation team will contact you.',
      buybackId: buyback._id
    });
  } catch (error) {
    next(error);
  }
};

export const getBuybackRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      BuybackRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      BuybackRequest.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      requests
    });
  } catch (error) {
    next(error);
  }
};

export const updateBuybackRequest = async (req, res, next) => {
  try {
    const { status, offered_price, admin_notes } = req.body;
    const item = await BuybackRequest.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Buyback request not found' });
    }

    if (status) item.status = status;
    if (offered_price !== undefined) item.offered_price = Number(offered_price);
    if (admin_notes !== undefined) item.admin_notes = admin_notes;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Buyback request updated successfully',
      item
    });
  } catch (error) {
    next(error);
  }
};
