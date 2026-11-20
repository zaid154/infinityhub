import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Save,
  Trash2,
  Package,
  Layers,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Film,
  Plus,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';
import { isVideoUrl } from '../../utils/imageHelper';
import { SPEC_PRESETS, PRESET_OPTIONS, formatSpecLabel } from '../../constants/productPresets';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramTitle = searchParams.get('title') || '';
  const paramBrand = searchParams.get('brand') || '';
  const paramModel = searchParams.get('model') || '';
  const paramCategory = searchParams.get('category') || 'laptop';

  const [formData, setFormData] = useState({
    title: paramTitle,
    brand: paramBrand,
    model: paramModel || paramTitle,
    category: paramCategory,
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: '',
    rental_price_monthly: '',
    stock_quantity: 1,
    sale_stock: 1,
    rental_stock: 0,
    gst_rate: 18,
    description: '',
    specs: {
      processor: '',
      ram: '',
      storage: '',
      screen_size: '',
      gpu_model: '',
      generation: '',
      operating_system: 'Windows 11 Pro'
    },
    images: [],
    media_layout: 'standard',
    is_featured: false,
    is_hot_deal: false,
    is_active: true
  });

  const createPresetRows = (categoryKey) => {
    const preset = SPEC_PRESETS[categoryKey] || SPEC_PRESETS.laptop;
    return preset.map((item, index) => ({
      id: `preset-${categoryKey}-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      key: item.key,
      label: item.label,
      value: item.value || '',
      placeholder: item.placeholder || ''
    }));
  };

  const [specRows, setSpecRows] = useState(() => createPresetRows('laptop'));
  const [activeSpecPreset, setActiveSpecPreset] = useState('laptop');

  const [uploadingImages, setUploadingImages] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [dbCategories, setDbCategories] = useState([
    { value: 'laptop', label: 'Corporate Laptops' },
    { value: 'desktop', label: 'Commercial Desktops' },
    { value: 'monitor', label: 'Business Monitors' },
    { value: 'charger', label: 'Power Adapters & Chargers' },
    { value: 'ram', label: 'RAM Modules' },
    { value: 'gpu', label: 'Workstation GPUs' },
    { value: 'cpu', label: 'CPUs & Processors' },
    { value: 'other', label: 'Accessories & Other' }
  ]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.categories?.length > 0) {
          setDbCategories(
            res.data.categories.map((c) => ({
              value: c.slug,
              label: c.name
            }))
          );
        }
      } catch (err) {
        console.error('[AdminProductForm] Categories load error:', err);
      }
    };
    fetchCats();
  }, []);

  // Manual URL input state
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState('image');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await api.get('/products');
          if (res.data.success) {
            const found = res.data.products.find((p) => p._id === id);
            if (found) {
              setFormData({
                title: found.title,
                brand: found.brand,
                model: found.model || '',
                category: found.category,
                condition: found.condition,
                available_for: found.available_for,
                sale_price: found.sale_price,
                rental_price_monthly: found.rental_price_monthly || '',
                stock_quantity: found.stock_quantity,
                sale_stock: found.sale_stock !== undefined ? found.sale_stock : (found.available_for === 'rent' ? 0 : found.stock_quantity),
                rental_stock: found.rental_stock !== undefined ? found.rental_stock : (found.available_for === 'sale' ? 0 : 0),
                gst_rate: found.gst_rate || 18,
                description: found.description || '',
                specs: found.specs || {},
                images: (found.images || []).map((img) => ({
                  url: typeof img === 'string' ? img : img.url,
                  public_id: img.public_id || '',
                  resource_type: img.resource_type || (isVideoUrl(typeof img === 'string' ? img : img.url) ? 'video' : 'image')
                })),
                media_layout: found.media_layout || 'standard',
                is_featured: Boolean(found.is_featured),
                is_hot_deal: Boolean(found.is_hot_deal),
                is_active: Boolean(found.is_active)
              });

              if (found.specs && Object.keys(found.specs).length > 0) {
                const loadedRows = Object.entries(found.specs).map(([k, v], idx) => ({
                  id: `spec-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  key: k,
                  label: formatSpecLabel(k),
                  value: typeof v === 'string' ? v : String(v || ''),
                  placeholder: ''
                }));
                setSpecRows(loadedRows);
                setActiveSpecPreset(found.category || 'laptop');
              } else {
                setSpecRows(createPresetRows(found.category || 'laptop'));
                setActiveSpecPreset(found.category || 'laptop');
              }
            }
          }
        } catch (err) {
          console.error('[Fetch Product For Edit Error]', err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  // Handle Multi-media (photos + videos) upload to Cloudinary
  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    setUploadingImages(true);
    try {
      const res = await api.post('/upload/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const uploadedMedia = (res.data.images || []).map((item) => {
          const isVid = item.resource_type === 'video' || isVideoUrl(item.url);
          return {
            url: item.url,
            public_id: item.public_id || '',
            resource_type: isVid ? 'video' : 'image'
          };
        });

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedMedia]
        }));
        toast.success(`${uploadedMedia.length} media file(s) (photo/video) uploaded to Cloudinary!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Media upload failed.');
    } finally {
      setUploadingImages(false);
      e.target.value = null;
    }
  };

  // Add media via direct URL
  const handleAddMediaUrl = (e) => {
    e.preventDefault();
    if (!mediaUrlInput.trim()) return;
    const url = mediaUrlInput.trim();
    const isVid = mediaTypeInput === 'video' || isVideoUrl(url);
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url,
          public_id: '',
          resource_type: isVid ? 'video' : 'image'
        }
      ]
    }));
    setMediaUrlInput('');
    toast.success(`${isVid ? 'Video' : 'Photo'} added to media gallery!`);
  };

  // Reorder media: Move Left (-1) or Move Right (+1)
  const handleMoveMedia = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.images.length) return;
    const newImages = [...formData.images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Set as Cover / Primary media (position 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setFormData((prev) => ({ ...prev, images: newImages }));
    toast.success('Set as primary cover media!');
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Convert specRows to clean dictionary object { key: value }
  const getSerializedSpecs = () => {
    const serialized = {};
    specRows.forEach((row) => {
      const rawKey = row.key || row.label || '';
      const cleanKey = rawKey
        .trim()
        .toLowerCase()
        .replace(/[\s/-]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      if (cleanKey && row.value && typeof row.value === 'string' && row.value.trim()) {
        serialized[cleanKey] = row.value.trim();
      }
    });
    return serialized;
  };

  // Handle category change: auto-switches template if admin has not typed custom values
  const handleCategoryChange = (newCat) => {
    setFormData((prev) => ({ ...prev, category: newCat }));

    const hasValues = specRows.some(
      (r) => r.value && r.value.trim().length > 0 && r.value !== 'Windows 11 Pro'
    );
    if (!hasValues) {
      if (SPEC_PRESETS[newCat]) {
        setSpecRows(createPresetRows(newCat));
        setActiveSpecPreset(newCat);
      }
    }
  };

  // Preset template click handler
  const handleSelectPreset = (presetKey) => {
    const hasValues = specRows.some(
      (r) => r.value && r.value.trim().length > 0 && r.value !== 'Windows 11 Pro'
    );
    if (hasValues) {
      if (!window.confirm(`Switching to '${presetKey.toUpperCase()}' template will replace current fields. Continue?`)) {
        return;
      }
    }
    setSpecRows(createPresetRows(presetKey));
    setActiveSpecPreset(presetKey);
  };

  // Add custom specification field row
  const handleAddCustomSpec = () => {
    setSpecRows((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        key: '',
        label: '',
        value: '',
        placeholder: 'e.g. 52Wh Li-ion Battery / 65W PD / USB 3.2 Gen2',
        isCustom: true
      }
    ]);
  };

  // Delete specification field row
  const handleDeleteSpecRow = (idToRemove) => {
    setSpecRows((prev) => prev.filter((r) => r.id !== idToRemove));
  };

  // Update a specification row (label or value)
  const handleSpecChange = (idToUpdate, field, newValue) => {
    setSpecRows((prev) =>
      prev.map((r) => {
        if (r.id === idToUpdate) {
          return { ...r, [field]: newValue };
        }
        return r;
      })
    );
  };

  // Google Gemini AI Description Generator
  const handleGenerateAIDescription = async () => {
    if (!formData.title || !formData.brand) {
      toast.error('Please enter Title and Brand before generating with Gemini AI.');
      return;
    }

    const currentSpecs = getSerializedSpecs();

    setGeneratingAI(true);
    try {
      const res = await api.post('/ai/generate-description', {
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        condition: formData.condition,
        specs: currentSpecs
      });

      if (res.data.success) {
        setFormData((prev) => ({ ...prev, description: res.data.description }));
        toast.success('Description generated with Google Gemini!');
      }
    } catch {
      toast.error('Failed to generate description with Gemini.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      specs: getSerializedSpecs()
    };

    try {
      if (isEdit) {
        const res = await api.put(`/products/${id}`, payload);
        if (res.data.success) {
          toast.success('Product updated successfully!');
          navigate('/admin/products');
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          toast.success('Product created successfully!');
          navigate('/admin/products');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading product details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D3B2A] transition"
      >
        <ArrowLeft className="w-4 h-4 text-[#D4A24C]" />
        <span>Back to Products</span>
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isEdit ? 'Edit Hardware Item' : 'Add New Hardware Item'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Fill in specifications, upload photos to Cloudinary, and configure rental/sale rates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Basic Details Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#D4A24C]" />
            General Information
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lenovo ThinkPad T490 Core i5 16GB 512GB SSD"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lenovo, Dell, HP, NVIDIA, Samsung"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model</label>
              <input
                type="text"
                placeholder="e.g. ThinkPad T490"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="min-w-0">
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <ThemeSelect
                value={formData.category}
                onChange={(val) => handleCategoryChange(val)}
                options={dbCategories}
                variant="admin"
                fullWidth
              />
            </div>

            <div className="min-w-0">
              <label className="block font-semibold text-slate-700 mb-1">Condition Grade</label>
              <ThemeSelect
                value={formData.condition}
                onChange={(val) => setFormData({ ...formData, condition: val })}
                options={[
                  { value: 'brand_new', label: 'Brand New (Factory Sealed / Unused)' },
                  { value: 'open_box', label: 'Open Box (Surplus / Unused)' },
                  { value: 'grade_a_plus', label: 'Grade A+ Pristine (Corporate Refurbished)' },
                  { value: 'grade_a', label: 'Grade A Corporate' },
                  { value: 'grade_b', label: 'Grade B Budget' },
                  { value: 'for_parts', label: 'For Parts / Scrap' }
                ]}
                variant="admin"
                fullWidth
              />
            </div>

            <div className="min-w-0">
              <label className="block font-semibold text-slate-700 mb-1">Available For</label>
              <ThemeSelect
                value={formData.available_for}
                onChange={(val) => {
                  setFormData((prev) => {
                    let nextSaleStock = prev.sale_stock;
                    let nextRentalStock = prev.rental_stock;
                    let nextSalePrice = prev.sale_price;
                    let nextRentalPrice = prev.rental_price_monthly;

                    if (val === 'sale') {
                      nextRentalStock = 0;
                      nextRentalPrice = '';
                      if (nextSaleStock <= 0) nextSaleStock = 1;
                    } else if (val === 'rent') {
                      nextSaleStock = 0;
                      nextSalePrice = '';
                      if (nextRentalStock <= 0) nextRentalStock = 1;
                    }

                    return {
                      ...prev,
                      available_for: val,
                      sale_stock: nextSaleStock,
                      rental_stock: nextRentalStock,
                      sale_price: nextSalePrice,
                      rental_price_monthly: nextRentalPrice,
                      stock_quantity: nextSaleStock + nextRentalStock
                    };
                  });
                }}
                options={[
                  { value: 'both', label: 'Both Sale & Rent' },
                  { value: 'sale', label: 'Direct Sale Only' },
                  { value: 'rent', label: 'Rental Fleet Only' }
                ]}
                variant="admin"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock Box - Spacious Multi-Row Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D4A24C]" />
              Commercial Pricing & Segregated Inventory
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Set commercial purchase price, monthly lease fee, and segregated inventory stock pools.
            </p>
          </div>

          {/* Row 1: Commercial Pricing & GST */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`min-w-0 transition-opacity ${formData.available_for === 'rent' ? 'opacity-50' : ''}`}>
              <label className="block font-semibold text-slate-700 mb-1">
                Sale Price (₹) {formData.available_for !== 'rent' && '*'}
              </label>
              <input
                type="number"
                required={formData.available_for !== 'rent'}
                disabled={formData.available_for === 'rent'}
                placeholder={formData.available_for === 'rent' ? 'N/A (Rental Fleet Only)' : 'e.g. 21500'}
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.available_for === 'rent' ? 'Disabled for rental-only fleet' : 'Corporate direct purchase rate'}
              </span>
            </div>

            <div className={`min-w-0 transition-opacity ${formData.available_for === 'sale' ? 'opacity-50' : ''}`}>
              <label className="block font-semibold text-slate-700 mb-1">
                Rental / Month (₹) {formData.available_for === 'rent' && '*'}
              </label>
              <input
                type="number"
                required={formData.available_for === 'rent'}
                disabled={formData.available_for === 'sale'}
                placeholder={formData.available_for === 'sale' ? 'N/A (Direct Sale Only)' : 'e.g. 1450'}
                value={formData.rental_price_monthly}
                onChange={(e) => setFormData({ ...formData, rental_price_monthly: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.available_for === 'sale' ? 'Disabled for sale-only products' : 'Monthly OPEX lease fee'}
              </span>
            </div>

            <div className="min-w-0">
              <label className="block font-semibold text-slate-700 mb-1">Applicable GST</label>
              <ThemeSelect
                value={formData.gst_rate}
                onChange={(val) => setFormData({ ...formData, gst_rate: Number(val) })}
                options={[
                  { value: 0, label: '0% (Exempt)' },
                  { value: 5, label: '5% GST' },
                  { value: 12, label: '12% GST' },
                  { value: 18, label: '18% GST (Standard Hardware)' },
                  { value: 28, label: '28% GST (Luxury / Specialized)' }
                ]}
                variant="admin"
                fullWidth
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tax invoice line item</span>
            </div>
          </div>

          {/* Row 2: Segregated Inventory Stock Pools */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Dual-Pool Inventory Segregation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                formData.available_for === 'rent' ? 'bg-slate-100/70 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 text-xs">Direct Sale Stock</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    formData.available_for === 'rent'
                      ? 'text-slate-500 bg-slate-200 border-slate-300'
                      : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  }`}>
                    {formData.available_for === 'rent' ? 'Inactive (0)' : 'Purchase Pool'}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  disabled={formData.available_for === 'rent'}
                  placeholder="e.g. 10"
                  value={formData.sale_stock}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      sale_stock: val,
                      stock_quantity: val + (formData.rental_stock || 0)
                    });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500">
                  {formData.available_for === 'rent'
                    ? 'Unavailable for direct purchase (Rental only).'
                    : 'Decrements independently when customers place buy orders.'}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                formData.available_for === 'sale' ? 'bg-slate-100/70 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 text-xs">Rental Fleet Stock</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    formData.available_for === 'sale'
                      ? 'text-slate-500 bg-slate-200 border-slate-300'
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    {formData.available_for === 'sale' ? 'Inactive (0)' : 'Lease Pool'}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  disabled={formData.available_for === 'sale'}
                  placeholder="e.g. 3"
                  value={formData.rental_stock}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      rental_stock: val,
                      stock_quantity: (formData.sale_stock || 0) + val
                    });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500">
                  {formData.available_for === 'sale'
                    ? 'Unavailable for corporate leasing (Sale only).'
                    : 'Decrements independently when corporate rental agreements activate.'}
                </p>
              </div>
            </div>

            {/* Smart Inventory Notice when both are selected but one pool is 0 */}
            {formData.available_for === 'both' && (formData.rental_stock === 0 || formData.sale_stock === 0) && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <span className="font-bold text-amber-700">Notice:</span>
                <span>
                  {formData.rental_stock === 0 && formData.sale_stock > 0
                    ? "Available for 'Both', but Rental Stock is 0. Customers can only Buy this unit until units are allocated to the Lease Pool."
                    : formData.sale_stock === 0 && formData.rental_stock > 0
                    ? "Available for 'Both', but Direct Sale Stock is 0. Customers can only Rent this unit until units are allocated to the Purchase Pool."
                    : 'Both stock pools are currently 0. Product will show as Out of Stock.'}
                </span>
              </div>
            )}

            {/* Total Inventory Summary Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#D4A24C]" />
                Total Operational Inventory: <strong className="font-mono text-sm">{formData.stock_quantity || 0} Units</strong>
              </span>
              <span className="text-[10px] font-mono text-[#8A5E12]">
                (Direct Sale: {formData.sale_stock || 0} • Rental Fleet: {formData.rental_stock || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Technical Specs Box - Dynamic Category-Smart Specification Builder */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4A24C]" />
                Hardware Technical Specifications & Attributes
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dynamic category parameters for laptops, monitors, chargers, desktops, RAM, GPUs, or accessories.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF7F2] border border-[#D4A24C]/40 text-[#0D3B2A] font-mono">
                {specRows.length} Field{specRows.length === 1 ? '' : 's'} Active
              </span>
            </div>
          </div>

          {/* Quick-Preset Template Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
                Hardware Spec Presets:
              </span>
              <span className="text-[10px] text-slate-400">
                Click a preset to quickly load recommended parameters
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_OPTIONS.map((opt) => {
                const isActive = activeSpecPreset === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectPreset(opt.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#0D3B2A] text-[#FAF7F2] border border-[#0D3B2A] shadow-sm font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specification Rows Grid */}
          {specRows.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
              <p className="text-xs text-slate-500">No specifications defined for this product yet.</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset(formData.category || 'laptop')}
                  className="px-3 py-1.5 rounded-xl bg-[#0D3B2A] text-white text-xs font-bold cursor-pointer"
                >
                  Load {formData.category || 'Laptop'} Defaults
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomSpec}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  + Add Custom Field
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
              {specRows.map((row) => (
                <div
                  key={row.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2]/50 border border-slate-200/90 hover:border-[#D4A24C]/60 hover:bg-[#FAF7F2] transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={row.label}
                      placeholder="Spec Label (e.g. Wattage, Screen Size)"
                      onChange={(e) => handleSpecChange(row.id, 'label', e.target.value)}
                      className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0D3B2A] focus:outline-none px-1 py-0.5 rounded transition w-full"
                      title="Click to rename specification label"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecRow(row.id)}
                      title="Delete this specification field"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={row.placeholder || `Enter ${row.label || 'value'}...`}
                    value={row.value}
                    onChange={(e) => handleSpecChange(row.id, 'value', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] text-xs font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action Footer: Add Custom Field & Reset Template */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#0D3B2A] hover:bg-[#FAF7F2] text-xs font-bold text-[#0D3B2A] transition shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4A24C]" />
              <span>+ Add Custom Specification Field</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Reset specifications to default '${activeSpecPreset}' template? All custom edits will be reinitialized.`)) {
                    setSpecRows(createPresetRows(activeSpecPreset));
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0D3B2A] transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Template</span>
              </button>
              <span className="text-[10px] text-slate-400 font-sans">
                💡 Only filled fields appear publicly on the storefront
              </span>
            </div>
          </div>
        </div>

        {/* Media Showcase: Photos & Videos with Ordering and Alignment */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <Film className="w-4 h-4 text-[#D4A24C]" />
                Product Media Showcase (Photos & Demo Videos)
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload real hardware photos and video walk-throughs. Arrange sequence and set primary cover media.
              </p>
            </div>

            {/* Media Gallery Alignment Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
                Display Alignment:
              </span>
              <div className="w-52">
                <ThemeSelect
                  value={formData.media_layout || 'standard'}
                  onChange={(val) => setFormData({ ...formData, media_layout: val })}
                  options={[
                    { value: 'standard', label: 'Standard Gallery (Cover First)' },
                    { value: 'video_spotlight', label: 'Video Spotlight First' },
                    { value: 'split_showcase', label: 'Balanced Grid Showcase' }
                  ]}
                  variant="admin"
                />
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone (Photos & Videos) */}
          <div className="border-2 border-dashed border-[#D4A24C]/40 rounded-2xl p-6 text-center hover:border-[#0D3B2A] transition bg-[#FAF7F2] cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-1.5">
              {uploadingImages ? (
                <div className="flex items-center justify-center gap-2 text-[#0D3B2A] font-bold">
                  <Loader2 className="w-5 h-5 animate-spin text-[#D4A24C]" />
                  <span>Streaming photos & videos to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Upload className="w-6 h-6 text-emerald-600" />
                    <Film className="w-6 h-6 text-[#D4A24C]" />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Click or drag hardware photos & demonstration videos here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Images (JPEG, PNG, WebP) & Videos (MP4, WebM, MOV) up to 60MB supported
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quick Add Media by Direct URL */}
          <div className="pt-1">
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-xs font-semibold text-[#8A5E12] hover:text-[#0D3B2A] flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Media via Direct Image or Video URL</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add Media via External / CDN Link</span>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="e.g. https://res.cloudinary.com/.../demo.mp4 or photo.png"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] text-xs font-mono"
                  />
                  <select
                    value={mediaTypeInput}
                    onChange={(e) => setMediaTypeInput(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="image">Photo / Image</option>
                    <option value="video">Product Video (MP4/WebM)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    className="px-4 py-2 rounded-xl bg-[#0D3B2A] text-white font-bold text-xs hover:bg-[#153423] transition cursor-pointer shrink-0"
                  >
                    Add Media
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Uploaded Media Preview & Arrangement Toolbar */}
          {formData.images.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Arranged Media Gallery ({formData.images.length} items)
                </span>
                <span className="text-[10px] text-slate-500">
                  ★ Position #1 is the Primary Cover displayed first
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {formData.images.map((img, idx) => {
                  const isVid = img.resource_type === 'video' || isVideoUrl(img.url);
                  const isCover = idx === 0;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-2.5 bg-slate-50 border transition-all flex flex-col justify-between relative group ${
                        isCover
                          ? 'border-[#D4A24C] ring-2 ring-[#D4A24C]/25 bg-[#FAF7F2]'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Badges: Position & Media Type */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isCover
                              ? 'bg-[#0D3B2A] text-[#D4A24C] border border-[#D4A24C]'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isCover ? '★ #1 Cover' : `#${idx + 1}`}
                        </span>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${
                            isVid
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {isVid ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                          <span>{isVid ? 'Video' : 'Photo'}</span>
                        </span>
                      </div>

                      {/* Media Thumbnail Container */}
                      <div className="h-28 rounded-xl bg-white p-1.5 border border-slate-200/80 flex items-center justify-center overflow-hidden relative">
                        {isVid ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
                            <video
                              src={img.url}
                              className="w-full h-full object-cover opacity-85"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                              <div className="w-8 h-8 rounded-full bg-[#D4A24C] text-[#0D3B2A] flex items-center justify-center font-bold text-xs shadow-md">
                                ▶
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-contain filter drop-shadow-2xs"
                          />
                        )}
                      </div>

                      {/* Reordering & Action Toolbar */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveMedia(idx, -1)}
                            className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="Move Left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === formData.images.length - 1}
                            onClick={() => handleMoveMedia(idx, 1)}
                            className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="Move Right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="px-2 py-1 rounded-lg bg-white border border-[#D4A24C]/40 text-[#8A5E12] hover:bg-[#FAF7F2] text-[10px] font-bold transition cursor-pointer"
                              title="Set as Cover"
                            >
                              ★ Cover
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition cursor-pointer"
                          title="Remove Media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI Description Generator & Editor */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Product Description</h2>
            <button
              type="button"
              onClick={handleGenerateAIDescription}
              disabled={generatingAI}
              className="px-4 py-1.5 rounded-full bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/40 hover:bg-[#F3E8D2] font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              {generatingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A5E12]" />
                  <span>Drafting Corporate Specs...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-[#8A5E12]" />
                  <span>Generate Corporate B2B Specs</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows="5"
            placeholder="Detailed technical specifications, enterprise certification, and usage highlights..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] leading-relaxed font-sans"
          />
        </div>

        {/* Toggles */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="accent-[#0D3B2A] w-4 h-4 rounded"
            />
            <span className="font-semibold text-slate-700">Mark as Featured on Homepage</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_hot_deal}
              onChange={(e) => setFormData({ ...formData, is_hot_deal: e.target.checked })}
              className="accent-[#0D3B2A] w-4 h-4 rounded"
            />
            <span className="font-semibold text-slate-700">Mark as Hot Deal</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="accent-[#0D3B2A] w-4 h-4 rounded"
            />
            <span className="font-semibold text-slate-700">Active (Visible in Catalog)</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#D4A24C]" />
            <span>{submitting ? 'Saving...' : isEdit ? 'Update Hardware' : 'Publish to Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
