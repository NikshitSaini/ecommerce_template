import { useState } from 'react';

const SKIN_SLOTS = [
  { key: 'Header.jsx', label: 'Header', icon: '🔝', description: 'Navigation bar' },
  { key: 'Footer.jsx', label: 'Footer', icon: '🔚', description: 'Page footer' },
  { key: 'Home.jsx', label: 'Home Page', icon: '🏠', description: 'Main landing page' },
  { key: 'AboutPage.jsx', label: 'About Page', icon: 'ℹ️', description: 'About us page' },
  { key: 'ContactPage.jsx', label: 'Contact Page', icon: '📞', description: 'Contact us page' },
  { key: 'ProductListingPage.jsx', label: 'Product Listing', icon: '🛍️', description: 'All products grid' },
  { key: 'ProductDetailPage.jsx', label: 'Product Details', icon: '📦', description: 'Single product view' },
  { key: 'CartPage.jsx', label: 'Cart Page', icon: '🛒', description: 'Shopping cart' },
  { key: 'CheckoutPage.jsx', label: 'Checkout Page', icon: '💳', description: 'Checkout process' },
  { key: 'ProfilePage.jsx', label: 'Profile Page', icon: '👤', description: 'User profile settings' },
];

/**
 * SkinSelector
 * ─────────────────────────────────────────────────────────────────────────────
 * Sidebar showing available skin slots. Clicking a slot loads it into the editor.
 */
export default function SkinSelector({ selected, onChange, skinStatus }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
    }}>
      <p style={{
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '0.1em',
        color: '#6b7280',
        textTransform: 'uppercase',
        margin: '0 0 0.5rem',
      }}>
        Skin Slots
      </p>
      {SKIN_SLOTS.map((slot) => {
        const isActive = selected === slot.key;
        const hasCustomSkin = skinStatus?.[slot.key];
        return (
          <button
            key={slot.key}
            onClick={() => onChange(slot.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: isActive ? '1px solid #7c3aed' : '1px solid transparent',
              background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#a78bfa' : '#9ca3af',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              width: '100%',
            }}
            onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{slot.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: isActive ? '#a78bfa' : '#e5e7eb',
                marginBottom: '0.1rem',
              }}>
                {slot.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                {slot.description}
              </div>
            </div>
            {hasCustomSkin && (
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                flexShrink: 0,
              }} title="Custom skin active" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { SKIN_SLOTS };
