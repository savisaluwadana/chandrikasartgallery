'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowLeft, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Variant {
  type: string;
  price: string;
  dimensions: string;
  material: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('painting');
  const [images, setImages] = useState<string[]>(['']);
  const [status, setStatus] = useState<'available' | 'sold'>('available');

  // New Fields
  const [hasPrints, setHasPrints] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Styles for White Theme
  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-black/[0.03] border border-black/[0.1] text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-black/70 mb-2";
  const selectClass = "w-full px-4 py-2.5 rounded-lg bg-black/[0.03] border border-black/[0.1] text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer";

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    if (images.length < 10) {
      setImages([...images, '']);
    }
  };

  const removeImageInput = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Variant Handlers
  const addVariant = () => {
    setVariants([...variants, { type: '', price: '', dimensions: '', material: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !price || !category) {
      setError('All fields are required');
      return;
    }

    const filledImages = images.filter((img) => img.trim());
    if (filledImages.length === 0) {
      setError('At least one image URL is required');
      return;
    }

    // Process variants
    const processedVariants = variants.map(v => ({
      ...v,
      price: parseFloat(v.price) || 0
    })).filter(v => v.type && v.price > 0);

    setLoading(true);

    try {
      const res = await fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          images: filledImages,
          status,
          hasPrints,
          variants: processedVariants,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-black/50 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-black">Add New Product</h1>
        <p className="text-black/50 mt-1">List a new artwork, screensaver, or accessory</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-black/[0.08] rounded-xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-black border-b border-black/[0.1] pb-2">Basic Information</h2>

            <div>
              <label htmlFor="title" className={labelClass}>Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Artwork title"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork, materials, dimensions, and unique features..."
                rows={6}
                disabled={loading}
                required
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className={labelClass}>Price (Rs.) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>Category *</label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className={selectClass}
                  >
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="print">Print</option>
                    <option value="screensaver">Screensaver</option>
                    <option value="necklace">Necklace</option>
                    <option value="craft">Craft</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ArrowLeft className="h-4 w-4 text-black/30 -rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variants / Options */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.1] pb-2">
              <h2 className="text-lg font-medium text-black">Product Options & Variants</h2>
            </div>

            {/* Has Prints Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasPrints"
                checked={hasPrints}
                onChange={(e) => setHasPrints(e.target.checked)}
                className="w-5 h-5 rounded border-black/20 text-black focus:ring-black/20"
              />
              <label htmlFor="hasPrints" className="text-black font-medium">Available as Print?</label>
            </div>

            {/* Variants List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Product Variants (e.g. Canvas Sizes, Materials)</label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-black underline hover:text-black/70"
                >
                  + Add Variant
                </button>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg bg-black/[0.02] border border-black/[0.05] relative">
                  <div className="md:col-span-3">
                    <input
                      placeholder="Type (e.g. Canvas)"
                      value={variant.type}
                      onChange={(e) => updateVariant(index, 'type', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      placeholder="Price"
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      placeholder="Dimensions"
                      value={variant.dimensions}
                      onChange={(e) => updateVariant(index, 'dimensions', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      placeholder="Material"
                      value={variant.material}
                      onChange={(e) => updateVariant(index, 'material', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-black border-b border-black/[0.1] pb-2">Images</h2>
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                    className={inputClass}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      disabled={loading}
                      className="px-3 py-2.5 rounded-lg border border-black/[0.1] text-black/50 hover:text-red-600 hover:border-red-500/30 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {images.length < 10 && (
              <button
                type="button"
                onClick={addImageInput}
                disabled={loading}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/[0.1] text-black/50 hover:text-black hover:border-black/20 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Another Image
              </button>
            )}
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-black border-b border-black/[0.1] pb-2">Status</h2>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'available' | 'sold')}
                disabled={loading}
                className={selectClass}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ArrowLeft className="h-4 w-4 text-black/30 -rotate-90" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-8 border-t border-black/[0.1]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border border-black/[0.1] text-black/70 font-medium rounded-lg hover:text-black hover:border-black/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
