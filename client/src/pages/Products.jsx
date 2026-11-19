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
  Repeat,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { getSafeImageUrl } from '../utils/imageHelper';
import ThemeSelect from '../components/ThemeSelect';

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
          limit: 12,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header & Search Bar (Compact Height) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#D4A24C]/20">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#D4A24C] font-semibold block">
            — VERIFIED COMMERCIAL INVENTORY
          </span>
          <h1 className="text-xl sm:text-2xl font-serif text-[#0D3B2A] font-normal tracking-tight">
            Commercial Hardware Catalog
          </h1>
          <p className="text-xs text-[#5A6B63] mt-0.5">
            Showing {total} enterprise tested machines & components available for dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, specs, GPU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D4A24C]/30 rounded-full text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] transition shadow-xs"
            />
          </div>

          <ThemeSelect
            value={sort}
            onChange={(val) => setSort(val)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'featured', label: 'Featured First' }
            ]}
            variant="pill"
            align="right"
          />

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-1.5 bg-white border border-[#D4A24C]/30 rounded-lg text-[#0D3B2A] hover:bg-[#FAF7F2]"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl p-5 overflow-y-auto'
              : 'hidden'
          } md:relative md:inset-auto md:z-auto md:w-auto md:block md:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#D4A24C]/25 shadow-xs space-y-5 text-xs md:sticky md:top-20 self-start`}
        >
          <div className="flex items-center justify-between font-bold text-[#0D3B2A] border-b border-[#D4A24C]/15 pb-2.5">
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
          <div className="space-y-1.5">
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
                  className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between cursor-pointer ${
                    category === c.id
                      ? 'bg-[#0D3B2A] text-white shadow-xs'
                      : 'text-[#5A6B63] hover:bg-[#FAF7F2] hover:text-[#0D3B2A]'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Segmented Control */}
          <div className="space-y-1.5 pt-2 border-t border-[#D4A24C]/15">
            <label className="font-bold text-[#0D3B2A] block uppercase font-mono tracking-wider text-[10px]">
              Procurement Model
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'sale', label: 'Buy Only' },
                { id: 'rent', label: 'Rent Fleet' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAvailableFor(opt.id);
                    setPage(1);
                  }}
                  className={`py-1.5 px-1 rounded-lg font-semibold transition text-center text-[10px] uppercase tracking-wider cursor-pointer ${
                    availableFor === opt.id
                      ? 'bg-[#0D3B2A] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5A6B63] hover:bg-[#F3E8D2] hover:text-[#0D3B2A] border border-[#D4A24C]/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition / Grade Filter */}
          <div className="space-y-1.5 pt-2 border-t border-[#D4A24C]/15">
            <label className="font-bold text-[#0D3B2A] block uppercase font-mono tracking-wider text-[10px]">
              Condition Grade
            </label>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'brand_new', label: '★ Brand New (Sealed)' },
                { id: 'grade_a_plus', label: 'Grade A+ Pristine' },
                { id: 'grade_a', label: 'Grade A Corporate' },
                { id: 'grade_b', label: 'Grade B Budget' }
              ].map((cond) => (
                <label
                  key={cond.id}
                  className="flex items-center gap-2 text-[#5A6B63] cursor-pointer hover:text-[#0D3B2A] py-0.5 text-[11px]"
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

        {/* Right Products Grid (Dedicated Archetypes & Ultra-Compact Sizing) */}
        <div className="md:col-span-9 space-y-5">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-[#D4A24C]/20 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#D4A24C]/25 p-8 space-y-3">
              <p className="text-sm font-bold text-[#0D3B2A] font-serif">No hardware found matching your criteria.</p>
              <p className="text-xs text-[#5A6B63]">Try clearing filters or search terms.</p>
              <button
                onClick={() => {
                  setCategory('all');
                  setCondition('all');
                  setAvailableFor('all');
                  setSearch('');
                }}
                className="px-5 py-2 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
              {products.map((p) => {
                const isRental = p.available_for === 'rent';
                const isBrandNew = p.condition === 'brand_new';
                const stockQty = isRental
                  ? (typeof p.rental_stock === 'number' ? p.rental_stock : p.stock_quantity || 0)
                  : (typeof p.sale_stock === 'number' ? p.sale_stock : p.stock_quantity || 0);

                const inStock = stockQty > 0;

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#D4A24C]/25 hover:border-[#D4A24C] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full"
                  >
                    <div>
                      {/* Top Row: Brand or Condition (Left) & Real Accurate Stock (Right) */}
                      <div className="flex items-center justify-between gap-1 mb-2 h-5 text-[10px] font-mono">
                        {isBrandNew ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-300 shadow-xs whitespace-nowrap">
                            ★ Brand New Sealed
                          </span>
                        ) : (
                          <span className="font-semibold text-[#8A5E12] uppercase tracking-wider truncate max-w-[120px]">
                            {p.brand || 'ENTERPRISE'}
                          </span>
                        )}

                        {/* Real dynamic stock: completely distinct between Fleet vs Stock */}
                        <div
                          className={`flex items-center gap-1 font-medium shrink-0 ${
                            inStock ? 'text-emerald-800' : 'text-[#8A5E12]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inStock ? 'bg-emerald-600 animate-pulse' : 'bg-[#D4A24C]'
                            }`}
                          />
                          <span className="whitespace-nowrap font-semibold">
                            {isRental
                              ? inStock ? `${stockQty} in fleet` : 'Fleet Reserved'
                              : inStock ? `${stockQty} in stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Image Pedestal Stage Container (Compact h-36 sm:h-38) */}
                      <Link to={`/products/${p.slug}`} className="block">
                        <div className="h-36 sm:h-38 rounded-xl bg-gradient-to-b from-[#FAF7F2] via-[#F6F0E7] to-[#EFE7DC] flex items-center justify-center p-3 mb-2.5 overflow-hidden border border-[#D4A24C]/20 cursor-pointer group-hover:border-[#D4A24C]/60 transition-all duration-300 relative">
                          {/* Distinct Deployment Badge (Never Buy & Lease Crammed Together) */}
                          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
                            {isRental ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap bg-[#0D3B2A] text-[#FAF7F2] border border-[#D4A24C]/40 shadow-xs">
                                Corporate Lease
                              </span>
                            ) : isBrandNew ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap bg-white/95 text-amber-900 border border-amber-400 shadow-xs">
                                Factory Sealed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap bg-white/95 text-[#0D3B2A] border border-[#D4A24C]/40 shadow-xs">
                                Direct Purchase
                              </span>
                            )}
                          </div>

                          {/* Pedestal surface shadow */}
                          <div className="absolute bottom-1.5 w-24 h-2.5 bg-black/10 rounded-full blur-xs pointer-events-none" />

                          <img
                            src={getSafeImageUrl(p)}
                            alt={p.title}
                            className="relative z-10 max-h-28 sm:max-h-30 max-w-[82%] object-contain group-hover:scale-105 transition-transform duration-300 ease-out filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)]"
                          />
                        </div>
                      </Link>

                      {/* Product Title (Compact 2-line clamp) */}
                      <Link to={`/products/${p.slug}`} className="hover:text-[#B8860B] transition block">
                        <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#B8860B] transition-colors leading-snug line-clamp-2 min-h-[36px]">
                          {p.title}
                        </h3>
                      </Link>

                      {/* Spec Summary (Compact 1-line clamp) */}
                      <p className="text-[10px] text-[#5A6B63] font-mono mt-0.5 leading-normal line-clamp-1 h-4">
                        {getProductSpecSummary(p)}
                      </p>
                    </div>

                    {/* Dedicated Single-Price & Single-Action Section (Zero Dual Buttons!) */}
                    <div className="pt-2 mt-2 border-t border-[#D4A24C]/20 space-y-2">
                      {isRental ? (
                        /* ARCHETYPE 1: CORPORATE RENTAL FLEET CARD */
                        <>
                          <div className="min-h-[38px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#8A5E12] block">
                                Monthly Fleet Lease
                              </span>
                              <span className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.rental_price_monthly || 0).toLocaleString('en-IN')}
                                <span className="text-[11px] font-normal text-[#5A6B63] font-sans">/mo</span>
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                              24h Swap SLA
                            </span>
                          </div>

                          {inStock ? (
                            <button
                              onClick={() => addToRentalCart(p, 1, '6_months')}
                              className="h-9 w-full rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                            >
                              <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" />
                              <span>Rent Fleet (Add to Cart)</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="h-9 w-full rounded-full bg-stone-100 text-[#8A5E12] text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-[#D4A24C]/30 flex items-center justify-center gap-1.5"
                            >
                              <span>Fleet Reserved</span>
                            </button>
                          )}
                        </>
                      ) : isBrandNew ? (
                        /* ARCHETYPE 2: BRAND NEW FACTORY SEALED CARD */
                        <>
                          <div className="min-h-[38px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#8A5E12] block">
                                Brand New Sealed Price
                              </span>
                              <span className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.sale_price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold text-[#8A5E12] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#D4A24C]/30 whitespace-nowrap">
                              Official Warranty
                            </span>
                          </div>

                          {inStock ? (
                            <button
                              onClick={() => addToBuyCart(p, 1)}
                              className="h-9 w-full rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-[#D4A24C]" />
                              <span>Add to Cart (Buy)</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="h-9 w-full rounded-full bg-stone-100 text-stone-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-stone-200 flex items-center justify-center gap-1.5"
                            >
                              <span>Out of Stock</span>
                            </button>
                          )}
                        </>
                      ) : (
                        /* ARCHETYPE 3: CERTIFIED REFURBISHED DIRECT PURCHASE CARD */
                        <>
                          <div className="min-h-[38px] flex items-baseline justify-between">
                            <div>
                              <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#5A6B63] block">
                                Direct Purchase Price
                              </span>
                              <span className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif">
                                ₹{(p.sale_price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold text-[#5A6B63] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#D4A24C]/25 whitespace-nowrap">
                              Tested & Certified
                            </span>
                          </div>

                          {inStock ? (
                            <button
                              onClick={() => addToBuyCart(p, 1)}
                              className="h-9 w-full rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-[#D4A24C]" />
                              <span>Add to Cart (Buy)</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="h-9 w-full rounded-full bg-stone-100 text-stone-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-stone-200 flex items-center justify-center gap-1.5"
                            >
                              <span>Out of Stock</span>
                            </button>
                          )}
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
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition cursor-pointer"
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
                className="p-1.5 rounded-lg border border-[#D4A24C]/30 disabled:opacity-40 hover:bg-[#FAF7F2] text-[#0D3B2A] transition cursor-pointer"
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
