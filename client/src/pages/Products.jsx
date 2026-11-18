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
    const url = p.images?.[0]?.url;
    if (!url || url.includes('photo-1544717305-2782549b5136') || p.slug?.includes('hp-elitebook')) {
      return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80';
    }
    return url;
  };

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [condition, setCondition] = useState('all');
  const [availableFor, setAvailableFor] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Commercial Hardware Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {total} enterprise tested machines & components available for dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, specs, GPU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition shadow-sm"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="featured">Featured First</option>
          </select>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:text-blue-600"
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
          } md:block md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs`}
        >
          <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-600" />
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
              className="text-[11px] text-blue-600 hover:underline font-normal"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block uppercase font-mono tracking-wider text-[10px]">
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
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition flex items-center justify-between ${
                    category === c.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-700 block uppercase font-mono tracking-wider text-[10px]">
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
                  className={`py-1.5 rounded-lg font-semibold capitalize transition ${
                    availableFor === opt
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Condition / Grade */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-700 block uppercase font-mono tracking-wider text-[10px]">
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
                  className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-blue-600"
                >
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === cond.id}
                    onChange={() => {
                      setCondition(cond.id);
                      setPage(1);
                    }}
                    className="accent-blue-600"
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
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <p className="text-sm font-bold text-slate-700">No hardware found matching your criteria.</p>
              <p className="text-xs text-slate-500">Try clearing filters or search terms.</p>
              <button
                onClick={() => {
                  setCategory('all');
                  setCondition('all');
                  setAvailableFor('all');
                  setSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {p.condition.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        Stock: {p.stock_quantity}
                      </span>
                    </div>

                    <div className="h-44 rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-4 overflow-hidden border border-slate-100">
                      <img
                        src={getProductImage(p)}
                        alt={p.title}
                        className="h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <Link to={`/products/${p.slug}`} className="hover:text-blue-600 transition">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1 font-heading">{p.title}</h3>
                    </Link>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 min-h-[32px] font-mono text-[11px]">
                      {getProductSpecSummary(p)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Pricing
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          ₹{p.sale_price.toLocaleString('en-IN')}{' '}
                          {p.rental_price_monthly > 0 && (
                            <span className="text-xs text-slate-500 font-normal">
                              or ₹{p.rental_price_monthly.toLocaleString('en-IN')}/mo
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => openRFQ(`${p.title} (${p.stock_quantity} in stock)`)}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
                      >
                        Inquire Bulk
                      </button>

                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                        title="Add to Quotation Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
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
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition"
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
