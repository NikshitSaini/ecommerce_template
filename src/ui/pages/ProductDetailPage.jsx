import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  FileText,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Download,
  Loader2,
  Brush,
  Wind,
} from 'lucide-react';

import { getProductById, getProducts } from '../../services/productService';
import { useStore } from '../../context/StoreContext';

export default function ProductDetailPage() {
  const { storeId } = useStore();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#F3EDE7',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    success: '#4F7942',
    warning: '#D4A017'
  };

  useEffect(() => {
    async function fetchData() {
      if (!storeId) return;
      try {
        const prod = await getProductById(storeId, id);
        setProduct(prod);
        if (prod) {
          const allProducts = await getProducts(storeId);
          setRelatedProducts(allProducts.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab('description');
    fetchData();
  }, [storeId, id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', backgroundColor: colors.bg }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: colors.accent }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '80vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.textMain, marginBottom: '2rem', fontFamily: 'serif' }}>Piece not found</p>
          <Link to="/products" style={{ 
            display: 'inline-flex', padding: '1rem 2.5rem', backgroundColor: colors.accent, 
            color: colors.white, fontWeight: '700', borderRadius: '12px', textDecoration: 'none' 
          }}>
            Browse Gallery
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, ...relatedProducts.slice(0, 3).map((p) => p.image)].filter(Boolean);
  const tabs = ['description', 'specifications', 'reviews', 'care instructions'];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Product Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              backgroundColor: colors.white, borderRadius: '24px', 
              border: `1px solid ${colors.border}`, overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
            }}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                style={{ width: '100%', height: '550px', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer',
                    border: `2px solid ${selectedImage === i ? colors.accent : 'transparent'}`,
                    padding: 0, backgroundColor: 'transparent'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {product.badge && (
                <span style={{ 
                  padding: '0.4rem 0.8rem', backgroundColor: colors.accentLight, 
                  color: colors.accent, fontSize: '0.7rem', fontWeight: '800', 
                  borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' 
                }}>
                  {product.badge}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {product.category}
              </span>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{ 
                  fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', 
                  color: product.stock > 0 ? colors.success : '#D9534F' 
                }}>
                  ● {product.stock > 0 ? `Ready to Ship (${product.stock})` : 'Crafting in Progress'}
                </span>
              </div>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: colors.textMain, marginBottom: '1rem', fontFamily: 'serif', lineHeight: '1.1' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 0) ? colors.warning : 'none'}
                    style={{ color: i < Math.floor(product.rating || 0) ? colors.warning : colors.border }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: colors.textMain }}>{product.rating}</span>
              <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>({product.reviews || 0} customer reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.accent }}>
                ${(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: '1.25rem', color: colors.textMuted, textDecoration: 'line-through' }}>
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ color: colors.success, fontSize: '0.9rem', fontWeight: '700' }}>
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p style={{ fontSize: '1.1rem', color: colors.textMuted, lineHeight: '1.8', marginBottom: '2.5rem' }}>
              {product.description}
            </p>

            {/* Quantity & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: colors.textMain }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`, borderRadius: '12px', backgroundColor: colors.white }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <Minus size={18} />
                  </button>
                  <span style={{ padding: '0 1rem', fontSize: '1rem', fontWeight: '800', minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  disabled={product.stock <= 0}
                  style={{ 
                    flex: '1.5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    padding: '1.2rem', backgroundColor: colors.accent, color: colors.white, 
                    fontWeight: '800', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(181, 141, 103, 0.2)', opacity: product.stock <= 0 ? 0.5 : 1
                  }}
                >
                  <ShoppingCart size={20} /> {product.stock > 0 ? 'Add to Space' : 'Crafting Soon'}
                </button>
                <button style={{ 
                  flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  padding: '1.2rem', backgroundColor: colors.white, color: colors.textMain, 
                  fontWeight: '700', borderRadius: '12px', border: `1px solid ${colors.border}`, cursor: 'pointer'
                }}>
                  <Brush size={20} /> Book Consultation
                </button>
              </div>

              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', 
                color: colors.textMuted, fontSize: '0.9rem', cursor: 'pointer', alignSelf: 'flex-start' 
              }}>
                <Share2 size={16} /> Share Design
              </button>
            </div>

            {/* Premium Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem', backgroundColor: colors.white, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
              {[
                { icon: Truck, label: 'White Glove', sub: 'In-home Setup' },
                { icon: Shield, label: '10yr Warranty', sub: 'Heirloom Quality' },
                { icon: Wind, label: 'Eco-Friendly', sub: 'Solid Oak' },
              ].map((feat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <feat.icon size={22} style={{ color: colors.accent, margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: colors.textMain }}>{feat.label}</p>
                  <p style={{ fontSize: '0.65rem', color: colors.textMuted }}>{feat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div style={{ backgroundColor: colors.white, borderRadius: '24px', border: `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1.5rem 2rem', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase',
                  letterSpacing: '0.05em', border: 'none', background: 'none', cursor: 'pointer',
                  color: activeTab === tab ? colors.accent : colors.textMuted,
                  position: 'relative', transition: 'all 0.3s'
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: colors.accent }} />
                )}
              </button>
            ))}
          </div>
          <div style={{ padding: '3rem' }}>
            {activeTab === 'description' && (
              <div style={{ color: colors.textMuted, lineHeight: '2', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>{product.description}</p>
                <p>
                  Crafted by master artisans, this piece embodies the Furnear philosophy of sustainable luxury. 
                  Every joint is hand-finished, ensuring that your furniture is not just a functional object, 
                  but a durable legacy for your home. We use exclusively FSC-certified hardwoods and 
                  low-VOC finishes to ensure your living environment stays as healthy as it is beautiful.
                </p>
              </div>
            )}
            {activeTab === 'specifications' && product.specs && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr key={key} style={{ backgroundColor: i % 2 === 0 ? colors.bg : 'transparent' }}>
                      <td style={{ padding: '1.25rem', fontSize: '0.9rem', fontWeight: '800', color: colors.textMain, width: '30%' }}>{key}</td>
                      <td style={{ padding: '1.25rem', fontSize: '0.9rem', color: colors.textMuted }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { name: 'Aditi Rao', rating: 5, text: 'The wood grain is stunning. It’s even more beautiful in person than in the photos.' },
                  { name: 'Karan Sharma', rating: 5, text: 'Incredibly sturdy. The white-glove delivery team was professional and handled everything perfectly.' },
                ].map((review, i) => (
                  <div key={i} style={{ padding: '2rem', backgroundColor: colors.bg, borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', backgroundColor: colors.accent, 
                        color: colors.white, borderRadius: '50%', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontWeight: '800' 
                      }}>{review.name[0]}</div>
                      <span style={{ fontWeight: '800', color: colors.textMain }}>{review.name}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.2rem' }}>
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} fill={j < review.rating ? colors.warning : 'none'} color={j < review.rating ? colors.warning : colors.border} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: colors.textMuted, lineHeight: '1.6' }}>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'care instructions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Wooden Surface Care Guide', size: '1.2 MB' },
                  { name: 'Fabric & Upholstery Maintenance', size: '2.5 MB' },
                  { name: 'Heirloom Warranty Certificate', size: '500 KB' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      padding: '1.5rem', backgroundColor: colors.bg, borderRadius: '12px', 
                      cursor: 'pointer', border: `1px solid ${colors.border}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={20} style={{ color: colors.accent }} />
                      <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: '700', color: colors.textMain }}>{doc.name}</p>
                        <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>{doc.size} • PDF</p>
                      </div>
                    </div>
                    <Download size={18} style={{ color: colors.textMuted }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: colors.textMain, marginBottom: '2.5rem', fontFamily: 'serif' }}>Complementary Pieces</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {relatedProducts.map((p) => (
                <div key={p.id} style={{ 
                  backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, 
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
                }}>
                  <Link to={`/product/${p.id}`} style={{ position: 'relative', display: 'block', height: '280px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {p.badge && <span style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 0.8rem', backgroundColor: colors.accent, color: colors.white, fontSize: '0.7rem', fontWeight: '800', borderRadius: '6px' }}>{p.badge}</span>}
                  </Link>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: colors.accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.category}</span>
                    <Link to={`/product/${p.id}`} style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.textMain, textDecoration: 'none', marginBottom: '1rem' }}>{p.name}</Link>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain }}>${p.price.toLocaleString()}</span>
                      <button style={{ 
                        padding: '0.6rem 1rem', backgroundColor: colors.accent, color: colors.white, 
                        border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' 
                      }}>Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}