import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { APP_CONFIG } from '../data/sampleData';
import { optimizeImageUrl } from '../utils/image';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart, donation } = useCart();
  const { whatsappNumber } = useProducts();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  React.useEffect(() => {
    if (items.length === 0 || totalPrice < 150) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, totalPrice, navigate]);

  if (items.length === 0 || totalPrice < 150) {
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/[^0-9]/g, '')))
      errs.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) errs.address = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSending(true);

    const productLines = items.map(item => {
      const sizeStr = item.selectedSize ? ` (${item.selectedSize})` : '';
      return `• ${item.name}${sizeStr} – ${item.quantity} ${item.unit}`;
    }).join('\n');

    const deliveryCharge = APP_CONFIG.deliveryFee;
    const handlingCharge = APP_CONFIG.handlingFee;
    const donationCharge = donation;
    const finalTotal = totalPrice + deliveryCharge + handlingCharge + donationCharge;

    const donationSection = donationCharge > 0 
      ? `\n❤️ *Donation (Gujarat Needy)*: ₹${donationCharge}` 
      : '';

    const message = `Hello Botanís,

I would like to place an order:

👤 *Customer Name*: ${form.name}
📞 *Phone*: ${form.phone}
📍 *Address*: ${form.address}

🛒 *Products*:
${productLines}

🚚 *Delivery*: ₹${deliveryCharge} (Flat rate - Kitne ke bhi order pe! 🎉)
⚙️ *Handling Cost*: ₹${handlingCharge}${donationSection}
💵 *Total*: ${APP_CONFIG.currency}${finalTotal}

Please confirm availability and delivery time. Thank you!`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    setTimeout(() => {
      clearCart();
      window.location.href = url;
    }, 400);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: 'var(--space-md)',
    paddingLeft: 48,
    background: 'var(--surface-container-lowest)',
    border: `1px solid ${errors[field] ? 'var(--error)' : 'var(--outline-variant)'}`,
    borderRadius: 'var(--radius-xl)',
    fontSize: 16,
    lineHeight: '24px',
    color: 'var(--on-surface)',
    transition: 'all 0.2s',
  });

  return (
    <div className="app-container" style={{ paddingBottom: 120 }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        background: 'var(--surface)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--space-md) var(--container-padding)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button onClick={() => navigate(-1)} style={{ transition: 'transform 0.2s' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>arrow_back</span>
            </button>
            <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
              Checkout
            </h1>
          </div>
        </div>
      </header>

      <main style={{
        padding: 'var(--space-lg) var(--container-padding)',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        {/* Progress */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 'var(--space-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--primary)', color: 'var(--on-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12,
            }}>1</div>
            <span className="text-title-md" style={{ fontSize: 15 }}>Details</span>
          </div>
          <div style={{
            height: 2, flexGrow: 1, margin: '0 16px',
            background: 'var(--surface-container-high)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{ width: '50%', height: '100%', background: 'var(--primary)', borderRadius: 'var(--radius-full)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', opacity: 0.4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--surface-container-highest)', color: 'var(--on-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12,
            }}>2</div>
            <span className="text-title-md" style={{ fontSize: 15 }}>Confirm</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(194,201,187,0.3)',
          marginBottom: 'var(--space-lg)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 96, height: 96,
            background: 'rgba(21,66,18,0.05)',
            borderRadius: '50%',
            marginRight: -48, marginTop: -48,
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="text-title-md" style={{ color: 'var(--primary)', margin: '0 0 var(--space-sm)' }}>
              Order Summary
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', background: 'var(--surface-container)',
              }}>
                {items[0] && <img src={optimizeImageUrl(items[0].image, 100) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div>
                <p className="text-body-md" style={{ fontWeight: 600, margin: 0 }}>
                  {totalItems} items in cart
                </p>
                <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)', margin: '2px 0 0', lineHeight: 1.4 }}>
                  Subtotal: ₹{totalPrice} | Delivery: ₹{APP_CONFIG.deliveryFee} | Handling: ₹{APP_CONFIG.handlingFee}
                  {donation > 0 && ` | Donation: ₹${donation}`}
                </p>
                <p className="text-title-md" style={{ color: 'var(--primary)', fontWeight: 700, margin: '4px 0 0' }}>
                  Total: ₹{totalPrice + APP_CONFIG.deliveryFee + APP_CONFIG.handlingFee + donation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Name */}
          <div>
            <label className="text-label-sm" style={{
              display: 'block', color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-xs)', marginLeft: 4,
            }}>
              Your Name
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 'var(--space-md)', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 20, color: form.name ? 'var(--primary)' : 'var(--outline)',
                  transition: 'color 0.2s',
                }}>person</span>
              </div>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                style={inputStyle('name')}
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p style={{ color: 'var(--error)', fontSize: 12, margin: '4px 0 0 4px' }}>{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-label-sm" style={{
              display: 'block', color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-xs)', marginLeft: 4,
            }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 'var(--space-md)', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 20, color: form.phone ? 'var(--primary)' : 'var(--outline)',
                  transition: 'color 0.2s',
                }}>phone_iphone</span>
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="9876543210"
                style={inputStyle('phone')}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p style={{ color: 'var(--error)', fontSize: 12, margin: '4px 0 0 4px' }}>{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-label-sm" style={{
              display: 'block', color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-xs)', marginLeft: 4,
            }}>
              Delivery Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 'var(--space-md)', top: 'var(--space-md)',
                pointerEvents: 'none',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 20, color: form.address ? 'var(--primary)' : 'var(--outline)',
                  transition: 'color 0.2s',
                }}>location_on</span>
              </div>
              <textarea
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Street name, house number, area, city..."
                rows={3}
                style={{
                  ...inputStyle('address'),
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
                autoComplete="street-address"
              />
            </div>
            {errors.address && (
              <p style={{ color: 'var(--error)', fontSize: 12, margin: '4px 0 0 4px' }}>{errors.address}</p>
            )}
          </div>

          {/* WhatsApp Note */}
          <div style={{
            display: 'flex', gap: 'var(--space-md)',
            padding: 'var(--space-md)',
            background: 'rgba(254,183,0,0.08)',
            border: '1px solid rgba(254,183,0,0.15)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: 24, flexShrink: 0 }}>
              info
            </span>
            <p className="text-body-md" style={{ color: 'var(--on-secondary-container)', margin: 0 }}>
              Your order details will be sent to our WhatsApp for final confirmation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        padding: 'var(--container-padding)',
        background: 'var(--surface-container-lowest)',
        boxShadow: '0 -8px 20px rgba(21,66,18,0.06)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        zIndex: 'var(--z-nav)',
      }}>
        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{
            width: '100%',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-md)',
            transition: 'all 0.3s ease',
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>Sending...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined filled">send</span>
              <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>Send Order</span>
            </>
          )}
        </button>
        <p className="text-label-sm" style={{
          textAlign: 'center', color: 'var(--on-surface-variant)',
          marginTop: 'var(--space-md)',
        }}>
          Fast & Secure WhatsApp Checkout
        </p>
      </div>
    </div>
  );
}
