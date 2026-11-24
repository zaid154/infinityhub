# Demo Infotech (InfinityHub) — Enterprise IT Hardware & Rental Platform

A production-ready, full-stack B2B Enterprise IT Hardware & Equipment Leasing Platform built on the MERN stack (MongoDB, Express.js, React 19, Node.js). Designed for corporate procurement, hardware leases, and refurbished commercial IT equipment.

---

## 🌐 Live Production Deployments

- **Frontend (Vercel):** [https://infinityhub-pro.vercel.app/](https://infinityhub-pro.vercel.app/)
- **Backend API (Render):** [https://infinityhub-u9yq.onrender.com/](https://infinityhub-u9yq.onrender.com/)
- **GitHub Repository:** [https://github.com/zaid154/infinityhub.git](https://github.com/zaid154/infinityhub.git)
- **API Health Check:** [https://infinityhub-u9yq.onrender.com/api/health](https://infinityhub-u9yq.onrender.com/api/health)

---

## 🚀 Quick Start (Local Run)

### 1. Start Express Backend
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5001
# Connected to MongoDB Atlas (technova_hardware)
```

### 2. Start React Frontend
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 🔑 Initial Admin Credentials

| Field | Value |
|---|---|
| **Portal Login** | `https://infinityhub-pro.vercel.app/login` |
| **Admin Dashboard** | `https://infinityhub-pro.vercel.app/admin` |
| **Email** | `zaidm1323@gmail.com` |
| **Password** | `Zaid@9999201255` |

*(Credentials and site branding can also be customized dynamically via Admin Settings)*

---

## 📧 Email & Transactional Dispatch System (Brevo HTTPS API)

This platform implements a robust dual-layer email architecture designed specifically to work reliably on cloud hosting environments:

### 1. Cloud SMTP Blocking vs. Brevo HTTPS API
* **The Cloud Challenge:** Free and low-tier cloud platforms (such as Render and Vercel Serverless) block outbound TCP ports `25`, `465`, and `587`. Standard Nodemailer Gmail SMTP connections hang and time out on these platforms.
* **The Solution:** The backend routes transactional emails through **Brevo v3 HTTPS API** (`https://api.brevo.com/v3/smtp/email`) on standard HTTPS port `443`.
* **Verified Sender Requirement:** Brevo requires an authorized and active sender email. For this account, the verified sender is **`zaidm1323@gmail.com`**.
* **Delivery Destination:** Emails sent via Brevo API relay directly to the recipient's **Inbox** or **Spam** folder. They do *not* appear in the personal Gmail "Sent" folder of the sender address, as they are routed through Brevo's certified mail relays (`mailin.fr`).

### 2. Required Environment Variables for Email

```env
# Brevo Transactional Email (HTTPS Port 443 - Works on Render & Cloud)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=zaidm1323@gmail.com
BREVO_SENDER_NAME="Demo Infotech"

# Gmail SMTP (Local Development Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Demo Infotech <zaidm1323@gmail.com>"
```

### 3. Automated Email Workflows
- **Account Activation:** Sends account verification link upon customer registration (`/api/auth/verify-email/:token`).
- **Password Reset:** Generates secure token and dispatches reset instructions (`/api/auth/forgot-password`).
- **Admin RFQ Alerts:** Instant email notification dispatched to administrator whenever a corporate customer requests a Quote.
- **Welcome Email:** Dispatched automatically once a user's corporate email is verified.

---

## 🌟 Key Features & Integrations

### 1. Dynamic Site Settings (Zero Hardcoding)
Store details, contact phones, WhatsApp numbers, warehouse addresses, and bank details can be modified live through the **Admin Settings** (`/admin/settings`) tab without rebuilding or redeploying code.

### 2. Google Gemini AI Consultant & Content Generator
- **AI Hardware Advisor:** Floating chat widget on the frontend providing real-time recommendations for laptop specs, enterprise servers, and lease terms.
- **AI Product Description Generator:** One-click automated B2B marketing description generation within the Admin product creation form.

### 3. Cloudinary Multi-Image Media Management
- Multi-file image uploads streamed directly to Cloudinary folder `technova-hardware`.
- Optimized image transformations and CDN delivery.

### 4. Razorpay Payment Gateway (TEST Mode)
- Integrated online checkout for hardware orders with server-side HMAC-SHA256 signature verification.

### 5. Interactive Commercial Rental Calculator
- Live tenure discounts (up to 15% off for 12+ month corporate leasing).
- Direct one-click conversion to RFQ inquiries or WhatsApp.

---

## 📁 Project Architecture

```
Rizwan/
├── client/                     # React 19 Frontend (Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, WhatsAppFloat, ChatbotWidget, RFQModal
│   │   ├── pages/              # Home, Products, ProductDetail, RentalPlans, Buyback, Contact, Cart, Auth
│   │   ├── pages/admin/        # AdminDashboard, AdminProducts, Inquiries, Orders, Rentals, Customers, Settings
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── context/            # AuthContext, CartContext
│   │   └── services/           # Axios instance with JWT interceptor
│   ├── vercel.json             # Vercel SPA Routing Rewrites
├── server/                     # Express.js REST API
│   ├── config/                 # db.js, cloudinary.js, razorpay.js, mailer.js, gemini.js
│   ├── controllers/            # Auth, Product, Inquiry, Order, Rental, Buyback, Upload, Settings, AI, Admin
│   ├── models/                 # User, Product, Category, Inquiry, Order, Rental, BuybackRequest, DeliveryZone, SiteSettings
│   ├── routes/                 # Express API routes
│   ├── middleware/             # auth.js, errorHandler.js, upload.js
│   └── seed/                   # seedAdmin.js, seedProducts.js
├── vercel.json                 # Root monorepo deployment config for Vercel
└── package.json
```

---

## 🚢 Production Deployment Guide

### Frontend on Vercel
1. Project is deployed at `https://infinityhub-pro.vercel.app/`.
2. Ensure Vercel Environment Variables:
   - `VITE_API_URL`: `https://infinityhub-u9yq.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_T3SdtTPSdbsaUg`

### Backend on Render
1. Project is deployed as a Web Service on Render at `https://infinityhub-u9yq.onrender.com/`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. In Render Dashboard ➔ **Environment**, configure:
   - `BREVO_API_KEY`: `your_brevo_api_key` (Brevo v3 HTTPS API key)
   - `BREVO_SENDER_EMAIL`: `zaidm1323@gmail.com`
   - `CLIENT_URL`: `https://infinityhub-pro.vercel.app`
   - `MONGO_URI`: `mongodb+srv://...`
   - `JWT_SECRET`: `...`
