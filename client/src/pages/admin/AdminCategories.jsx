import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Package,
  Laptop,
  Monitor,
  Cpu,
  Zap,
  Box,
  HardDrive,
  Server,
  Tv,
  Tag
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';

const AVAILABLE_ICONS = [
  { value: 'laptop', label: 'Laptop (Notebooks)', icon: Laptop },
  { value: 'monitor', label: 'Monitor (Displays)', icon: Monitor },
  { value: 'server', label: 'Server (Enterprise)', icon: Server },
  { value: 'cpu', label: 'CPU (Processors / RAM)', icon: Cpu },
  { value: 'zap', label: 'GPU (Graphics Cards)', icon: Zap },
  { value: 'hard-drive', label: 'Storage (SSD / HDD)', icon: HardDrive },
  { value: 'tv', label: 'Large Screen / TV', icon: Tv },
  { value: 'layers', label: 'Layers (Components)', icon: Layers },
  { value: 'box', label: 'Box (Peripherals / Other)', icon: Box }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    default_gst_rate: 18,
    hsn_sac: '',
    icon: 'laptop',
    sort_order: 1,
    description: ''
  });

  // Fetch Categories
  const fetchCategories = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('[Admin Categories Error]', err);
      toast.error('Failed to load hardware categories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.get('/categories')
      .then((res) => {
        if (isMounted && res.data?.success) {
          setCategories(res.data.categories || []);
        }
      })
      .catch((err) => {
        console.error('[Admin Categories Error]', err);
        toast.error('Failed to load hardware categories');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      default_gst_rate: 18,
      hsn_sac: '',
      icon: 'laptop',
      sort_order: categories.length + 1,
      description: ''
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      default_gst_rate: cat.default_gst_rate || 18,
      hsn_sac: cat.hsn_sac || '',
      icon: cat.icon || 'laptop',
      sort_order: cat.sort_order || 1,
      description: cat.description || ''
    });
    setModalOpen(true);
  };

  // Auto-generate slug when name changes in Create mode
  const handleNameChange = (nameVal) => {
    if (!editingCategory) {
      const generatedSlug = nameVal
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({
        ...prev,
        name: nameVal,
        slug: generatedSlug
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: nameVal }));
    }
  };

  // Handle Save (Create or Update)
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please provide a category name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update
        const res = await api.put(`/categories/${editingCategory._id}`, formData);
        if (res.data.success) {
          toast.success(`Category "${formData.name}" updated successfully!`);
          setModalOpen(false);
          fetchCategories();
        }
      } else {
        // Create
        const res = await api.post('/categories', formData);
        if (res.data.success) {
          toast.success(`Category "${formData.name}" created successfully!`);
          setModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      console.error('[Save Category Error]', err);
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await api.delete(`/categories/${categoryToDelete._id}`);
      if (res.data.success) {
        toast.success(`Category "${categoryToDelete.name}" deleted.`);
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (err) {
      console.error('[Delete Category Error]', err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Icon Helper
  const getCategoryIconComponent = (iconName) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop className="w-4 h-4 text-[#0D3B2A]" />;
      case 'monitor':
        return <Monitor className="w-4 h-4 text-[#0D3B2A]" />;
      case 'server':
        return <Server className="w-4 h-4 text-[#0D3B2A]" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#0D3B2A]" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-[#0D3B2A]" />;
      case 'hard-drive':
        return <HardDrive className="w-4 h-4 text-[#0D3B2A]" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-[#0D3B2A]" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-[#0D3B2A]" />;
      default:
        return <Box className="w-4 h-4 text-[#0D3B2A]" />;
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = categories.length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.product_count || 0), 0);
    const standardGstCount = categories.filter((c) => c.default_gst_rate === 18).length;
    return { total, totalProducts, standardGstCount };
  }, [categories]);

  // Filtered List
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q) ||
        (c.hsn_sac || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  return (
    <div className="space-y-6 text-xs pb-16">
      
      {/* ======================================================== */}
      {/* 1. HEADER & ADD CATEGORY ACTION                          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — PRODUCT CATALOG ARCHITECTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Hardware Categories & Tax Slabs
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Create and organize catalog categories, default HSN/SAC codes, applicable GST rates, and storefront navigation sequence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => fetchCategories(true)}
            disabled={refreshing}
            className="p-2.5 bg-white border border-slate-200 hover:border-[#0D3B2A] rounded-xl text-slate-700 hover:text-[#0D3B2A] transition shadow-2xs cursor-pointer"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-4 h-4 text-[#D4A24C] ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] font-bold text-xs rounded-xl shadow border border-[#D4A24C]/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4A24C]" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL KPI SUMMARY CARDS                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Categories */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Catalog Categories
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-serif">{stats.total}</span>
              <span className="text-[11px] text-slate-400 font-medium">Active Slabs</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shrink-0">
            <Layers className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Categorized Inventory
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0D3B2A] font-serif">{stats.totalProducts}</span>
              <span className="text-[11px] text-slate-500 font-medium">Products Live</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* GST Tax Standard */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Standard GST Compliance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-700 font-serif">18% GST</span>
              <span className="text-[11px] text-slate-400 font-medium">Default Slab</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONTROL BAR: SEARCH & FILTER                          */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category name, slug, HSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Showing <strong className="text-slate-900">{filteredCategories.length}</strong> categories
        </span>
      </div>

      {/* ======================================================== */}
      {/* 4. STRUCTURED CATEGORIES TABLE                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D4A24C]" />
            <span>Loading product categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="font-bold text-sm text-[#0D3B2A]">No hardware categories found.</p>
            <p className="text-xs text-slate-400">Click "Add New Category" above to create your first product category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[#0D3B2A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold min-w-[220px]">Category Name</th>
                  <th className="py-3 px-4 font-bold min-w-[140px]">Slug / Filter Key</th>
                  <th className="py-3 px-4 font-bold min-w-[120px]">HSN / SAC Code</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[120px]">Default GST Rate</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[110px]">Live Products</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[90px]">Seq Order</th>
                  <th className="py-3 px-4 font-bold text-right min-w-[110px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/70 transition group">
                    
                    {/* Column 1: Category & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center shrink-0 shadow-2xs">
                          {getCategoryIconComponent(cat.icon)}
                        </div>
                        <div className="min-w-0">
                          <strong className="text-slate-900 block font-bold text-xs truncate max-w-[220px]">
                            {cat.name}
                          </strong>
                          {cat.description ? (
                            <span className="text-[10.5px] text-slate-500 block truncate max-w-[220px]">
                              {cat.description}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono block">
                              Catalog Hardware Class
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Slug */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-semibold">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Column 3: HSN Code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 text-xs">
                        {cat.hsn_sac || '8471 30 00'}
                      </span>
                    </td>

                    {/* Column 4: GST Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                        {cat.default_gst_rate}% GST
                      </span>
                    </td>

                    {/* Column 5: Live Products */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#8A5E12] font-mono font-bold text-xs">
                        {cat.product_count || 0} Units
                      </span>
                    </td>

                    {/* Column 6: Sort Order */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-slate-500 font-semibold text-xs">
                        #{cat.sort_order || 0}
                      </span>
                    </td>

                    {/* Column 7: Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-xl border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ======================================================== */}
      {/* 5. ADD / EDIT CATEGORY MODAL                             */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-[calc(100vw-1.5rem)] sm:w-full p-5 sm:p-7 shadow-2xl space-y-4 border border-slate-200 max-h-[90dvh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-[#8A5E12]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                    {editingCategory ? 'Edit Hardware Category' : 'Create New Category'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingCategory ? `Update category details for ${editingCategory.name}` : 'Add a new product classification to catalog'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitCategory} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Category Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Workstation Graphics Cards"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-semibold text-slate-900"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug / URL Key *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. workstation-gpus"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used in storefront URL filters</span>
                </div>

                {/* Icon Select */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Icon</label>
                  <ThemeSelect
                    value={formData.icon}
                    onChange={(val) => setFormData({ ...formData, icon: val })}
                    options={AVAILABLE_ICONS}
                    variant="admin"
                  />
                </div>

                {/* HSN Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Indian HSN / SAC Code</label>
                  <input
                    type="text"
                    value={formData.hsn_sac}
                    onChange={(e) => setFormData({ ...formData, hsn_sac: e.target.value })}
                    placeholder="e.g. 8473 30 99"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                  />
                </div>

                {/* Default GST Rate */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applicable GST Rate (%)</label>
                  <ThemeSelect
                    value={formData.default_gst_rate}
                    onChange={(val) => setFormData({ ...formData, default_gst_rate: Number(val) })}
                    options={[
                      { value: 0, label: '0% (Exempt)' },
                      { value: 5, label: '5% (E-Waste / Concessional)' },
                      { value: 12, label: '12% (Telecom / Components)' },
                      { value: 18, label: '18% (Standard Hardware)' },
                      { value: 28, label: '28% (Special Displays)' }
                    ]}
                    variant="admin"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Storefront Sort Sequence</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Category Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. High-performance enterprise GPU compute cards for AI training and CAD..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] font-bold shadow border border-[#D4A24C]/40 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4A24C]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A24C]" />
                      <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. DELETE CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      {deleteConfirmOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">Delete Category</h3>
                <p className="text-xs text-slate-500">Are you sure you want to delete this category?</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block">{categoryToDelete.name}</strong>
              <span className="text-slate-500 font-mono text-[11px]">slug: {categoryToDelete.slug}</span>
              {categoryToDelete.product_count > 0 && (
                <div className="mt-2 text-rose-700 font-bold text-[11px] bg-rose-50 p-2 rounded-lg border border-rose-200">
                  Warning: {categoryToDelete.product_count} active products are assigned to this category.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setCategoryToDelete(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
