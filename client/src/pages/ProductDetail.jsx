import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  Send,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { openRFQ } = useOutletContext();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
          setSelectedImage(0);
        }
      } catch (err) {
        console.error('[Product Detail Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/products" className="text-sm font-bold text-blue-600 hover:underline">
          Return to Inventory
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => {
        if (!img.url || img.url.includes('photo-1544717305-2782549b5136') || product.slug?.includes('hp-elitebook')) {
          return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80';
        }
        return img.url;
      })
    : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hardware Catalog</span>
      </Link>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-96 sm:h-[450px] bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl bg-white border p-2 shrink-0 transition ${
                    selectedImage === idx
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {product.condition.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                Available Stock: {product.stock_quantity} Units
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Brand: <strong className="text-slate-700">{product.brand}</strong> • Model: <strong className="text-slate-700">{product.model || 'Standard'}</strong>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                Corporate Wholesale Price
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                ₹{product.sale_price.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">+ {product.gst_rate}% GST</span>
              </div>
            </div>

            {product.rental_price_monthly > 0 && (
              <div className="border-l border-blue-200 pl-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Rental Lease
                </span>
                <div className="text-xl font-bold text-blue-700 font-mono">
                  ₹{product.rental_price_monthly.toLocaleString('en-IN')}/mo
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => openRFQ(`${product.title} (Stock: ${product.stock_quantity})`)}
              className="py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Request Bulk Quotation</span>
            </button>

            <button
              onClick={() => addToCart(product, 1)}
              className="py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span>Add to Quote Cart</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>6–12 Months Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Pan-India Safe Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Tax Invoiced with GSTIN</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>24–48h On-site Replacement SLA</span>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Technical Specifications</h3>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
                {Object.entries(product.specs).map(([k, v]) => {
                  if (!v) return null;
                  return (
                    <div key={k} className="flex justify-between border-b border-slate-200/60 pb-1.5 last:border-none">
                      <span className="font-semibold text-slate-500 capitalize">
                        {k.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-slate-900 text-right">{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-900">Product Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Similar Recommended Hardware</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-50 rounded-xl p-2 mb-3 flex items-center justify-center">
                    <img
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="h-full object-contain"
                    />
                  </div>
                  <Link to={`/products/${item.slug}`} className="hover:text-blue-600 transition">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1">₹{item.sale_price.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => openRFQ(item.title)}
                  className="mt-3 w-full py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition"
                >
                  Inquire
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
