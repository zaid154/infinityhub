import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText,
  Repeat,
  CheckCircle2,
  Clock,
  Building
} from 'lucide-react';
import { useCart, getTenureDiscount } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getSafeImageUrl, DEFAULT_HARDWARE_PLACEHOLDER } from '../utils/imageHelper';
import toast from 'react-hot-toast';
import { useCompany } from '../context/SettingsContext';
import { ExecutiveSuccessCard, APPLE_SPRING, useReducedMotionSafe } from '../animations';

/**
 * 100% Database-Driven Logistics Zone Auto-Matcher
 * Pure dynamic resolution: zero hardcoded city, state, or pin strings.
 * All routing rules are loaded directly from the MongoDB DeliveryZone collection.
 */
const detectZone = (city = '', state = '', pincode = '', dbZones = []) => {
  if (!dbZones || dbZones.length === 0) return null;

  const c = (city || '').trim().toLowerCase();
  const s = (state || '').trim().toLowerCase();
  const pin = (pincode || '').trim();

  // 1. Direct City Match against database zone.cities
  if (c) {
    for (const zone of dbZones) {
      if (zone.is_active === false) continue;
      const cities = Array.isArray(zone.cities) ? zone.cities : [];
      const isCatchAll =
        (zone.zone_name || '').toLowerCase().includes('rest of') ||
        cities.some((item) => (item || '').toLowerCase().includes('all other'));
      if (isCatchAll) continue;

      const hasCity = cities.some((dbCity) => {
        const item = (dbCity || '').trim().toLowerCase();
        if (!item || item.includes('all other')) return false;
        return c === item || c.includes(item) || item.includes(c);
      });
      if (hasCity) return zone;
    }
  }

  // 2. Direct Pincode Prefix Match against database zone.pincode_prefixes
  if (pin && pin.length >= 2) {
    for (const zone of dbZones) {
      if (zone.is_active === false) continue;
      const prefixes = Array.isArray(zone.pincode_prefixes) ? zone.pincode_prefixes : [];
      const hasPrefix = prefixes.some((dbPrefix) => {
        const p = (dbPrefix || '').trim();
        return p && pin.startsWith(p);
      });
      if (hasPrefix) return zone;
    }
  }

  // 3. Direct State Match against database zone.states
  if (s) {
    for (const zone of dbZones) {
      if (zone.is_active === false) continue;
      const states = Array.isArray(zone.states) ? zone.states : [];
      const isCatchAll = (zone.zone_name || '').toLowerCase().includes('rest of');
      if (isCatchAll) continue;

      const hasState = states.some((dbState) => {
        const item = (dbState || '').trim().toLowerCase();
        if (!item || item.includes('all other')) return false;
        return s === item || s.includes(item) || item.includes(s);
      });
      if (hasState) return zone;
    }
  }

  // 4. Fallback to Database default / catch-all zone
  const defaultZone = dbZones.find(
    (z) =>
      (z.zone_name || '').toLowerCase().includes('rest of') ||
      (Array.isArray(z.cities) && z.cities.some((item) => (item || '').toLowerCase().includes('all other')))
  );

  return defaultZone || dbZones[dbZones.length - 1] || dbZones[0];
};

export default function Cart() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const {
    buyCart,
    rentalCart,
    buyCartCount,
    rentalCartCount,
    cartCount,
    buySubtotal,
    rentalUndiscountedTotal,
    rentalMonthlyTotal,
    rentalSavingsTotal,
    updateBuyQuantity,
    updateRentalQuantity,
    updateRentalTenure,
    removeFromBuyCart,
    removeFromRentalCart,
    clearBuyCart,
    clearRentalCart
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'buy' or 'rental'
  const [activeTab, setActiveTab] = useState(() => {
    if (buyCart.length === 0 && rentalCart.length > 0) return 'rental';
    return 'buy';
  });

  const [deliveryZones, setDeliveryZones] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    company_name: user?.company_name || '',
    contact_person: user?.name || '',
    phone: user?.phone || '',
    street: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    gst_number: user?.gst_number || ''
  });
  const [prevUser, setPrevUser] = useState(user);
  if (user && user !== prevUser) {
    setPrevUser(user);
    setShippingAddress((prev) => ({
      ...prev,
      company_name: prev.company_name || user.company_name || '',
      contact_person: prev.contact_person || (user.designation ? `${user.name} (${user.designation})` : user.name) || '',
      phone: prev.phone || user.phone || '',
      city: prev.city || user.city || '',
      street: prev.street || user.address?.street || '',
      pincode: prev.pincode || user.address?.pincode || '',
      state: prev.state || user.address?.state || ''
    }));
  }

  const [processing, setProcessing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [celebration, setCelebration] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    redirectTo: ''
  });

  const shouldReduce = useReducedMotionSafe();

  const triggerFailureShake = () => {
    if (shouldReduce) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  useEffect(() => {
    let isMounted = true;
    api.get('/settings/delivery-zones')
      .then((res) => {
        if (isMounted && res.data?.success && res.data.zones?.length > 0) {
          setDeliveryZones(res.data.zones);
        }
      })
      .catch((err) => {
        console.error('[Fetch Zones Error]', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time automatic zone matcher whenever City, State, or Pincode changes
  const selectedZone = React.useMemo(() => {
    if (!deliveryZones.length) return '';
    const autoMatched = detectZone(
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.pincode,
      deliveryZones
    );
    return autoMatched ? autoMatched._id : deliveryZones[0]._id;
  }, [shippingAddress.city, shippingAddress.state, shippingAddress.pincode, deliveryZones]);

  const getProductImage = (p) => getSafeImageUrl(p);

  const currentZone = deliveryZones.find((z) => z._id === selectedZone);
  const deliveryCharge = currentZone ? currentZone.delivery_charge : 0;

  // Buy Cart GST & Total
  const totalBuyGst = buyCart.reduce((acc, item) => {
    const itemSubtotal = (item.product.sale_price || 0) * item.quantity;
    const gstRate = item.product.gst_rate || 18;
    return acc + Math.round((itemSubtotal * gstRate) / 100);
  }, 0);
  const grandBuyTotal = buySubtotal + totalBuyGst + deliveryCharge;

  // Rental Cart GST & Monthly Total
  const totalRentalGst = Math.round(rentalMonthlyTotal * 0.18);
  const grandRentalMonthly = rentalMonthlyTotal + totalRentalGst;

  // Razorpay Checkout Handler (for Buy Cart)
  const handleRazorpayOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in or register to place an order.');
      navigate('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.phone) {
      toast.error('Please enter delivery street address and contact phone.');
      return;
    }

    setProcessing(true);
    try {
      const orderPayload = {
        items: buyCart.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        delivery_zone_id: selectedZone
      };

      const res = await api.post('/orders', orderPayload);
      if (!res.data.success) {
        toast.error(res.data.message || 'Failed to initiate order.');
        setProcessing(false);
        return;
      }

      const { order, razorpay_order_id, razorpay_key_id, amount } = res.data;

      const options = {
        key: razorpay_key_id,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: brandName,
        description: `Order ${order.invoice_number}`,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id
            });

            if (verifyRes.data.success) {
              clearBuyCart();
              toast.success('Payment successful! Order confirmed.');
              setCelebration({
                isOpen: true,
                title: 'Payment Verified & Order Confirmed!',
                subtitle: `Official invoice #${order.invoice_number || ''} has been generated.`,
                referenceId: order.invoice_number || 'TXN-CONFIRMED',
                amount: `₹${Math.round(buySubtotal * 1.18).toLocaleString('en-IN')}`,
                redirectTo: '/dashboard/orders'
              });
            }
          } catch {
            triggerFailureShake();
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: shippingAddress.contact_person,
          email: user?.email,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#0D3B2A'
        }
      };

      if (typeof window.Razorpay === 'undefined') {
        toast.error('Payment gateway script failed to load. Please disable ad-blockers or proceed with Corporate PO.');
        setProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        triggerFailureShake();
        toast.error(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing order.');
    } finally {
      setProcessing(false);
    }
  };

  // Corporate Purchase Order (Net-30 / Proforma / Wire) Handler (for Buy Cart)
  const handleCorporatePO = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in or register to place a corporate purchase order.');
      navigate('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.phone) {
      toast.error('Please enter delivery street address and contact phone.');
      return;
    }

    setProcessing(true);
    try {
      const orderPayload = {
        items: buyCart.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        delivery_zone_id: selectedZone,
        payment_method: 'po'
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        clearBuyCart();
        toast.success('Official Corporate Purchase Order generated!');
        setCelebration({
          isOpen: true,
          title: 'Purchase Order Registered!',
          subtitle: `Official Net-30 / Proforma PO #${res.data.order?.invoice_number || ''} created successfully.`,
          referenceId: res.data.order?.invoice_number || 'PO-OFFICIAL',
          amount: `₹${Math.round(buySubtotal * 1.18).toLocaleString('en-IN')}`,
          redirectTo: '/dashboard/orders'
        });
      } else {
        toast.error(res.data.message || 'Failed to generate purchase order.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing purchase order.');
    } finally {
      setProcessing(false);
    }
  };

  // Execute Corporate Master Rental Agreement Handler (for Rental Cart)
  const handleExecuteRentalLease = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to execute a corporate fleet lease agreement.');
      navigate('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.company_name || !shippingAddress.phone) {
      toast.error('Please specify Company Name and Contact Phone for the Master Rental Agreement.');
      return;
    }

    setProcessing(true);
    try {
      // Loop through rentalCart items and create lease agreements
      for (const item of rentalCart) {
        await api.post('/rentals', {
          product_id: item.product._id,
          quantity: item.quantity,
          tenure: item.tenure || '6_months',
          monthly_rate: item.product.rental_price_monthly
        });
      }

      clearRentalCart();
      toast.success('Corporate Master Rental Agreement registered!');
      setCelebration({
        isOpen: true,
        title: 'Master Rental Agreement Registered!',
        subtitle: 'Hardware fleet staging and SLA provisioning initiated.',
        referenceId: 'RENTAL-FLEET-AGMT',
        amount: `₹${Math.round(grandRentalMonthly).toLocaleString('en-IN')}/mo`,
        redirectTo: '/dashboard/rentals'
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error executing rental agreement.');
    } finally {
      setProcessing(false);
    }
  };

  // If both carts are completely empty
  if (cartCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#0D3B2A] flex items-center justify-center mx-auto border border-[#D4A24C]/30">
          <ShoppingCart className="w-8 h-8 text-[#D4A24C]" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#0D3B2A]">Your Procurement Cart is Empty</h2>
        <p className="text-xs text-[#5A6B63] max-w-md mx-auto">
          Explore certified corporate laptops, frameless displays, and GPUs available for outright purchase or flexible monthly lease.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow border border-[#D4A24C]/40"
          >
            <span>Hardware Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
          </Link>
          <Link
            to="/rental"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] font-bold text-xs uppercase tracking-wider transition border border-[#D4A24C]/40"
          >
            <span>Rental Fleet Plans</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Title & Luxury Dual-Cart Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4A24C]/20 pb-5">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block mb-1">
            — B2B PROCUREMENT & LEASING DESK
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A] tracking-tight">
            Corporate Cart & Checkout
          </h1>
        </div>

        {/* Dual Tab Switcher with Apple Spring Morphing */}
        <div className="inline-flex p-1 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/30 shadow-inner relative">
          <button
            onClick={() => setActiveTab('buy')}
            className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer z-10 ${
              activeTab === 'buy' ? 'text-white' : 'text-[#5A6B63] hover:text-[#0D3B2A]'
            }`}
          >
            {activeTab === 'buy' && (
              <motion.div
                layoutId="activeCartTab"
                transition={APPLE_SPRING}
                className="absolute inset-0 bg-[#0D3B2A] rounded-full -z-10 shadow-md"
              />
            )}
            <ShoppingCart className={`w-3.5 h-3.5 ${activeTab === 'buy' ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
            <span>Direct Purchase ({buyCartCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('rental')}
            className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer z-10 ${
              activeTab === 'rental' ? 'text-white' : 'text-[#5A6B63] hover:text-[#0D3B2A]'
            }`}
          >
            {activeTab === 'rental' && (
              <motion.div
                layoutId="activeCartTab"
                transition={APPLE_SPRING}
                className="absolute inset-0 bg-[#0D3B2A] rounded-full -z-10 shadow-md"
              />
            )}
            <Repeat className={`w-3.5 h-3.5 ${activeTab === 'rental' ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
            <span>Rental Cart ({rentalCartCount})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DIRECT PURCHASE ORDER (BUY CART)                  */}
      {/* ======================================================== */}
      {activeTab === 'buy' && (
        <>
          {buyCart.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D4A24C]/25 space-y-3">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#0D3B2A]">No items in Direct Purchase Cart</h3>
              <p className="text-xs text-[#5A6B63]">You have not added any hardware for outright purchase yet.</p>
              <Link
                to="/products"
                className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition"
              >
                Browse Hardware Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#5A6B63] px-1 font-mono">
                  <span>Showing {buyCart.length} hardware model(s) for Outright Purchase</span>
                  <button
                    onClick={clearBuyCart}
                    className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Buy Cart</span>
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {buyCart.map((item) => {
                    const p = item.product;
                    const itemTotal = (p.sale_price || 0) * item.quantity;
                    const maxSale = p.sale_stock !== undefined ? p.sale_stock : p.stock_quantity || 10;
                    const isMax = item.quantity >= maxSale;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24, height: 0, overflow: 'hidden', marginBottom: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        key={p._id}
                        className="bg-white p-4 sm:p-5 rounded-3xl border border-[#D4A24C]/25 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] p-2 border border-[#D4A24C]/20 flex items-center justify-center shrink-0">
                            <img
                              src={getProductImage(p)}
                              alt={p.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_HARDWARE_PLACEHOLDER;
                              }}
                              className="max-h-full object-contain filter drop-shadow-sm"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30 whitespace-nowrap">
                              <ShieldCheck className="w-3 h-3 text-[#D4A24C]" />
                              Stock: {maxSale} Available
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif line-clamp-2 mt-1">
                              {p.title}
                            </h3>
                            <p className="text-[11px] text-[#5A6B63] font-mono mt-0.5">
                              ₹{p.sale_price.toLocaleString('en-IN')}/unit • GST {p.gst_rate || 18}% (excl. GST)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          {/* Quantity Counter clamped to sale_stock */}
                          <div className="flex items-center border border-[#D4A24C]/30 rounded-full overflow-hidden bg-[#FAF7F2] text-xs shadow-inner">
                            <button
                              onClick={() => updateBuyQuantity(p._id, item.quantity - 1)}
                              className="p-1.5 px-2.5 hover:bg-[#F3E8D2] transition text-[#0D3B2A] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-bold font-mono text-[#0D3B2A]">{item.quantity}</span>
                            <button
                              disabled={isMax}
                              onClick={() => updateBuyQuantity(p._id, item.quantity + 1)}
                              className="p-1.5 px-2.5 hover:bg-[#F3E8D2] disabled:opacity-30 transition text-[#0D3B2A] cursor-pointer"
                              title={isMax ? `Max available direct stock is ${maxSale}` : 'Add 1 more'}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <span className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-mono">
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromBuyCart(p._id)}
                            className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Delivery & Invoicing Address Box */}
                <div className="bg-white p-6 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-[#0D3B2A] font-serif flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#D4A24C]" />
                    Corporate Delivery Address & Invoicing Info
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Company / Entity Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Tech Solutions"
                        value={shippingAddress.company_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, company_name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700">GSTIN (for 18% Input Credit)</label>
                        {shippingAddress.gst_number?.trim().length === 15 && (
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                            PAN: {shippingAddress.gst_number.trim().slice(2, 12).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="07AAAAA0000A1Z5"
                        value={shippingAddress.gst_number}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, gst_number: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={shippingAddress.contact_person}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, contact_person: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="WhatsApp or Mobile"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      placeholder="Office suite, floor, tech park, road..."
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 110094"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Outright Purchase Summary Card */}
              <div className="lg:col-span-5 space-y-4">
                <motion.div
                  animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.45 }}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-4 text-xs"
                >
                  <h3 className="text-base font-bold text-[#0D3B2A] font-serif border-b border-[#D4A24C]/15 pb-3">
                    Outright Purchase Summary
                  </h3>

                  <div className="space-y-2 text-[#5A6B63]">
                    <div className="flex justify-between">
                      <span>Hardware Subtotal:</span>
                      <span className="font-mono font-bold text-[#0D3B2A]">
                        ₹{buySubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated GST (18% GSTR-2B):</span>
                      <span className="font-mono font-bold text-emerald-700">
                        +₹{totalBuyGst.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <div>
                        <span>Pan-India Secure Transit:</span>
                        {currentZone && (
                          <p className="text-[10.5px] text-[#8A5E12] font-semibold mt-0.5">
                            {currentZone.zone_name} • {currentZone.estimated_days || (deliveryCharge === 0 ? 'Same-Day / 24 Hours' : '2–3 Business Days')}
                          </p>
                        )}
                      </div>
                      <span className="font-mono font-bold text-[#0D3B2A]">
                        {deliveryCharge === 0 ? (
                          <span className="text-emerald-700 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryCharge.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>

                    <div className="border-t border-[#D4A24C]/20 pt-3 flex justify-between items-baseline text-sm">
                      <span className="font-bold text-[#0D3B2A] font-serif">Grand Tax-Paid Total:</span>
                      <span className="text-xl font-bold text-[#0D3B2A] font-serif">
                        ₹{grandBuyTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/20 text-[11px] text-[#5A6B63] space-y-1">
                    <p className="flex items-center gap-1.5 font-bold text-[#0D3B2A]">
                      <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
                      Enterprise Assurance & Warranty
                    </p>
                    <p>Includes 30-point lab certification, 6–12 month warranty, and verified GST invoice.</p>
                  </div>

                  {/* Dual Checkout Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={handleCorporatePO}
                      disabled={processing}
                      className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#D4A24C]" />
                      <span>{processing ? 'Generating PO...' : 'Generate Corporate PO (Net-30 / Proforma)'}</span>
                    </button>

                    <button
                      onClick={handleRazorpayOrder}
                      disabled={processing}
                      className="w-full py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-[#D4A24C]" />
                      <span>Pay Online via Razorpay</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CORPORATE RENTAL FLEET LEASE (RENTAL CART)       */}
      {/* ======================================================== */}
      {activeTab === 'rental' && (
        <>
          {rentalCart.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D4A24C]/25 space-y-3">
              <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#0D3B2A]">No Hardware in Rental Cart</h3>
              <p className="text-xs text-[#5A6B63]">
                Looking to deploy laptops or workstations on flexible monthly leases without capital expenditure?
              </p>
              <Link
                to="/rental"
                className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition"
              >
                Explore Rental Hardware
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Rental Items & Tenure Selector */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#5A6B63] px-1 font-mono">
                  <span>Showing {rentalCart.length} machine model(s) for Corporate Lease</span>
                  <button
                    onClick={clearRentalCart}
                    className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Rental Cart</span>
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {rentalCart.map((item) => {
                    const p = item.product;
                    const discount = getTenureDiscount(item.tenure);
                    const baseRate = p.rental_price_monthly || 1350;
                    const itemBaseTotal = baseRate * item.quantity;
                    const itemDiscount = Math.round(itemBaseTotal * discount);
                    const itemTaxableTotal = itemBaseTotal - itemDiscount;
                    const effectivePerUnitRate = item.quantity > 0 ? itemTaxableTotal / item.quantity : baseRate;
                    const maxRental = p.rental_stock !== undefined ? p.rental_stock : 5;
                    const isMax = item.quantity >= maxRental;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24, height: 0, overflow: 'hidden', marginBottom: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        key={p._id}
                        className="bg-white p-5 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] p-2 border border-[#D4A24C]/20 flex items-center justify-center shrink-0">
                              <img
                                src={getProductImage(p)}
                                alt={p.title}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = DEFAULT_HARDWARE_PLACEHOLDER;
                                }}
                                className="max-h-full object-contain filter drop-shadow-sm"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 whitespace-nowrap">
                                  <ShieldCheck className="w-3 h-3 text-[#D4A24C]" />
                                  Stock: {maxRental} Available
                                </span>
                                {discount > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                                    {Math.round(discount * 100)}% Tenure Off
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif line-clamp-2 mt-1">
                                {p.title}
                              </h3>
                              <div className="flex flex-wrap items-baseline gap-1.5 text-xs font-mono mt-0.5">
                                {discount > 0 && (
                                  <span className="line-through text-slate-400 text-[11px]">
                                    ₹{baseRate.toLocaleString('en-IN')}/mo
                                  </span>
                                )}
                                <span className="font-bold text-[#0D3B2A]">
                                  ₹{Number(effectivePerUnitRate.toFixed(2)).toLocaleString('en-IN')}/mo
                                </span>
                                <span className="text-[10.5px] text-[#5A6B63] font-sans">per device (excl. GST)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            {/* Quantity Counter clamped to rental_stock */}
                            <div className="flex items-center border border-[#D4A24C]/30 rounded-full overflow-hidden bg-[#FAF7F2] text-xs shadow-inner">
                              <button
                                onClick={() => updateRentalQuantity(p._id, item.quantity - 1)}
                                className="p-1.5 px-2.5 hover:bg-[#F3E8D2] transition text-[#0D3B2A] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-bold font-mono text-[#0D3B2A]">{item.quantity}</span>
                              <button
                                disabled={isMax}
                                onClick={() => updateRentalQuantity(p._id, item.quantity + 1)}
                                className="p-1.5 px-2.5 hover:bg-[#F3E8D2] disabled:opacity-30 transition text-[#0D3B2A] cursor-pointer"
                                title={isMax ? `Max available rental fleet is ${maxRental}` : 'Add 1 more'}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right min-w-[95px]">
                              <span className="text-sm font-bold text-[#0D3B2A] font-mono block">
                                ₹{itemTaxableTotal.toLocaleString('en-IN')}/mo
                              </span>
                              <span className="text-[10px] text-[#5A6B63] block">taxable subtotal</span>
                            </div>

                            <button
                              onClick={() => removeFromRentalCart(p._id)}
                              className="text-slate-400 hover:text-red-500 transition p-1.5 cursor-pointer rounded-lg hover:bg-red-50"
                              title="Remove from rental cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Tenure Selector for this machine */}
                        <div className="bg-[#FAF7F2] p-3 sm:p-3.5 rounded-2xl border border-[#D4A24C]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-white border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shadow-xs shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-[#0D3B2A] font-serif block text-xs">
                                Lease Commitment Tenure
                              </span>
                              <span className="text-[10.5px] text-[#5A6B63] block">
                                Higher tenure commits unlock progressive billing discounts
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 bg-white/80 rounded-xl border border-[#D4A24C]/25 shadow-xs">
                            {[
                              { id: '3_months', label: '3 Months', tag: 'Standard' },
                              { id: '6_months', label: '6 Months', tag: '5% Off' },
                              { id: '12_months', label: '12+ Months', tag: '15% Off' }
                            ].map((t) => {
                              const isSelected = (item.tenure || '6_months') === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => updateRentalTenure(p._id, t.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                                    isSelected
                                      ? 'bg-[#0D3B2A] text-white shadow-sm ring-1 ring-[#D4A24C]/40'
                                      : 'text-[#5A6B63] hover:text-[#0D3B2A] hover:bg-[#FAF7F2]'
                                  }`}
                                >
                                  <span>{t.label}</span>
                                  <span
                                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                                      isSelected
                                        ? 'bg-white/20 text-[#D4A24C]'
                                        : t.id === '3_months'
                                        ? 'bg-slate-100 text-slate-500'
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                  >
                                    {t.tag}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Corporate Entity Details */}
                <div className="bg-white p-6 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-[#0D3B2A] font-serif flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#D4A24C]" />
                    Corporate Master Lease Agreement Details
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Company / Entity Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Registered business name"
                        value={shippingAddress.company_name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, company_name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700">Corporate GSTIN Number</label>
                        {shippingAddress.gst_number?.trim().length === 15 && (
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                            PAN: {shippingAddress.gst_number.trim().slice(2, 12).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="07AAAAA0000A1Z5"
                        value={shippingAddress.gst_number}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, gst_number: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Procurement Officer / Contact *</label>
                      <input
                        type="text"
                        required
                        placeholder="Authorized signatory"
                        value={shippingAddress.contact_person}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, contact_person: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Direct Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Deployment Office Location *</label>
                    <input
                      type="text"
                      placeholder="Tech park, building, city (e.g. Bangalore, Gurugram, Mumbai)..."
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Corporate Rental Agreement Summary */}
              <div className="lg:col-span-5 space-y-4">
                <motion.div
                  animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.45 }}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-4 text-xs"
                >
                  <h3 className="text-base font-bold text-[#0D3B2A] font-serif border-b border-[#D4A24C]/15 pb-3">
                    Monthly Lease Quotation Summary
                  </h3>

                  <div className="space-y-2.5 text-[#5A6B63]">
                    <div className="flex justify-between items-center">
                      <span>Total Rental Units:</span>
                      <span className="font-mono font-bold text-[#0D3B2A]">
                        {rentalCartCount} {rentalCartCount === 1 ? 'Machine' : 'Machines'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Base Monthly Rental:</span>
                      <span className="font-mono font-bold text-[#0D3B2A]">
                        ₹{rentalUndiscountedTotal.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    {rentalSavingsTotal > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 font-semibold">
                        <span>Tenure Volume Discount:</span>
                        <span className="font-mono font-bold">
                          -₹{rentalSavingsTotal.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-slate-200/80 pt-2 font-medium text-slate-800">
                      <span>Net Taxable Rental:</span>
                      <span className="font-mono font-bold text-[#0D3B2A]">
                        ₹{rentalMonthlyTotal.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Refundable Security Deposit:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        ₹0 (100% Zero-Collateral)
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Monthly GST (18% GSTR-2B):</span>
                      <span className="font-mono font-bold text-slate-700">
                        +₹{totalRentalGst.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <div className="border-t border-[#D4A24C]/20 pt-3 flex justify-between items-baseline text-sm">
                      <div>
                        <span className="font-bold text-[#0D3B2A] font-serif block">Grand Monthly Recurring:</span>
                        <span className="text-[10px] text-[#5A6B63] block font-sans">
                          100% GST ITC Deductible (Net cost after ITC: ₹{rentalMonthlyTotal.toLocaleString('en-IN')}/mo)
                        </span>
                      </div>
                      <span className="text-xl font-bold text-[#0D3B2A] font-serif text-right">
                        ₹{grandRentalMonthly.toLocaleString('en-IN')}<span className="text-xs text-[#5A6B63] font-sans font-normal">/mo</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/20 text-[11px] text-[#5A6B63] space-y-1.5">
                    <p className="flex items-center gap-1.5 font-bold text-[#0D3B2A]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Zero Capital Outlay (100% OPEX Deductible)
                    </p>
                    <p className="flex items-center gap-1.5 font-bold text-[#0D3B2A]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      24–48h SLA Standby Swap Agreement Included
                    </p>
                    <p className="flex items-center gap-1.5 font-bold text-[#0D3B2A]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Zero Security Deposit for GSTIN-verified entities
                    </p>
                  </div>

                  <button
                    onClick={handleExecuteRentalLease}
                    disabled={processing}
                    className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
                  >
                    <Repeat className="w-4 h-4 text-[#D4A24C]" />
                    <span>{processing ? 'Registering Agreement...' : 'Execute Corporate Rental Agreement (PO)'}</span>
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Checkout Executive Success Modal */}
      <ExecutiveSuccessCard
        isOpen={celebration.isOpen}
        title={celebration.title}
        referenceId={celebration.referenceId}
        amount={celebration.amount}
        viewOrderLink={celebration.redirectTo || '/dashboard/orders'}
        onClose={() => {
          const target = celebration.redirectTo;
          setCelebration((prev) => ({ ...prev, isOpen: false }));
          if (target) {
            navigate(target);
          }
        }}
      />
    </div>
  );
}
