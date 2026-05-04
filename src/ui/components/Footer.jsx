import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Footer.jsx — Furnear
// Skin: Modern Organic — Linen background, Oak accents, Charcoal text
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  const colors = {
    bg: '#F9F8F6',      // Linen White
    accent: '#B58D67',  // Warm Oak
    textMain: '#2D2D2D',// Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    white: '#ffffff'
  };

  return (
    <footer style={{
      background: colors.bg, 
      color: colors.textMuted,
      borderTop: `1px solid ${colors.border}`,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px', height: '40px',
                backgroundColor: colors.accent,
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(181, 141, 103, 0.2)'
              }}>
                <span style={{ color: colors.white, fontWeight: '800', fontSize: '1.2rem' }}>F</span>
              </div>
              <span style={{ 
                color: colors.textMain, 
                fontSize: '1.6rem', 
                fontWeight: '800', 
                letterSpacing: '-0.02em',
                fontFamily: 'serif' 
              }}>
                Furnear
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: colors.textMuted, marginBottom: '2rem', maxWidth: '300px' }}>
              Exceptional furniture designed for the modern home. We combine timeless 
              craftsmanship with contemporary aesthetics to create spaces you’ll love.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: '38px', height: '38px',
                    borderRadius: '50%',
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.border}`, 
                    display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: colors.textMain, textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent;
                    e.currentTarget.style.color = colors.white;
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.color = colors.textMain;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 style={{
              fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              color: colors.textMain, marginBottom: '1.5rem', fontWeight: '700',
            }}>
              Shop
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Outdoor', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link to="/products" style={{
                    fontSize: '0.9rem', color: colors.textMuted, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = colors.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              color: colors.textMain, marginBottom: '1.5rem', fontWeight: '700',
            }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Our Story', href: '/about' },
                { label: 'Shipping Info', href: '#' },
                { label: 'Returns & Exchanges', href: '#' },
                { label: 'Care Instructions', href: '#' },
                { label: 'Store Locator', href: '#' },
                { label: 'Contact Us', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} style={{
                    fontSize: '0.9rem', color: colors.textMuted, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = colors.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div>
            <h4 style={{
              fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              color: colors.textMain, marginBottom: '1.5rem', fontWeight: '700',
            }}>
              Get in Touch
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: colors.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: colors.textMain, fontWeight: '500' }}>+91 9818267167</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} style={{ color: colors.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: colors.textMain, fontWeight: '500' }}>hello@furnear.com</span>
              </li>
            </ul>

            <div style={{ marginTop: '2.5rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: colors.textMain, marginBottom: '0.75rem', fontWeight: '700' }}>
                Secure Payment
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Visa', 'Mastercard', 'Amex', 'UPI', 'Apple Pay'].map((method) => (
                  <span key={method} style={{
                    padding: '0.4rem 0.6rem',
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '4px',
                    fontSize: '0.65rem', fontWeight: '700', color: colors.textMain,
                  }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ fontSize: '0.8rem', color: colors.textMuted }}>
          © 2026 Furnear Furniture Co. Designed for living well.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy', 'Terms', 'Cookies'].map((item) => (
            <a key={item} href="#" style={{
              fontSize: '0.8rem', color: colors.textMuted, textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.textMain; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}