import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function Products() {
  const { openRFQ } = useOutletContext();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to format specs dynamically
  const getProductSpecSummary = (p) => {
    if (p.category === 'monitor') {
      const parts = [p.specs?.screen_size, p.specs?.ports, p.specs?.ergonomics].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Full HD IPS Frameless Display';
    }
    if (p.category === 'gpu') {
      const parts = [p.specs?.vram, p.specs?.cuda_cores, p.specs?.outputs].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'GDDR6 Workstation Graphics';
    }
    if (p.category === 'ram') {
      const parts = [p.specs?.ram, p.specs?.speed, p.specs?.form_factor].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'DDR4 High-Speed Memory';
    }
    const laptopParts = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean);
    if (laptopParts.length > 0) return laptopParts.join(' • ');
    return p.description || 'Enterprise Grade A+ Hardware';
  };

  const getProductImage = (p) => {
    const s = p.slug?.toLowerCase() || '';
    const cat = p.category?.toLowerCase() || '';

    if (cat === 'gpu' || s.includes('rtx') || s.includes('3060')) {
      return '/products/real-rtx-3060-gpu-transparent.png';
    }
    if (cat === 'ram' || s.includes('ddr4') || s.includes('memory')) {
      return '/products/real-enterprise-ram-transparent.png';
    }
    if (cat === 'monitor' || s.includes('p2419h') || s.includes('display')) {
      return '/products/real-dell-display-transparent.png';
    }
    if (s.includes('latitude')) {
      return '/products/real-dell-latitude-transparent.png';
    }
    if (s.includes('thinkpad')) {
      return '/products/real-thinkpad-t14-transparent.png';
    }
    if (s.includes('elitebook') || s.includes('hp')) {
      return '/products/real-mobile-workstation-transparent.png';
    }

    const url = p.images?.[0]?.url;
    if (!url || url.includes('photo-1544717305-2782549b5136')) {
      return '/products/real-thinkpad-t14-transparent.png';
    }
    return url;
  };

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialCat = (searchParams.get('category') || 'all').replace(/s$/, '');
  const [category, setCategory] = useState(initialCat);
  const [condition, setCondition] = useState('all');
  const [availableFor, setAvailableFor] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat.replace(/s$/, ''));
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
          sort
        };
        if (category !== 'all') params.category = category;
        if (condition !== 'all') params.condition = condition;
        if (availableFor !== 'all') params.available_for = availableFor;
        if (search.trim()) params.search = search.trim();

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('[Error fetching products]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, condition, availableFor, sort, page, search]);

  const categories = [
    { id: 'all', label: 'All Hardware' },
    { id: 'laptop', label: 'Corporate Laptops' },
    { id: 'desktop', label: 'Commercial Desktops' },
    { id: 'monitor', label: 'Business Monitors' },
    { id: 'ram', label: 'RAM Modules' },
    { id: 'gpu', label: 'Workstation GPUs' },
    { id: 'cpu', label: 'Processors / CPUs' },
    { id: 'other', label: 'Accessories' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4A24C]/20">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#D4A24C] font-semibold block">
            — VERIFIED COMMERCIAL INVENTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0D3B2A] font-normal tracking-tight">
            Commercial Hardware Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B63] mt-1">
            Showing {total} enterprise tested machines & components available for dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, specs, GPU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D4A24C]/30 rounded-full text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] transition shadow-sm"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 bg-white border border-[#D4A24C]/30 rounded-full text-xs font-semibold text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="featured">Featured First</option>
          </select>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 bg-white border border-[#D4A24C]/30 rounded-xl text-[#0D3B2A] hover:bg-[#FAF7F2]"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block md:col-span-3 bg-white p-5 rounded-2xl border border-[#D4A24C]/25 shadow-sm space-y-6 text-xs`}
        >
          <div className="flex items-center justify-between font-bold text-[#0D3B2A] border-b border-[#D4A24C]/15 pb-3">
            <span className="flex items-center gap-1.5 font-serif text-sm">
              <Filter className="w-4 h-4 text-[#D4A24C]" />
              Filter Inventory
            </span>
            <button
              onClick={() => {
                setCategory('all');
                setCondition('all');
                setAvailableFor('all');
                setSearch('');
                setPage(1);
              }}
              className="text-[11px] text-[#D4A24C] hover:text-[#0D3B2A] font-medium"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="font-bold text-[#0D3B2A] block uppercase font-mono tracking-wider text-[10px]">
              Hardware Category
            </label>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition flex items-center justify-between ${
                    category === c.id
                      ? 'bg-[#0D3B2A] text-white shadow-sm'
                      : 'text-[#5A6B63] hover:bg-[#FAF7F2] hover:text-[#0D3B2A]'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2 pt-2 border-t border-[#D4A24C]/15">
            <label className="font-bold text-[#0D3B2A] block uppercase font-mono tracking-wider text-[10px]">
              Available For
            </label>
            <div className="grid grid-cols-3 gap-1">
              {['all', 'sale', 'rent'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setAvailableFor(opt);
                    setPage(1);
                  }}
                  className={`py-1.5 rounded-lg font-semibold capitalize transition text-center ${
                    availableFor === opt
                      ? 'bg-[#0D3B2A] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#5A6B63] hover:bg-[#F3E8D2] hover:text-[#0D3B2A] border border-[#D4A24C]/20'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Condition / Grade */}
          <div className="space-y-2 pt-2 border-t border-[#D4A24C]/15">
            <label className="font-bold text-[#0D3B2A] block uppercase font-mono tracking-wider text-[10px]">
              Condition Grade
            </label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'grade_a_plus', label: 'Grade A+ Pristine' },
                { id: 'grade_a', label: 'Grade A Corporate' },
                { id: 'grade_b', label: 'Grade B Budget' }
              ].map((cond) => (
                <label
                  key={cond.id}
                  className="flex items-center gap-2 text-[#5A6B63] cursor-pointer hover:text-[#0D3B2A] py-1"
                >
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === cond.id}
                    onChange={() => {
                      setCondition(cond.id);
                      setPage(1);
                    }}
                    className="accent-[#0D3B2A]"
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Products Grid */}
        <div className="md:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-3xl border border-[#D4A24C]/20 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#D4A24C]/25 p-8 space-y-3">
              <p className="text-sm font-bold text-[#0D3B2A] font-serif">No hardware found matching your criteria.</p>
              <p className="text-xs text-[#5A6B63]">Try clearing filters or search terms.</p>
              <button
                onClick={() => {
                  setCategory('all');
                  setCondition('all');
                  setAvailableFor('all');
                  setSearch('');
                }}
                className="px-5 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl p-6 border border-[#0D3B2A]/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.08)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F3E8D2] text-[#0D3B2A] tracking-wider uppercase">
                        {p.condition.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-[#5A6B63] font-semibold">
                        Stock: {p.stock_quantity}
                      </span>
                    </div>

                    <Link to={`/products/${p.slug}`} className="block">
                      <div className="h-44 rounded-2xl bg-[#FAF7F2] flex items-center justify-center p-3 mb-4 overflow-hidden border border-[#D4A24C]/20 cursor-pointer">
                        <img
                          src={getProductImage(p)}
                          alt={p.title}
                          className="h-full object-contain group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    </Link>

                    <Link to={`/products/${p.slug}`} className="hover:text-[#D4A24C] transition block">
                      <h3 className="text-sm font-bold text-[#0D3B2A] line-clamp-1 font-serif group-hover:text-[#D4A24C] transition">{p.title}</h3>
                    </Link>

                    <p className="text-xs text-[#5A6B63] mt-1 line-clamp-2 min-h-[32px] font-mono text-[11px]">
                      {getProductSpecSummary(p)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D4A24C]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#5A6B63] uppercase tracking-wider block font-semibold">
                          Pricing
                        </span>
                        <span className="text-base font-bold text-[#0D3B2A] font-serif">
                          ₹{p.sale_price.toLocaleString('en-IN')}{' '}
                          {p.rental_price_monthly > 0 && (
                            <span className="text-xs text-[#D4A24C] font-normal font-sans">
                              or ₹{p.rental_price_monthly.toLocaleString('en-IN')}/mo
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => openRFQ(`${p.title} (${p.stock_quantity} in stock)`)}
                        className="w-full py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow border border-[#D4A24C]/40"
                      >
                        Inquire Bulk
                      </button>

                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-2.5 rounded-full bg-[#F3E8D2] hover:bg-[#E6D5B8] text-[#0D3B2A] text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 border border-[#D4A24C]/40"
                        title="Add to Quotation Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#0D3B2A]" />
                        <span>Add Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#0D3B2A] px-3 font-serif">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
