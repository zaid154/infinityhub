import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';

const formatCondition = (cond) => {
  if (!cond) return 'Grade A+';
  if (cond === 'grade_a_plus') return 'Grade A+';
  if (cond === 'grade_a') return 'Grade A';
  if (cond === 'grade_b') return 'Grade B';
  if (cond === 'brand_new') return 'Brand New';
  if (cond === 'open_box') return 'Open Box';
  return cond.replace(/_/g, ' ');
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    const params = { limit: 50 };
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (search.trim()) params.search = search.trim();

    api.get('/products', { params })
      .then((res) => {
        if (isMounted && res.data?.success) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.error('[Admin fetch products error]', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data?.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — HARDWARE ASSET CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Hardware Catalog Management
          </h1>
          <p className="text-xs text-[#5A6B63] mt-1">Manage laptops, monitors, RAM, GPUs, condition grades, and lease pricing.</p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5 transition border border-[#D4A24C]/40"
        >
          <Plus className="w-4 h-4 text-[#D4A24C]" />
          <span>Add New Hardware</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#D4A24C]/25 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8A5E12] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-bold text-[#8A5E12] uppercase tracking-wider text-[11px]">Category:</label>
          <ThemeSelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'laptop', label: 'Laptops' },
              { value: 'desktop', label: 'Desktops' },
              { value: 'monitor', label: 'Monitors' },
              { value: 'ram', label: 'RAM' },
              { value: 'gpu', label: 'GPU' },
              { value: 'cpu', label: 'CPU' },
              { value: 'other', label: 'Other' }
            ]}
            variant="admin"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No hardware found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold min-w-[260px]">Item</th>
                  <th className="py-3.5 px-4 font-bold min-w-[90px] whitespace-nowrap">Category</th>
                  <th className="py-3.5 px-4 font-bold min-w-[110px] whitespace-nowrap">Condition</th>
                  <th className="py-3.5 px-4 font-bold min-w-[130px] whitespace-nowrap">Sale / Rent Price</th>
                  <th className="py-3.5 px-4 font-bold min-w-[110px] whitespace-nowrap">Stock</th>
                  <th className="py-3.5 px-4 font-bold min-w-[65px] whitespace-nowrap">GST</th>
                  <th className="py-3.5 px-4 font-bold min-w-[100px] text-right whitespace-nowrap sticky right-0 bg-slate-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 p-1 flex items-center justify-center shrink-0 border border-slate-200">
                          <img
                            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{p.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{p.brand} {p.model}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-700 whitespace-nowrap">{p.category}</td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${
                        p.condition === 'brand_new'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : p.condition === 'grade_a_plus' || p.condition === 'grade_a'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : p.condition === 'open_box'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {formatCondition(p.condition)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      {p.available_for !== 'rent' && (
                        <span className="font-bold text-slate-900 block whitespace-nowrap">₹{Number(p.sale_price || 0).toLocaleString('en-IN')}</span>
                      )}
                      {p.available_for !== 'sale' && p.rental_price_monthly > 0 && (
                        <span className="text-[10px] text-[#0D3B2A] font-semibold block whitespace-nowrap">Rent: ₹{Number(p.rental_price_monthly || 0).toLocaleString('en-IN')}/mo</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                      {p.available_for === 'both' ? (
                        <div className="space-y-0.5 whitespace-nowrap">
                          <span className="text-slate-800 font-bold block whitespace-nowrap">Sale: {p.sale_stock !== undefined ? p.sale_stock : p.stock_quantity}</span>
                          <span className="text-[#8A5E12] font-semibold block whitespace-nowrap">Fleet: {p.rental_stock || 0}</span>
                        </div>
                      ) : p.available_for === 'rent' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-[#8A5E12] border border-[#D4A24C]/30 font-bold whitespace-nowrap">
                          Fleet: {p.rental_stock || 0}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-bold whitespace-nowrap">
                          Sale: {p.sale_stock !== undefined ? p.sale_stock : p.stock_quantity}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 whitespace-nowrap">{p.gst_rate}%</td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 transition shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D3B2A] hover:bg-slate-100 transition"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4 text-[#D4A24C]" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D3B2A] hover:bg-slate-100 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
