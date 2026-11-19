import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to corporate newsletter with explicit DPDP consent
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, consent_given } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Corporate email is required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid corporate email address.'
      });
    }

    // Explicit consent required under DPDP Act 2023 Section 6
    if (consent_given !== true) {
      return res.status(400).json({
        success: false,
        message: 'Consent Checkbox Required: Explicit consent to receive communications and agreement with the Privacy Policy is mandatory under the DPDP Act 2023.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        existing.consent_given = true;
        existing.consent_timestamp = new Date();
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Your corporate subscription has been reactivated successfully.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Thank you! This email is already registered to receive corporate inventory updates.'
      });
    }

    await NewsletterSubscriber.create({
      email: normalizedEmail,
      consent_given: true,
      consent_timestamp: new Date(),
      consent_ip: req.ip || req.headers['x-forwarded-for'] || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will receive our weekly verified hardware catalog.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List newsletter subscribers (Admin only)
// @route   GET /api/admin/newsletter/subscribers
// @access  Admin only
export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    next(error);
  }
};
