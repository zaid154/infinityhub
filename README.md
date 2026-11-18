# TechNova IT Solutions — Enterprise MERN Hardware & Rental Platform

A complete, production-grade B2B IT Hardware Platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed specifically for IT hardware vendors dealing in:
- **Commercial Laptops & Desktops** (Bulk Refurbished ThinkPad, Latitude, EliteBook)
- **Corporate Hardware Rentals** (1 month to 3 years leasing with on-site replacement SLA)
- **Wholesale Components Trading** (DDR4/DDR5 RAM, Workstation GPUs, CPUs, Frameless Displays)
- **Chip-Level Repair & Corporate AMC Contracts**
- **IT Asset Disposition (ITAD / E-Waste Buyback)** with NIST 800-88 data destruction certificates

---

## 🚀 Quick Start (Local Run)

### 1. Start Express Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
# Connected to MongoDB Atlas (technova_hardware)
```

### 2. Start React Frontend
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 🔑 Initial Admin Credentials

| Field | Value |
|---|---|
| **Login URL** | `http://localhost:5173/login` |
| **Admin Portal** | `http://localhost:5173/admin` |
| **Email** | `admin@technova.com` |
| **Password** | `Admin@123` |

*(Can be customized or updated directly in Admin Settings / Profile)*

---

## 🌟 Key Features & Integrations

### 1. Zero Hardcoding — Live Admin Settings
Your friend can update their shop name, calling number, WhatsApp number, warehouse address, and Google Maps embed directly from **Admin Settings** (`/admin/settings`) at any time without touching any code.

### 2. Google Gemini 2.0 Flash AI Integration
- **Customer AI Consultant:** Visitors can chat with an AI IT Infrastructure Consultant on the bottom-right of the site to get instant advice on laptop configurations, stock availability, and rental terms.
- **AI Product Description Generator:** When adding hardware in the Admin panel, clicking *"Auto-Generate with Google Gemini"* writes professional B2B marketing descriptions based on specs.

### 3. Cloudinary Multi-Image Upload
- Products can have multiple high-res photos.
- Images are streamed to Cloudinary folder `technova-hardware` via backend memory storage.

### 4. Razorpay Payment Gateway (TEST Mode)
- Clients can make online payments for hardware orders directly via Razorpay checkout popup.
- Includes HMAC-SHA256 signature verification on backend.

### 5. Gmail SMTP & Brevo Transactional Email System
- Automated email verification link sent upon customer registration.
- Automated password reset token emails.
- Instant email notifications sent to admin whenever a new corporate RFQ/lead is submitted.

### 6. Interactive Rental Calculator
- Dynamic sliders and tiers (Office Essential i5, Developer Pro i7, VFX/GPU Rig).
- Live tenure discount calculation (15% off on 12+ months).
- One-click transfer to RFQ modal or WhatsApp.

---

## 📁 Project Architecture

```
Rizwan/
├── client/                     # React Frontend (Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, WhatsAppFloat, ChatbotWidget, RFQModal
│   │   ├── pages/              # Home, Products, ProductDetail, RentalPlans, Buyback, Contact, Cart, Auth
│   │   ├── pages/admin/        # AdminDashboard, AdminProducts, AdminProductForm, Inquiries, Orders, Rentals, Customers, Settings
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── context/            # AuthContext, CartContext
│   │   └── services/           # Axios instance with JWT interceptor
├── server/                     # Express.js REST API
│   ├── config/                 # db.js, cloudinary.js, razorpay.js, mailer.js, gemini.js, brevo.js
│   ├── controllers/            # Auth, Product, Inquiry, Order, Rental, Buyback, Upload, Settings, AI, Admin
│   ├── models/                 # User, Product, Category, Inquiry, Order, Rental, BuybackRequest, DeliveryZone, SiteSettings
│   ├── routes/                 # Express API routes
│   ├── middleware/             # auth.js, errorHandler.js, upload.js
│   └── seed/                   # seedAdmin.js, seedProducts.js
└── package.json
```

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push `client` to GitHub or deploy via Vercel CLI:
   ```bash
   cd client
   vercel
   ```
2. Set Environment Variable in Vercel:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://technova-api.onrender.com/api`)
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_T3SdtTPSdbsaUg`

### Backend (Render)
1. Deploy `server` folder as a Web Service on [Render](https://render.com).
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Copy all values from `server/.env` into Render Environment Variables.
