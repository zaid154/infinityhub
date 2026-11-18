import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Save,
  Trash2,
  Package,
  Layers,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    category: 'laptop',
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: '',
    rental_price_monthly: '',
    stock_quantity: 1,
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
    is_featured: false,
    is_hot_deal: false,
    is_active: true
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

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
                gst_rate: found.gst_rate || 18,
                description: found.description || '',
                specs: found.specs || {},
                images: found.images || [],
                is_featured: Boolean(found.is_featured),
                is_hot_deal: Boolean(found.is_hot_deal),
                is_active: Boolean(found.is_active)
              });
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

  // Handle Multi-image upload to Cloudinary
  const handleImageUpload = async (e) => {
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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.images]
        }));
        toast.success(`${res.data.images.length} images uploaded to Cloudinary`);
      }
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Google Gemini AI Description Generator
  const handleGenerateAIDescription = async () => {
    if (!formData.title || !formData.brand) {
      toast.error('Please enter Title and Brand before generating with Gemini AI.');
      return;
    }

    setGeneratingAI(true);
    try {
      const res = await api.post('/ai/generate-description', {
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        condition: formData.condition,
        specs: formData.specs
      });

      if (res.data.success) {
        setFormData((prev) => ({ ...prev, description: res.data.description }));
        toast.success('Description generated with Google Gemini!');
      }
    } catch (err) {
      toast.error('Failed to generate description with Gemini.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        const res = await api.put(`/products/${id}`, formData);
        if (res.data.success) {
          toast.success('Product updated successfully!');
          navigate('/admin/products');
        }
      } else {
        const res = await api.post('/products', formData);
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              >
                <option value="laptop">Corporate Laptops</option>
                <option value="desktop">Commercial Desktops</option>
                <option value="monitor">Business Monitors</option>
                <option value="ram">RAM Modules</option>
                <option value="gpu">Workstation GPUs</option>
                <option value="cpu">CPUs & Processors</option>
                <option value="other">Accessories & Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Condition Grade</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              >
                <option value="grade_a_plus">Grade A+ Pristine</option>
                <option value="grade_a">Grade A Corporate</option>
                <option value="grade_b">Grade B Budget</option>
                <option value="for_parts">For Parts / Scrap</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available For</label>
              <select
                value={formData.available_for}
                onChange={(e) => setFormData({ ...formData, available_for: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              >
                <option value="both">Both Sale & Rent</option>
                <option value="sale">Direct Sale Only</option>
                <option value="rent">Rental Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Commercial Pricing & Inventory</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 21500"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rental / Month (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1450"
                value={formData.rental_price_monthly}
                onChange={(e) => setFormData({ ...formData, rental_price_monthly: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Applicable GST Rate</label>
              <select
                value={formData.gst_rate}
                onChange={(e) => setFormData({ ...formData, gst_rate: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono"
              >
                <option value="0">0% (Nil / Exempt)</option>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST (Standard Hardware)</option>
                <option value="28">28% GST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical Specs Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            Hardware Specifications
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Processor</label>
              <input
                type="text"
                placeholder="e.g. Intel Core i5 8th Gen Quad-Core"
                value={formData.specs.processor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, processor: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">RAM Capacity</label>
              <input
                type="text"
                placeholder="e.g. 16GB DDR4 High-Speed"
                value={formData.specs.ram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, ram: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Storage Drive</label>
              <input
                type="text"
                placeholder="e.g. 512GB M.2 NVMe PCIe SSD"
                value={formData.specs.storage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, storage: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Display Screen / Resolution</label>
              <input
                type="text"
                placeholder="e.g. 14.0 inch Full HD IPS Anti-Glare"
                value={formData.specs.screen_size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, screen_size: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GPU / Graphics Card</label>
              <input
                type="text"
                placeholder="e.g. Intel UHD 620 / NVIDIA RTX 3060 12GB"
                value={formData.specs.gpu_model}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, gpu_model: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating System</label>
              <input
                type="text"
                placeholder="e.g. Windows 11 Pro Genuine"
                value={formData.specs.operating_system}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, operating_system: e.target.value }
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>
        </div>

        {/* Cloudinary Multiple Image Upload */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Upload Photos to Cloudinary
            </h2>
            <span className="text-[11px] text-slate-400">Multiple images allowed</span>
          </div>

          <div className="border-2 border-dashed border-[#D4A24C]/40 rounded-2xl p-6 text-center hover:border-[#0D3B2A] transition bg-[#FAF7F2] cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-1">
              {uploadingImages ? (
                <div className="flex items-center justify-center gap-2 text-[#0D3B2A] font-bold">
                  <Loader2 className="w-5 h-5 animate-spin text-[#D4A24C]" />
                  <span>Streaming images to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-700">Click or drag images here to upload</p>
                  <p className="text-[11px] text-slate-400">JPEG, PNG, WebP supported</p>
                </>
              )}
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-3">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="h-24 rounded-xl bg-slate-100 p-1 border border-slate-200 relative group overflow-hidden"
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition shadow"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
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
