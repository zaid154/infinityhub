import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryZones, setDeliveryZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    company_name: user?.company_name || '',
    contact_person: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '',
    gst_number: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/settings/delivery-zones');
        if (res.data.success && res.data.zones.length > 0) {
          setDeliveryZones(res.data.zones);
          setSelectedZone(res.data.zones[0]._id);
        }
      } catch (err) {
        console.error('[Fetch Zones Error]', err);
      }
    };
    fetchZones();
  }, []);

  const currentZone = deliveryZones.find((z) => z._id === selectedZone);
  const deliveryCharge = currentZone ? currentZone.delivery_charge : 0;

  // Calculate GST per item according to each product's gst_rate
  const totalGst = cart.reduce((acc, item) => {
    const itemSubtotal = item.product.sale_price * item.quantity;
    const gstRate = item.product.gst_rate || 18;
    return acc + Math.round((itemSubtotal * gstRate) / 100);
  }, 0);

  const grandTotal = cartSubtotal + totalGst + deliveryCharge;

  // Razorpay Checkout Handler
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
        items: cart.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        delivery_zone_id: selectedZone
      };

      const res = await api.post('/orders', orderPayload);
      if (!res.data.success) {
        toast.error('Failed to initiate order.');
        setProcessing(false);
        return;
      }

      const { order, razorpay_order_id, razorpay_key_id, amount } = res.data;

      // Launch Razorpay popup
      const options = {
        key: razorpay_key_id,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Nova Infotech Solutions',
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
              clearCart();
              toast.success('Payment successful! Order confirmed.');
              navigate(`/dashboard/orders`);
            }
          } catch (vErr) {
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

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        toast.error(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing order.');
    } finally {
      setProcessing(false);
    }
  };

  // Corporate Purchase Order (Net-30 / Proforma / Wire) Handler
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
        items: cart.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        delivery_zone_id: selectedZone,
        payment_method: 'po'
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        toast.success('Official Corporate Purchase Order generated! Redirecting to orders...');
        navigate('/dashboard/orders');
      } else {
        toast.error('Failed to generate purchase order.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing purchase order.');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#0D3B2A] flex items-center justify-center mx-auto border border-[#D4A24C]/30">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#0D3B2A]">Your Quotation Cart is Empty</h2>
        <p className="text-xs text-[#5A6B63]">
          Browse our certified refurbished laptops, monitors, and components to add items.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow border border-[#D4A24C]/40"
        >
          <span>Explore Hardware Catalog</span>
          <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quotation Cart & Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review hardware volumes, tax credits, and delivery zones.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => {
            const p = item.product;
            const itemTotal = p.sale_price * item.quantity;
            return (
              <div
                key={p._id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shrink-0">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80'}
                      alt=""
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ₹{p.sale_price.toLocaleString('en-IN')} each • GST {p.gst_rate}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                    <button
                      onClick={() => updateQuantity(p._id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(p._id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(p._id)}
                    className="text-slate-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Delivery & Address Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Delivery Address & Invoicing Details</h3>

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
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="07AAAAA0000A1Z5"
                  value={shippingAddress.gst_number}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, gst_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] uppercase"
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
                placeholder="Office suite, building, road..."
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
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                />
              </div>
            </div>

            {/* Delivery Zone Selector */}
            {deliveryZones.length > 0 && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shipping Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                >
                  {deliveryZones.map((z) => (
                    <option key={z._id} value={z._id}>
                      {z.zone_name} — Delivery: ₹{z.delivery_charge}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Order Summary & Actions */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4A24C]/25 shadow-xl space-y-6">
          <h3 className="text-base font-bold font-serif text-[#0D3B2A] border-b border-[#D4A24C]/20 pb-3">
            Quotation & Tax Summary
          </h3>

          <div className="space-y-3 text-xs text-[#5A6B63]">
            <div className="flex justify-between">
              <span>Hardware Subtotal:</span>
              <span className="font-bold text-[#0D3B2A] font-mono">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (Calculated per item):</span>
              <span className="font-bold text-[#0D3B2A] font-mono">
                + ₹{totalGst.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Logistics ({currentZone?.zone_name || 'Standard'}):</span>
              <span className="font-bold text-[#0D3B2A] font-mono">
                + ₹{deliveryCharge.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#D4A24C]/20 text-sm">
              <span className="font-bold font-serif text-[#0D3B2A]">Grand Total:</span>
              <span className="font-bold text-[#0D3B2A] font-serif text-lg">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {/* 1. Official Corporate Purchase Order Option */}
            <button
              onClick={handleCorporatePO}
              disabled={processing}
              className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#D4A24C]" />
              <span>{processing ? 'Generating PO...' : 'Generate Corporate PO (Net-30 / Proforma)'}</span>
            </button>

            {/* 2. Instant Online Payment Option */}
            <button
              onClick={handleRazorpayOrder}
              disabled={processing}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] hover:brightness-105 text-[#072117] font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#072117]" />
              <span>{processing ? 'Processing...' : 'Pay Online via Razorpay'}</span>
            </button>

            {/* 3. WhatsApp Direct RFQ Option */}
            <button
              onClick={() => {
                const message = `*OFFICIAL BULK RFQ FROM CART*\n------------------------------\n${cart
                  .map((i) => `• ${i.product.title} (Qty: ${i.quantity})`)
                  .join('\n')}\n------------------------------\n*Subtotal:* ₹${cartSubtotal}\n*Total with GST:* ₹${grandTotal}\n*Location:* ${shippingAddress.city}\n------------------------------\nPlease share formal GST Proforma invoice.`;
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="w-full py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30 font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Forward Cart to Direct Desk via WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-[#5A6B63] text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#8A5E12]" />
            100% Tax Compliant GSTR-2B Invoice issued upon confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
