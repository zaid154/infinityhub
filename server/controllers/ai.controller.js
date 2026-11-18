import { getGeminiModel } from '../config/gemini.js';
import Product from '../models/Product.js';
import SiteSettings from '../models/SiteSettings.js';

// @desc    Chat with Gemini AI IT Consultant
// @route   POST /api/ai/chat
// @access  Public
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Fetch site info & latest product inventory to give real context to Gemini
    const [settings, products] = await Promise.all([
      SiteSettings.findOne(),
      Product.find({ is_active: true }).select('title brand category sale_price rental_price_monthly condition stock_quantity specs').limit(20)
    ]);

    const inventoryContext = products
      .map(
        (p) =>
          `- ${p.title} (${p.brand}, ${p.category}): Sale ₹${p.sale_price}, Rent ₹${p.rental_price_monthly}/mo. Specs: ${p.specs?.processor || ''} ${p.specs?.ram || ''} ${p.specs?.storage || ''}. Stock: ${p.stock_quantity}`
      )
      .join('\n');

    const systemPrompt = `You are the official Senior IT Infrastructure Consultant at ${settings?.company_name || 'TechNova IT Solutions'}.
We specialize in B2B enterprise refurbished laptops, desktop setups, corporate bulk rental leasing, PC components (RAM, GPU, CPU, monitors), AMC maintenance, and IT asset buyback.
Contact WhatsApp: ${settings?.whatsapp || '+91 98765 43210'}.
Office Address: ${settings?.address || 'Delhi NCR'}.

Key Business Rules:
1. Speak in friendly, polite Hinglish/English as appropriate.
2. Provide concise, helpful enterprise recommendations.
3. Recommend our products from current stock when relevant.
4. Mention that we offer 100% GST invoicing, up to 1-year warranty, and 24-48h replacement SLA.
5. If a customer wants to place a bulk order or rental, encourage them to click "Request a Quote" or message on WhatsApp.

Current Available Stock Highlights:
${inventoryContext}
`;

    const model = getGeminiModel('gemini-2.0-flash');
    const prompt = `${systemPrompt}\n\nCustomer Inquiry: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      reply: responseText
    });
  } catch (error) {
    console.error('[Gemini AI Chat Error]', error);
    res.status(500).json({
      success: false,
      message: 'AI assistant is temporarily unavailable. Please connect on WhatsApp directly.'
    });
  }
};

// @desc    Generate product description using Gemini from specs
// @route   POST /api/ai/generate-description
// @access  Admin only
export const generateProductDescription = async (req, res, next) => {
  try {
    const { title, brand, category, condition, specs } = req.body;
    if (!title || !brand) {
      return res.status(400).json({ success: false, message: 'Title and Brand are required' });
    }

    const model = getGeminiModel('gemini-2.0-flash');
    const prompt = `Write a high-converting, professional B2B product description for an enterprise hardware website.
Product: ${title}
Brand: ${brand}
Category: ${category}
Condition: ${condition || 'Grade A+ Certified Refurbished'}
Specs: ${JSON.stringify(specs || {})}

Write 2 concise paragraphs:
Paragraph 1: Executive overview highlighting reliability, build quality, and ideal business use cases (e.g. software development, corporate calling, office work).
Paragraph 2: Key hardware highlights in bullet points.
Keep tone crisp, corporate, and persuasive. Do not use generic filler words.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    res.status(200).json({
      success: true,
      description
    });
  } catch (error) {
    console.error('[Gemini Description Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate description with Gemini.'
    });
  }
};
