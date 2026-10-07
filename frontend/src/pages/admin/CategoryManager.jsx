import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, API_BASE } from '../../context/ProductContext';

const ICONS = [
  // Grocery & Kirana
  'storefront', 'shopping_basket', 'shopping_cart', 'store',
  // Fruits & Vegetables
  'eco', 'nutrition', 'nature',
  // Dairy & Bakery
  'bakery_dining', 'water_drop', 'egg', 'icecream',
  // Beverages
  'local_cafe', 'local_bar', 'coffee',
  // Snacks & Namkeen
  'cookie', 'fastfood',
  // Home & Kitchen
  'home', 'kitchen', 'soup_kitchen',
  // Cleaning & Household
  'cleaning_services', 'soap', 'mop',
  // Baby Care
  'child_care', 'baby_changing_station', 'crib',
  // Stationery
  'edit', 'menu_book', 'history_edu',
  // Electronics & Accessories
  'devices', 'smartphone', 'headphones',
  // Fashion & Clothing
  'checkroom', 'shopping_bag',
  // Footwear
  'steps', 'directions_walk',
  // Flowers & Garlands
  'local_florist', 'filter_vintage', 'spa',
  // Others
  'category', 'more_horiz'
];

const PALETTES = [
  { name: 'Green', color: 'var(--primary-fixed)', bgColor: 'rgba(188, 240, 174, 0.2)' },
  { name: 'Orange', color: 'var(--secondary)', bgColor: 'rgba(255, 222, 168, 0.3)' },
  { name: 'Pink', color: 'var(--tertiary)', bgColor: 'rgba(255, 217, 228, 0.3)' },
  { name: 'Red', color: 'var(--error)', bgColor: 'rgba(255, 218, 214, 0.3)' },
  { name: 'Purple', color: '#6750A4', bgColor: 'rgba(103, 80, 164, 0.15)' },
  { name: 'Teal', color: '#006A6A', bgColor: 'rgba(0, 106, 106, 0.15)' }
];

export default function CategoryManager() {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryProductCount } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({ name: '', icon: 'storefront', color: PALETTES[0].color, bgColor: PALETTES[0].bgColor, image: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', icon: 'storefront', color: PALETTES[0].color, bgColor: PALETTES[0].bgColor, image: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ ...cat });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
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
      setForm(f => ({ ...f, image: data.secure_url }));
    } catch (err) {
      alert(err.message || 'Image upload failed. Please verify your backend server configuration.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      updateCategory(editing.id, form);
    } else {
      addCategory(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category? Products in this category will not be deleted.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="app-container admin-container" style={{ minHeight: '100dvh' }}>
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
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>Categories</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button onClick={openAdd} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-lg)',
            background: 'var(--primary)', color: 'var(--on-primary)',
            fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add
          </button>
        </div>
      </header>

      <main style={{ padding: 'var(--space-md) var(--container-padding)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {categories.map((cat, i) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`,
              opacity: 0,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-xl)',
                background: cat.bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{ color: cat.color, fontSize: 26 }}>
                  {cat.icon}
                </span>
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{cat.name}</p>
                <p className="text-label-sm" style={{ color: 'var(--outline)', margin: '2px 0 0' }}>
                  {getCategoryProductCount(cat.id)} products
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <button onClick={() => openEdit(cat)} style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-high)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>edit</span>
                </button>
                <button onClick={() => handleDelete(cat.id)} style={{
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
                {editing ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Category Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Vegetables"
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 15, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }} />
              </div>
              
              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 8 }}>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {ICONS.map(icon => (
                    <button key={icon} onClick={() => setForm(f => ({...f, icon}))} style={{
                      width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                      background: form.icon === icon ? 'var(--primary)' : 'var(--surface-container-high)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: 22,
                        color: form.icon === icon ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                      }}>{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 8 }}>Theme Color Palette</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
                  {PALETTES.map(p => (
                    <button
                      key={p.name}
                      onClick={() => setForm(f => ({ ...f, color: p.color, bgColor: p.bgColor }))}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-lg)',
                        background: form.color === p.color ? 'var(--primary-container)' : 'var(--surface-container-high)',
                        color: form.color === p.color ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        border: form.color === p.color ? '1.5px solid var(--primary)' : '1px solid transparent',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        width: 12, height: 12,
                        borderRadius: '50%',
                        background: p.color,
                        display: 'inline-block'
                      }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 4 }}>Category Cover Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={form.image || ''}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="Paste cover image URL..."
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', fontSize: 14, color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--outline)' }}>OR</span>
                    {uploadingImage ? (
                      <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>sync</span>
                        Uploading to Cloudinary...
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
                  <div style={{ marginTop: 8, width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <button onClick={handleSave} style={{
                width: '100%', padding: 'var(--space-md)',
                background: 'var(--primary)', color: 'var(--on-primary)',
                borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: 16,
                marginTop: 'var(--space-sm)',
              }}>
                {editing ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
