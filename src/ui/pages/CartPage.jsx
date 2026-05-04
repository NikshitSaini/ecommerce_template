import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems: items, updateQuantity: contextUpdateQty, removeFromCart, subtotal, loading } = useCart();
  const [promoCode, setPromoCode] = useState('');

  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    success: '#4F7942' // Sage Green for Free Shipping
  };

  const updateQty = (id, delta) => {
    contextUpdateQty(id, delta);
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Furniture shipping is usually higher; free over $1500
  const shipping = subtotal > 1500 ? 0 : 149.00;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '100px', height: '100px', backgroundColor: colors.white, 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' 
          }}>
            <ShoppingBag size={40} style={{ color: colors.accent }} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif', color: colors.textMain, marginBottom: '1rem' }}>
            Your space is waiting
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Your cart is currently empty. Explore our artisan-crafted collections to find the perfect piece for your home.
          </p>
          <Link to="/products" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
            backgroundColor: colors.accent, color: colors.white, padding: '1.2rem 2.5rem', 
            borderRadius: '12px', fontWeight: '700', textDecoration: 'none',
            boxShadow: '0 10px 25px rgba(181, 141, 103, 0.2)'
          }}>
            Explore Furniture <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'serif', color: colors.textMain, marginBottom: '2.5rem' }}>
          Your Cart <span style={{ color: colors.textMuted, fontSize: '1.2rem', fontWeight: '400' }}>({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '2' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: colors.white, borderRadius: '16px', border: `1px solid ${colors.border}`,
                  padding: '1.5rem', display: 'flex', gap: '1.5rem', transition: 'box-shadow 0.3s'
                }}
              >
                <Link to={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                </Link>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {item.category}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', color: colors.textMain, textDecoration: 'none', marginTop: '0.25rem' }}
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: '0.5rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: colors.bg }}>
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        style={{ padding: '0.5rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 1rem', fontSize: '0.9rem', fontWeight: '700', color: colors.textMain }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        style={{ padding: '0.5rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <Link to="/products" style={{ 
                fontSize: '0.9rem', fontWeight: '700', color: colors.textMain, 
                textDecoration: 'none', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '0.2rem' 
              }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ flex: '1', position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', fontFamily: 'serif' }}>Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '700', color: colors.textMain }}>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Shipping</span>
                    <Truck size={14} />
                  </div>
                  <span style={{ fontWeight: '700', color: shipping === 0 ? colors.success : colors.textMain }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <span>Estimated Tax</span>
                  <span style={{ fontWeight: '700', color: colors.textMain }}>${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.accent }} />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code"
                    style={{ 
                      width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', 
                      border: `1px solid ${colors.border}`, fontSize: '0.85rem', outline: 'none' 
                    }}
                  />
                </div>
                <button style={{ 
                  backgroundColor: colors.textMain, color: colors.white, 
                  border: 'none', padding: '0 1rem', borderRadius: '8px', 
                  fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' 
                }}>
                  Apply
                </button>
              </div>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.accent }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <Link to="/checkout" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
                  backgroundColor: colors.accent, color: colors.white, padding: '1.2rem', 
                  borderRadius: '12px', fontWeight: '800', textDecoration: 'none',
                  boxShadow: '0 10px 20px rgba(181, 141, 103, 0.2)'
                }}>
                  Secure Checkout <ArrowRight size={20} />
                </Link>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: colors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <span>🔒</span> White-Glove Professional Delivery Included
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}