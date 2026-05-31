import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount } = useCart();

  // Theme Colors - Furnear Branding
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentDark: '#8E6B4D',
    bgLight: '#F9F8F6', // Linen White
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    white: '#ffffff',
    border: '#E5E5E5'
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const headerStyle = {
    position: 'sticky', top: 0, zIndex: 50,
    background: scrolled ? 'rgba(255, 255, 255, 0.95)' : colors.white,
    borderBottom: `1px solid ${scrolled ? colors.border : 'transparent'}`,
    boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <header style={headerStyle}>
      {/* Promo bar - Furnear Style */}
      <div style={{
        background: colors.textMain, color: colors.bgLight,
        padding: '0.6rem 1rem', textAlign: 'center',
        fontSize: '0.75rem', fontWeight: '500',
        letterSpacing: '0.05em',
      }}>
        Crafting Comfort for Your Space · <span style={{ color: colors.accent, fontWeight: '700' }}>Save 15%</span> with code: FURN15
      </div>

      {/* Main nav */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>

          {/* Logo - Furnear Identity */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px',
              backgroundColor: colors.accent,
              borderRadius: '8px', // Soft furniture corners
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(181, 141, 103, 0.3)'
            }}>
              <span style={{ color: colors.white, fontWeight: '700', fontSize: '1.2rem' }}>F</span>
            </div>
            <span style={{
              color: colors.textMain, fontSize: '1.5rem', fontWeight: '800',
              letterSpacing: '-0.02em', fontFamily: 'serif' // Using serif for furniture luxury
            }}>
              Furnear
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  style={{
                    padding: '0.5rem 1rem',
                    color: isActive ? colors.accent : colors.textMain,
                    fontSize: '0.9rem', fontWeight: '600',
                    textDecoration: 'none', transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: '0', left: '1rem', right: '1rem',
                      height: '2px', background: colors.accent, borderRadius: '2px'
                    }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search */}
            <Link 
              to="/products"
              style={{
                padding: '0.6rem', background: 'none', border: 'none',
                color: colors.textMain, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', borderRadius: '50%'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <Search size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{
              position: 'relative', padding: '0.6rem',
              color: colors.textMain, textDecoration: 'none', display: 'flex',
              transition: 'all 0.2s', borderRadius: '50%'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  minWidth: '18px', height: '18px', background: colors.textMain,
                  color: colors.white, fontSize: '10px', fontWeight: '700',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: `2px solid ${colors.white}`
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Playground Link */}
            <Link to="/playground" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.25rem',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: colors.white,
              fontSize: '0.85rem', fontWeight: '700',
              borderRadius: '8px', textDecoration: 'none', 
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
            >
              🎨 Playground
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', padding: '0.5rem', background: 'none',
                border: 'none', color: colors.textMain, cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: `1px solid ${colors.border}`, background: colors.white,
          padding: '1rem 2rem 2.5rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path + link.label}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block', padding: '1rem 0',
                borderBottom: `1px solid ${colors.bgLight}`,
                color: location.pathname === link.path ? colors.accent : colors.textMain,
                fontSize: '1rem', fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function DashboardHeader({ title = 'Dashboard' }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#fff', borderBottom: '1px solid #E5E5E5',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', background: '#B58D67', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>F</span>
              </div>
              <span style={{ color: '#2D2D2D', fontSize: '1.2rem', fontWeight: '800', fontFamily: 'serif' }}>Furnear</span>
            </Link>
            <div style={{ width: '1px', height: '24px', background: '#E5E5E5' }} />
            <span style={{ color: '#757575', fontSize: '0.9rem', fontWeight: '500' }}>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
                padding: '0.5rem 1rem', 
                background: '#F9F8F6', 
                borderRadius: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                cursor: 'pointer',
                border: '1px solid #EEE'
            }}>
              <User size={16} style={{ color: '#B58D67' }} />
              <span style={{ color: '#2D2D2D', fontSize: '0.85rem', fontWeight: '600' }}>Management</span>
              <ChevronDown size={14} style={{ color: '#757575' }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}