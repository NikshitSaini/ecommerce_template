import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Star, Sofa, Bed, Lamp, Coffee } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useStore } from '../../context/StoreContext';

// ─────────────────────────────────────────────────────────────────────────────
// Home.jsx — Furnear Brand Landing Page
// Skin: Modern Organic — Linen, Oak, and Soft Charcoal
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { storeId } = useStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#D4B99E',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4'
  };

  useEffect(() => {
    async function fetchData() {
      if (!storeId) return;
      try {
        const [prods, cats] = await Promise.all([getProducts(storeId), getCategories(storeId)]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: colors.bg }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: colors.accent }} />
      </div>
    );
  }

  return (
    <div style={{ background: colors.bg, color: colors.textMain, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '4rem 0' }}>
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span style={{
                display: 'inline-block', fontSize: '0.8rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: colors.accent, marginBottom: '1.5rem',
                fontWeight: '700'
              }}>
                Spring Interior Sale — Up to 30% Off
              </span>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '800',
                lineHeight: '1.1', marginBottom: '1.5rem', color: colors.textMain,
                fontFamily: 'serif', letterSpacing: '-0.02em'
              }}>
                Designing Space <br />
                <span style={{ color: colors.accent }}>For Living Well.</span>
              </h1>
              <p style={{
                fontSize: '1.15rem', color: colors.textMuted, lineHeight: '1.7',
                maxWidth: '500px', marginBottom: '2.5rem',
              }}>
                Discover artisan-crafted furniture that blends timeless comfort 
                with modern elegance. Transform your house into a soulful home.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/products"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    background: colors.accent, color: colors.white,
                    padding: '1.1rem 2.8rem', fontWeight: '700', fontSize: '0.9rem',
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s',
                    boxShadow: '0 10px 20px rgba(181, 141, 103, 0.2)'
                  }}
                >
                  Shop Furniture <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    border: `1px solid ${colors.border}`, color: colors.textMain,
                    background: colors.white,
                    padding: '1.1rem 2.8rem', fontWeight: '700', fontSize: '0.9rem',
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s',
                  }}
                >
                  Our Process
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                aspectRatio: '1/1.1', background: colors.white,
                borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}>
                {products[0]?.image ? (
                  <img
                    src={products[0].image}
                    alt="Signature Chair"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: colors.border }}>
                    <Sofa size={80} strokeWidth={1} />
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.textMuted, marginTop: '1rem' }}>Signature Piece</p>
                  </div>
                )}
              </div>
              {/* Floating detail box */}
              <div style={{
                position: 'absolute', top: '10%', left: '-10%',
                background: colors.white, padding: '1.5rem', borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'none', // Visible on lg screens via CSS
              }}>
                <Star size={16} fill={colors.accent} color={colors.accent} />
                <p style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '0.5rem' }}>4.9/5 Rating</p>
                <p style={{ fontSize: '0.7rem', color: colors.textMuted }}>From 2k+ Homeowners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Strip ─────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`,
        padding: '2rem 0', background: colors.white
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap',
          fontSize: '0.85rem', fontWeight: '600', color: colors.textMain,
        }}>
          {[
            { icon: Sofa, label: 'Quality Craftsmanship' },
            { icon: Bed, label: 'Sustainable Sourcing' },
            { icon: Lamp, label: 'Custom Tailored' },
            { icon: Coffee, label: '30-Day Home Trial' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <item.icon size={20} color={colors.accent} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Shop by Room ──────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif', marginBottom: '1rem' }}>Shop by Room</h2>
            <div style={{ width: '60px', height: '3px', background: colors.accent, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.label || cat.name)}`}
                style={{ textDecoration: 'none', display: 'block', borderRadius: '20px', overflow: 'hidden' }}
              >
                <div style={{
                  position: 'relative', aspectRatio: '4/5',
                  background: colors.white, transition: 'transform 0.4s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: colors.border }} />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(45,45,45,0.7) 0%, transparent 40%)',
                  }} />
                  <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.white }}>{cat.label || cat.name}</h3>
                    <p style={{ color: colors.white, opacity: 0.9, fontSize: '0.9rem', marginTop: '0.5rem' }}>View Collection</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Trending Furniture ──────────────────────────────────────────────────── */}
      {products.length > 0 && (
        <section style={{ background: colors.white, padding: '6rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: colors.accent, fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>MOST LOVED</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif', marginTop: '0.5rem' }}>Trending Now</h2>
              </div>
              <Link to="/products" style={{ color: colors.accent, fontWeight: '700', textDecoration: 'none', borderBottom: `2px solid ${colors.accent}` }}>
                See All
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ background: colors.bg, borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '1/1', position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {product.isNew && (
                        <div style={{
                          position: 'absolute', top: '1rem', right: '1rem',
                          background: colors.white, color: colors.textMain,
                          padding: '0.4rem 1rem', borderRadius: '30px',
                          fontSize: '0.7rem', fontWeight: '700', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                        }}>New</div>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{product.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.accent }}>
                          ${Number(product.price).toFixed(0)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={14} fill={colors.accent} color={colors.accent} />
                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{product.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand Narrative ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    aspectRatio: '1/1.2', background: colors.accentLight, borderRadius: '200px 200px 0 0',
                    overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                }}>
                    {/* Placeholder for "The Craft" image */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sofa size={100} color={colors.white} strokeWidth={1} />
                    </div>
                </div>
                <div style={{
                    position: 'absolute', bottom: '-20px', right: '-20px',
                    background: colors.textMain, color: colors.white,
                    padding: '2rem', borderRadius: '12px'
                }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif' }}>10+</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.7 }}>Years of Artisan Excellence</p>
                </div>
            </div>
          <div>
            <span style={{ color: colors.accent, fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>OUR HERITAGE</span>
            <h2 style={{
              fontSize: '3rem', fontWeight: '800', fontFamily: 'serif',
              lineHeight: '1.2', margin: '1rem 0 2rem',
            }}>
              Furniture Built for <br />Generation's Stories.
            </h2>
            <p style={{ color: colors.textMuted, lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              At Furnear, we believe your home should be a reflection of your journey. 
              We don't mass-produce; we curate. Every joint, fabric choice, and finish 
              is inspected by our master craftsmen to ensure it stands the test of time.
            </p>
            <p style={{ color: colors.textMuted, lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
              We use ethically sourced hardwoods and premium textiles to create 
              pieces that are as kind to the planet as they are beautiful in your home.
            </p>
            <Link to="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              color: colors.textMain, textDecoration: 'none',
              fontSize: '0.9rem', fontWeight: '700', borderBottom: `2px solid ${colors.accent}`,
              paddingBottom: '0.2rem'
            }}>
              Discover Our Story <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: '#ECEAE4', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'serif', marginBottom: '1.5rem' }}>Join the Furnear Club</h2>
          <p style={{ color: colors.textMuted, marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Receive interior design tips, exclusive early-access to new collections, 
            and a 10% discount on your first order.
          </p>
          {subscribed ? (
            <div style={{ background: colors.white, padding: '1.5rem', borderRadius: '12px', color: colors.accent, fontWeight: '700' }}>
              Welcome! Your welcome code has been sent to your inbox.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', background: colors.white, padding: '0.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1, border: 'none', padding: '0 1.5rem',
                  fontSize: '0.95rem', outline: 'none', background: 'transparent'
                }}
              />
              <button
                onClick={() => { if (email) setSubscribed(true); }}
                style={{
                  background: colors.textMain, color: colors.white, border: 'none',
                  padding: '1rem 2rem', fontWeight: '700', borderRadius: '8px', cursor: 'pointer',
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}