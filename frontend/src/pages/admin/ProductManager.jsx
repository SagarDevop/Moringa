import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, API_BASE } from '../../context/ProductContext';

const PREDEFINED_UNITS = ['kg', 'g', 'piece', 'dozen', 'bunch', 'packet', 'string', '250g', '500g', '5 pcs', '10 pcs'];

export default function ProductManager() {
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', price: '', originalPrice: '', unit: 'kg',
    description: '', available: true, featured: false, image: '',
    image1: '', image2: '', image3: '',
    hasSizes: false,
    sizes: [],
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '', category: categories[0]?.id || '', price: '', originalPrice: '',
      unit: 'kg', description: '', available: true, featured: false, image: '',
      image1: '', image2: '', image3: '',
      hasSizes: false,
      sizes: [],
    });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      ...product,
      price: String(product.price || ''),
      originalPrice: product.originalPrice !== undefined && product.originalPrice !== null ? String(product.originalPrice) : '',
      image1: product.image1 || '',
      image2: product.image2 || '',
      image3: product.image3 || '',
      hasSizes: !!(product.sizes && product.sizes.length > 0),
      sizes: product.sizes || [],
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e, fieldName = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      setForm(f => ({ ...f, [fieldName]: data.secure_url }));
    } catch (err) {
      alert(err.message || 'Image upload failed. Please verify your backend server configuration.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.category) return;

    if (!form.hasSizes && !form.price) {
      alert('Price is required for standard products.');
      return;
    }
    if (form.hasSizes && (!form.sizes || form.sizes.length === 0)) {
      alert('Please add at least one size variant.');
      return;
    }

    const parsedSizes = form.hasSizes
      ? form.sizes.map(s => ({
          size: s.size,
          price: Number(s.price),
          originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined
        }))
      : [];

    const mainPrice = form.hasSizes ? Number(parsedSizes[0].price) : Number(form.price);
    const mainOriginalPrice = form.hasSizes 
      ? (parsedSizes[0].originalPrice ? Number(parsedSizes[0].originalPrice) : undefined)
      : (form.originalPrice ? Number(form.originalPrice) : undefined);

    const data = {
      ...form,
      price: mainPrice,
      originalPrice: mainOriginalPrice,
      sizes: parsedSizes,
    };

    delete data.hasSizes;

    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) deleteProduct(id);
  };

  return (
    <div className="app-container admin-container" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button onClick={() => navigate('/admin/dashboard')}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>arrow_back</span>
          </button>
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>Products</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={openAdd}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-lg)',
              background: 'var(--primary)', color: 'var(--on-primary)',
              fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add
          </button>
        </div>
      </header>

      <main style={{ padding: 'var(--space-md) var(--container-padding)' }}>
        {categories.length === 0 && (
          <div style={{
            background: 'var(--error-container)',
            color: 'var(--on-error-container)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 13,
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--error)' }}>warning</span>
            <div style={{ flexGrow: 1 }}>
              <strong>No categories found:</strong> You must create at least one category in the Category Manager before you can add products.
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              style={{
                background: 'var(--surface)',
                color: 'var(--error)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 'var(--space-md)' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>search</span>
          </div>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: '100%', padding: '10px 16px 10px 40px',
              background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)',
              fontSize: 14, color: 'var(--on-surface)',
            }}
          />
        </div>

        {/* Product List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {filtered.map(product => (
            <div key={product.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-md)',
                overflow: 'hidden', background: 'var(--surface-container)', flexShrink: 0,
              }}>
                <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p className="truncate" style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{product.name}</p>
                <p className="text-label-sm" style={{ color: 'var(--outline)', margin: '2px 0 0', lineHeight: 1.4 }}>
                  {product.sizes && product.sizes.length > 0 ? (
                    <>
                      Sizes: <strong>{product.sizes.map(s => `${s.size} (₹${s.price})`).join(', ')}</strong>
                    </>
                  ) : (
                    <>
                      Price: <strong>₹{product.price}</strong>/{product.unit}
                      {product.originalPrice ? ` · MRP: ₹${product.originalPrice}` : ''}
                    </>
                  )}
                  <br />
                  Category: {categories.find(c => c.id === product.category)?.name || 'None'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexShrink: 0 }}>
                <button onClick={() => openEdit(product)} style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-high)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>edit</span>
                </button>
                <button onClick={() => handleDelete(product.id)} style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--error-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--on-error-container)' }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 480, maxHeight: '90vh',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
            padding: 'var(--space-lg) var(--container-padding) var(--space-xl)',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h2 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }} />
              </div>
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}>
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {/* Checkbox for sizes */}
              <div style={{ margin: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.hasSizes} onChange={e => setForm(f => ({ ...f, hasSizes: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                  This product has size / price variants
                </label>
              </div>

              {!form.hasSizes ? (
                <div className="admin-price-unit-row">
                  <div>
                    <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Original Price (MRP)</label>
                    <input type="number" placeholder="e.g. 1299" value={form.originalPrice} onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }} />
                  </div>
                  <div>
                    <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Selling Price *</label>
                    <input type="number" placeholder="e.g. 999" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }} />
                  </div>
                  <div>
                    <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Unit *</label>
                    <select 
                      value={PREDEFINED_UNITS.includes(form.unit) ? form.unit : 'custom'} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          setForm(f => ({ ...f, unit: '' }));
                        } else {
                          setForm(f => ({ ...f, unit: val }));
                        }
                      }}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}>
                      {PREDEFINED_UNITS.map(u =>
                        <option key={u} value={u}>{u}</option>
                      )}
                      <option value="custom">Custom (Type unit...)</option>
                    </select>
                    {!PREDEFINED_UNITS.includes(form.unit) && (
                      <input 
                        type="text" 
                        placeholder="e.g. 400g" 
                        value={form.unit} 
                        onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                        style={{ 
                          width: '100%', 
                          marginTop: 8, 
                          padding: '12px 16px', 
                          background: 'var(--surface-container-low)', 
                          borderRadius: 'var(--radius-lg)', 
                          fontSize: 15, 
                          color: 'var(--on-surface)', 
                          border: '1px solid var(--outline-variant)' 
                        }} 
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--surface-container-low)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>Size Variants List</span>
                  {form.sizes.map((variant, idx) => (
                    <div key={idx} className="admin-variant-row">
                      <input 
                        type="text" 
                        placeholder="Size (e.g. S, 5L, 9)" 
                        value={variant.size} 
                        onChange={e => {
                          const newSizes = [...form.sizes];
                          newSizes[idx].size = e.target.value;
                          setForm(f => ({ ...f, sizes: newSizes }));
                        }}
                        style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 13, border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}
                      />
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={variant.price} 
                        onChange={e => {
                          const newSizes = [...form.sizes];
                          newSizes[idx].price = e.target.value;
                          setForm(f => ({ ...f, sizes: newSizes }));
                        }}
                        style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 13, border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}
                      />
                      <input 
                        type="number" 
                        placeholder="MRP" 
                        value={variant.originalPrice || ''} 
                        onChange={e => {
                          const newSizes = [...form.sizes];
                          newSizes[idx].originalPrice = e.target.value;
                          setForm(f => ({ ...f, sizes: newSizes }));
                        }}
                        style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 13, border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newSizes = form.sizes.filter((_, i) => i !== idx);
                          setForm(f => ({ ...f, sizes: newSizes }));
                        }}
                        style={{
                          height: 36,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--error-container)',
                          color: 'var(--on-error-container)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        sizes: [...(f.sizes || []), { size: '', price: '', originalPrice: '' }]
                      }));
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface)',
                      border: '1.5px dashed var(--primary)',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: 13,
                      alignSelf: 'flex-start',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                    Add Variant
                  </button>
                </div>
              )}
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', resize: 'none', fontFamily: 'inherit', border: '1px solid var(--outline-variant)' }} />
              </div>
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4, fontWeight: 700 }}>Product Cover Image (Main) *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="Paste main cover image URL..."
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 14, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--outline)' }}>OR</span>
                    {uploadingImage ? (
                      <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>sync</span>
                        Uploading...
                      </span>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ fontSize: 13 }}
                      />
                    )}
                  </div>
                </div>
                {form.image && (
                  <div style={{ marginTop: 8, width: 70, height: 70, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
                    <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Flipkart style additional 3 images */}
              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 8, fontWeight: 700 }}>
                  Additional Images (Flipkart Style - Up to 3)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['image1', 'image2', 'image3'].map((imgKey, idx) => (
                    <div key={imgKey} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Additional Image {idx + 1}</span>
                      <input
                        type="text"
                        value={form[imgKey] || ''}
                        onChange={e => setForm(f => ({ ...f, [imgKey]: e.target.value }))}
                        placeholder={`Paste image ${idx + 1} URL...`}
                        style={{ width: '100%', padding: '8px 12px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--outline)' }}>OR</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, imgKey)}
                          style={{ fontSize: 11 }}
                        />
                      </div>
                      {form[imgKey] && (
                        <div style={{ marginTop: 4, width: 54, height: 54, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--outline-variant)', background: '#ffffff' }}>
                          <img src={form[imgKey]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({...f, available: e.target.checked}))}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))}
                    style={{ width: 18, height: 18, accentColor: 'var(--secondary)' }} />
                  Featured
                </label>
              </div>
              <button onClick={handleSave} style={{
                width: '100%', padding: 'var(--space-md)',
                background: 'var(--primary)', color: 'var(--on-primary)',
                borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: 16,
                marginTop: 'var(--space-sm)',
              }}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
