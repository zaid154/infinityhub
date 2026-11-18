import Inquiry from '../models/Inquiry.js';
import { sendInquiryAdminAlert } from '../utils/sendEmail.js';

export const createInquiry = async (req, res, next) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      inquiry_type,
      product_ref,
      quantity,
      city,
      message
    } = req.body;

    if (!company_name || !contact_person || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Company name, contact person, and phone number are required.'
      });
    }

    const inquiry = await Inquiry.create({
      company_name,
      contact_person,
      email: email || '',
      phone,
      inquiry_type: inquiry_type || 'bulk_purchase',
      product_ref: product_ref || '',
      quantity: quantity || '5 - 10 Units',
      city: city || '',
      message: message || '',
      status: 'new'
    });

    // Notify admin via email in background
    if (process.env.ADMIN_EMAIL) {
      sendInquiryAdminAlert(process.env.ADMIN_EMAIL, inquiry).catch((err) =>
        console.error('[Admin Alert Error]', err.message)
      );
    }

    res.status(201).json({
      success: true,
      message: 'Quotation request received! Our corporate desk will contact you within 2 hours.',
      inquiryId: inquiry._id
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Inquiry.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      inquiries
    });
  } catch (error) {
    next(error);
  }
};

export const updateInquiry = async (req, res, next) => {
  try {
    const { status, admin_notes } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) inquiry.status = status;
    if (admin_notes !== undefined) inquiry.admin_notes = admin_notes;

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
