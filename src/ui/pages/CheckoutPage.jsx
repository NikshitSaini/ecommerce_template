import { useState } from 'react';
import {
  CreditCard,
  FileText,
  Building2,
  Truck,
  Zap,
  Crown,
  Lock,
  Check,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const { cartItems, subtotal } = useCart();

  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#F3EDE7',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    success: '#4F7942'
  };

  const shippingCost = shippingMethod === 'express' ? 49.99 : shippingMethod === 'white-glove' ? 149.99 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shippingCost + tax;

  const shippingMethods = [
    { id: 'standard', label: 'Curbside Delivery', desc: '5-10 business days', price: 'FREE', icon: Truck },
    { id: 'express', label: 'Expedited Shipping', desc: '2-4 business days', price: '$49.99', icon: Zap },
    { id: 'white-glove', label: 'White Glove Delivery', desc: 'In-home setup & assembly', price: '$149.99', icon: Crown },
  ];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif', color: colors.textMain, textAlign: 'center', marginBottom: '3rem' }}>
          Finalize Your Space
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Main Checkout Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: '2' }}>
            
            {/* Delivery Address */}
            <div style={{ backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'serif' }}>
                <Truck size={22} style={{ color: colors.accent }} />
                Delivery Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                  { label: 'First Name', placeholder: 'Jane' },
                  { label: 'Last Name', placeholder: 'Saini' },
                  { label: 'Apartment, suite, etc. (optional)', placeholder: 'Apt 4B', full: true },
                  { label: 'Street Address', placeholder: '123 Furniture Lane', full: true },
                  { label: 'City', placeholder: 'Pune' },
                  { label: 'State', placeholder: 'Maharashtra' },
                  { label: 'ZIP Code', placeholder: '411044' },
                  { label: 'Phone', placeholder: '+91 98765 43210' },
                ].map((field, i) => (
                  <div key={i} style={{ gridColumn: field.full ? '1 / -1' : 'auto' }}>
                    <label style={{ block: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      style={{ 
                        width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', 
                        border: `1px solid ${colors.border}`, fontSize: '0.9rem', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.accent}
                      onBlur={(e) => e.target.style.borderColor = colors.border}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Method */}
            <div style={{ backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain, marginBottom: '2rem', fontFamily: 'serif' }}>Delivery Preference</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', 
                      borderRadius: '12px', border: `2px solid ${shippingMethod === method.id ? colors.accent : colors.border}`,
                      backgroundColor: shippingMethod === method.id ? colors.bg : 'transparent',
                      cursor: 'pointer', transition: 'all 0.3s'
                    }}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      style={{ accentColor: colors.accent, width: '18px', height: '18px' }}
                    />
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '10px', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: shippingMethod === method.id ? colors.accent : colors.accentLight,
                      color: shippingMethod === method.id ? colors.white : colors.accent
                    }}>
                      <method.icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: '700', color: colors.textMain }}>{method.label}</p>
                      <p style={{ fontSize: '0.8rem', color: colors.textMuted }}>{method.desc}</p>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: method.price === 'FREE' ? colors.success : colors.textMain }}>
                      {method.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Secure Payment Notice */}
            <div style={{ backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Lock size={20} style={{ color: colors.accent }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain, fontFamily: 'serif' }}>Secure Payment</h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: colors.textMuted, lineHeight: '1.6' }}>
                Your order is encrypted and handled by our secure partner. You will be redirected to complete payment via Credit Card, UPI, or EMI options. 
                All Furnear transactions are protected with 256-bit SSL encryption.
              </p>
            </div>

            <button style={{ 
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
              padding: '1.25rem', backgroundColor: colors.accent, color: colors.white, 
              fontWeight: '800', fontSize: '1.1rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
              boxShadow: '0 12px 24px rgba(181, 141, 103, 0.25)', transition: 'transform 0.2s'
            }}>
              <Lock size={20} />
              Place Order — ${total.toFixed(2)}
            </button>
          </div>

          {/* Sidebar: Order Summary */}
          <div style={{ flex: '1', position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', fontFamily: 'serif' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {cartItems.length === 0 ? (
                  <p style={{ textAlign: 'center', color: colors.textMuted }}>No items in cart</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: colors.textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: '0.8rem', color: colors.textMuted }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: '0.9rem', fontWeight: '700', color: colors.textMain }}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '700', color: colors.textMain }}>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <span>Delivery Fee</span>
                  <span style={{ fontWeight: '700', color: shippingCost === 0 ? colors.success : colors.textMain }}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: colors.textMuted }}>
                  <span>Sales Tax (8.5%)</span>
                  <span style={{ fontWeight: '700', color: colors.textMain }}>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.accent }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                  © 2026 Furnear Furniture Co. <br />
                  Professional Assembly Included with White Glove Delivery.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}