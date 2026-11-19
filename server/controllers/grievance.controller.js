import GrievanceRequest from '../models/GrievanceRequest.js';
import SiteSettings from '../models/SiteSettings.js';

// @desc    Submit statutory grievance or data deletion request (DPDP Act & IT Rules)
// @route   POST /api/grievance/submit
// @access  Public (Rate-limited)
export const submitGrievance = async (req, res, next) => {
  try {
    const fullName = req.body.full_name || req.body.name;
    const email = req.body.corporate_email || req.body.email;
    const phone = req.body.phone;
    const companyName = req.body.company_name || '';
    const requestType = req.body.request_type || 'data_erasure';
    const details = req.body.details || req.body.description;

    if (!fullName || !email || !details) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, and Grievance Details are mandatory fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid corporate email address.'
      });
    }

    // Generate unique sequential ticket: GRV-YYYY-XXXX
    const year = new Date().getFullYear();
    const count = await GrievanceRequest.countDocuments();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `GRV-${year}-${String(count + 1).padStart(4, '0')}`;

    // Resolution deadline: 30 days statutory requirement under IT Rules 2021 & DPDP Act
    const resolutionDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const grievance = await GrievanceRequest.create({
      ticket_number: ticketNumber,
      full_name: fullName.trim(),
      corporate_email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      company_name: companyName.trim(),
      request_type: requestType,
      details: details.trim(),
      status: 'acknowledged',
      resolution_deadline: resolutionDeadline,
      ip_address: req.ip || req.headers['x-forwarded-for'] || ''
    });

    const settings = await SiteSettings.findOne();

    res.status(201).json({
      success: true,
      message: 'Statutory grievance request registered and acknowledged.',
      ticket_number: ticketNumber,
      statutory_timeline: {
        acknowledgement_window: 'Within 24 hours',
        resolution_deadline: 'Within 30 days'
      },
      request: {
        ticket_number: ticketNumber,
        email: email.trim().toLowerCase(),
        status: 'acknowledged',
        resolution_deadline: resolutionDeadline
      },
      grievance_officer: settings?.grievance_officer || {
        name: 'Statutory Grievance Officer',
        email: 'grievance@example.com'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get grievance requests (Admin only)
// @route   GET /api/admin/grievances
// @access  Admin only
export const getAdminGrievances = async (req, res, next) => {
  try {
    const grievances = await GrievanceRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: grievances.length,
      grievances
    });
  } catch (error) {
    next(error);
  }
};
