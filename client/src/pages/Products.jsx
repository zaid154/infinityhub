import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  X,
  Repeat
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { getSafeImageUrl } from '../utils/imageHelper';

export default function Products() {
  const { openRFQ } = useOutletContext();
  const { addToBuyCart, addToRentalCart } = useCart();
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
    return p.description || 'Enterprise Grade Hardware';
  };

  // Helper to get real condition badge (no invented certifications)
  const getConditionBadge = (cond) => {
    if (!cond) return null;
    switch (cond) {
      case 'brand_new':
        return { label: '★ Brand New', className: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'open_box':
        return { label: 'Open Box', className: 'bg-sky-50 text-sky-900 border-sky-300' };
      case 'grade_a_plus':
        return { label: 'Grade A+', className: 'bg-[#FAF7F2] text-[#8A5E12] border-[#D4A24C]/40' };
      case 'grade_a':
        return { label: 'Grade A', className: 'bg-[#FAF7F2] text-[#8A5E12] border-[#D4A24C]/40' };
      case 'grade_b':
        return { label: 'Grade B', className: 'bg-[#FAF7F2] text-[#5A6B63] border-[#5A6B63]/30' };
      default:
        return { label: cond.replace(/_/g, ' ').toUpperCase(), className: 'bg-[#FAF7F2] text-[#8A5E12] border-[#D4A24C]/30' };
    }
  };

  // Helper for dynamic stock info based on actual DB numbers
  const getStockInfo = (p, currentFilter) => {
    if (currentFilter === 'rent' || p.available_for === 'rent') {
      const fleet = typeof p.rental_stock === 'number' ? p.rental_stock : 0;
      if (fleet > 0) {
        return { text: `${fleet} in fleet`, inStock: true };
      }
      return { text: 'Fleet Reserved', inStock: false };
    }

    if (currentFilter === 'sale' || p.available_for === 'sale') {
      const saleStock = typeof p.sale_stock === 'number' ? p.sale_stock : (typeof p.stock_quantity === 'number' ? p.stock_quantity : 0);
      if (saleStock > 0) {
        return { text: `${saleStock} in stock`, inStock: true };
      }
      return { text: 'Out of Stock', inStock: false };
    }

    // Combined view ('all' filter & product is 'both')
    const saleStock = typeof p.sale_stock === 'number' ? p.sale_stock : (typeof p.stock_quantity === 'number' ? p.stock_quantity : 0);
    const rentalStock = typeof p.rental_stock === 'number' ? p.rental_stock : 0;

    if (saleStock > 0) {
      return { text: `${saleStock} in stock`, inStock: true };
    }
    if (rentalStock > 0) {
      return { text: `${rentalStock} in fleet`, inStock: true };
    }
    return { text: 'Out of Stock', inStock: false };
  };

  // Helper for deployment badge
  const getDeploymentBadge = (p) => {
    if (p.available_for === 'rent') return 'LEASE ONLY';
    if (p.available_for === 'sale') return 'DIRECT BUY';
    if (p.available_for === 'both') return 'BUY & LEASE';
    return null;
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

  // 100% Dynamic Category list from MongoDB
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Hardware' }
  ]);

  useEffect(() => {
    const fetchDBCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.categories?.length > 0) {
          const mapped = res.data.categories.map((c) => ({
            id: c.slug,
            label: c.name
          }));
          setCategories([{ id: 'all', label: 'All Hardware' }, ...mapped]);
        }
      } catch (err) {
        console.error('[Products] Category fetch notice:', err);
      }
    };
    fetchDBCategories();
  }, []);

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
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl p-5 overflow-y-auto'
              : 'hidden'
          } md:relative md:inset-auto md:z-auto md:w-auto md:block md:col-span-3 bg-white p-5 rounded-2xl border border-[#D4A24C]/25 shadow-sm space-y-6 text-xs md:sticky md:top-24 self-start`}
        >
          <div className="flex items-center justify-between font-bold text-[#0D3B2A] border-b border-[#D4A24C]/15 pb-3">
            <span className="flex items-center gap-1.5 font-serif text-sm">
              <Filter className="w-4 h-4 text-[#D4A24C]" />
              Filter Inventory
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCategory('all');
                  setCondition('all');
                  setAvailableFor('all');
                  setSearch('');
                  setPage(1);
                }}
                className="text-[11px] text-[#D4A24C] hover:text-[#0D3B2A] font-medium transition cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="md:hidden p-1 text-[#5A6B63] hover:text-[#0D3B2A] transition"
                aria-label="Close Filter Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
                    if (mobileFilterOpen) setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition flex items-center justify-between cursor-pointer ${
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
              {[
                { id: 'all', label: 'All Items' },
                { id: 'sale', label: 'Buy Only' },
                { id: 'rent', label: 'Rent Only' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAvailableFor(opt.id);
                    setPage(1);
                  }}
                  className={`py-1.5 px-1 rounded-lg font-semibold transition text-center text-[10px] uppercase tracking-wider cursor-pointer ${
                    availableFor === opt.id
                      ? 'bg-[#0D3B2A] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#5A6B63] hover:bg-[#F3E8D2] hover:text-[#0D3B2A] border border-[#D4A24C]/20'
                  }`}
                >
                  {opt.label}
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
                { id: 'brand_new', label: '★ Brand New (Sealed)' },
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
                <div key={i} className="h-96 bg-white rounded-3xl border border-[#D4A24C]/20 animate-pulse"></div>
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
                className="px-5 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.map((p) => {
                const condBadge = getConditionBadge(p.condition);
                const stockInfo = getStockInfo(p, availableFor);
                const deployBadge = getDeploymentBadge(p);

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-3xl p-5 border border-[#D4A24C]/25 hover:border-[#D4A24C] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(13,59,42,0.1)] transition-all duration-300 flex flex-col justify-between group h-full"
                  >
                    <div>
                      {/* Top Row: Clean Condition Pill (Left) & Real Stock Status (Right) */}
                      <div className="flex items-center justify-between gap-2 mb-3 h-6">
                        {condBadge ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-xs whitespace-nowrap ${condBadge.className}`}
                          >
                            {condBadge.label}
                          </span>
                        ) : (
                          <span />
                        )}

                        {/* Stock availability: Clean, single-line indicator that NEVER wraps */}
                        <div
                          className={`flex items-center gap-1.5 text-[11px] font-mono font-medium shrink-0 ${
                            stockInfo.inStock ? 'text-emerald-800' : 'text-[#8A5E12]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              stockInfo.inStock ? 'bg-emerald-600 animate-pulse' : 'bg-[#D4A24C]'
                            }`}
                          />
                          <span className="whitespace-nowrap">{stockInfo.text}</span>
                        </div>
                      </div>

                      {/* Image Pedestal Stage Container */}
                      <Link to={`/products/${p.slug}`} className="block">
                        <div className="h-48 sm:h-52 rounded-2xl bg-gradient-to-b from-[#FAF7F2] via-[#F6F0E7] to-[#EFE7DC] flex items-center justify-center p-4 mb-3.5 overflow-hidden border border-[#D4A24C]/20 cursor-pointer group-hover:border-[#D4A24C]/60 transition-all duration-300 relative">
                          {/* Deployment badge floating inside stage top-right */}
                          {deployBadge && (
                            <div className="absolute top-3 right-3 z-20 pointer-events-none">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase whitespace-nowrap bg-white/95 text-[#0D3B2A] border border-[#D4A24C]/40 shadow-xs backdrop-blur-sm">
                                {deployBadge}
                              </span>
                            </div>
                          )}

                          {/* Pedestal surface shadow */}
                          <div className="absolute bottom-2.5 w-32 h-3.5 bg-black/10 rounded-full blur-xs pointer-events-none" />

                          <img
                            src={getSafeImageUrl(p)}
                            alt={p.title}
                            className="relative z-10 max-h-36 sm:max-h-40 max-w-[82%] object-contain group-hover:scale-105 transition-transform duration-300 ease-out filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.12)]"
                          />
                        </div>
                      </Link>

                      {/* Brand / Category Micro Tag */}
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A5E12] font-semibold mb-1 h-4 truncate">
                        {p.brand || 'Enterprise Hardware'}
                      </div>

                      {/* Product Title */}
                      <Link to={`/products/${p.slug}`} className="hover:text-[#B8860B] transition block">
                        <h3 className="text-[14px] sm:text-[15px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#B8860B] transition-colors leading-snug line-clamp-2 min-h-[44px]">
                          {p.title}
                        </h3>
                      </Link>

                      {/* Spec Summary */}
                      <p className="text-[11px] text-[#5A6B63] font-mono mt-1 leading-normal line-clamp-1 h-5">
                        {getProductSpecSummary(p)}
                      </p>
                    </div>

                    {/* Context-Aware Bottom Section (Strictly Equalized Heights Across All Cards) */}
                    <div className="pt-3.5 mt-3 border-t border-[#D4A24C]/20 space-y-3">
                      {availableFor === 'rent' || p.available_for === 'rent' ? (
                        /* DEDICATED RENTAL CARD */
                        <>
                          <div className="min-h-[46px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">
                                Monthly Fleet Lease
                              </span>
                              <span className="text-base sm:text-lg font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.rental_price_monthly || 0).toLocaleString('en-IN')}
                                <span className="text-xs font-normal text-[#5A6B63] font-sans">/mo</span>
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                              24h Swap SLA
                            </span>
                          </div>

                          <button
                            onClick={() => addToRentalCart(p, 1, '6_months')}
                            className="h-10 w-full rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                          >
                            <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" />
                            <span>Rent Fleet (Add to Cart)</span>
                          </button>
                        </>
                      ) : availableFor === 'sale' || p.available_for === 'sale' ? (
                        /* DEDICATED BUY CARD */
                        <>
                          <div className="min-h-[46px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5A6B63] block">
                                Direct Purchase Price
                              </span>
                              <span className="text-base sm:text-lg font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.sale_price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#8A5E12] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4A24C]/30 whitespace-nowrap">
                              100% Tax Invoiced
                            </span>
                          </div>

                          <button
                            onClick={() => addToBuyCart(p, 1)}
                            className="h-10 w-full rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-[#D4A24C]" />
                            <span>Add to Cart (Buy)</span>
                          </button>
                        </>
                      ) : (
                        /* BALANCED ALL ITEMS VIEW (Available for Both) */
                        <>
                          <div className="min-h-[46px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5A6B63] block">
                                Purchase Price
                              </span>
                              <span className="text-base sm:text-lg font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.sale_price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            {p.rental_price_monthly > 0 ? (
                              <span className="text-[11px] font-bold text-[#8A5E12] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#D4A24C]/35 whitespace-nowrap">
                                or ₹{p.rental_price_monthly.toLocaleString('en-IN')}/mo
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-[#8A5E12] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4A24C]/30 whitespace-nowrap">
                                Enterprise Fleet
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 h-10">
                            <button
                              onClick={() => addToRentalCart(p, 1, '6_months')}
                              className="h-10 w-full py-2 px-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3ECE1] text-[#8A5E12] text-xs font-bold uppercase tracking-wider transition border border-[#D4A24C]/40 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                              title="Add to Rental Fleet Cart"
                            >
                              <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" />
                              <span>Rent</span>
                            </button>
                            <button
                              onClick={() => addToBuyCart(p, 1)}
                              className="h-10 w-full py-2 px-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm border border-[#D4A24C]/40 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              title="Add to Direct Purchase Cart"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-[#D4A24C]" />
                              <span>Buy</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#0D3B2A] px-3 font-serif">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition cursor-pointer"
                aria-label="Next Page"
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
