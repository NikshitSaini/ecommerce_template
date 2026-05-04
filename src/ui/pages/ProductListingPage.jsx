import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Loader2, Star, ShoppingCart, Search, Trash2, Sofa } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useStore } from '../../context/StoreContext';

const PRODUCTS_PER_PAGE = 6;

export default function ProductListingPage() {
  const { storeId } = useStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { cartItems, addToCart, removeFromCart } = useCart();

  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#F3EDE7',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    danger: '#D9534F',
    warning: '#D4A017'
  };

  const isInCart = (productId) => cartItems.some(item => item.id === productId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    priceRange: [0, 50000],
  });

  useEffect(() => {
    async function fetchData() {
      if (!storeId) return;
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(storeId),
          getCategories(storeId)
        ]);
        setProducts(prodData);
        setCategories(catData.map((c) => c.label || c.name));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = products;

    const activeCategories = [...sidebarFilters.categories];
    if (categoryFilter && activeCategories.length === 0) {
      activeCategories.push(categoryFilter);
    }

    if (activeCategories.length > 0) {
      result = result.filter((p) => activeCategories.includes(p.category));
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    result = result.filter(
      (p) => p.price >= sidebarFilters.priceRange[0] && p.price <= sidebarFilters.priceRange[1]
    );

    return result;
  }, [products, categoryFilter, searchQuery, sidebarFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  );

  const toggleCategory = (cat) => {
    setSidebarFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat]
    }));
    setCurrentPage(1);
  };

  const setPriceRange = (range) => {
    setSidebarFilters((prev) => ({ ...prev, priceRange: range }));
    setCurrentPage(1);
  };

  const resetAll = () => {
    setSidebarFilters({
      categories: [],
      priceRange: [0, 50000],
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', backgroundColor: colors.bg }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: colors.accent }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '3rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.textMain, fontFamily: 'serif' }}>
              {categoryFilter || 'Gallery Collection'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: colors.textMuted, marginTop: '0.5rem' }}>
              Showing {pagedProducts.length} of {filteredProducts.length} artisan pieces
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem',
                backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: '8px',
                fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, cursor: 'pointer'
              }}
              className="lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('search', e.target.value);
                  else params.delete('search');
                  navigate({ search: params.toString() }, { replace: true });
                }}
                style={{
                  width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', border: `1px solid ${colors.border}`,
                  borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: colors.white
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
            </div>

            {/* Sort */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  appearance: 'none', padding: '0.7rem 2.5rem 0.7rem 1.2rem', backgroundColor: colors.white,
                  border: `1px solid ${colors.border}`, borderRadius: '10px', fontSize: '0.85rem',
                  fontWeight: '700', color: colors.textMain, cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '3rem' }}>
          
          {/* Sidebar Filters */}
          <div style={{ display: showFilters ? 'block' : 'none', width: '280px', flexShrink: 0 }} className="lg:block">
            <aside style={{ 
              backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, 
              padding: '2rem', position: 'sticky', top: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, fontFamily: 'serif' }}>Filters</h2>
                <button onClick={resetAll} style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: '700', color: colors.accent, cursor: 'pointer' }}>
                  Reset All
                </button>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: colors.textMain, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                    Shop by Room
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {categories.map((cat) => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={sidebarFilters.categories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          style={{ width: '18px', height: '18px', accentColor: colors.accent, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: colors.textMuted, fontWeight: '500' }}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div style={{ paddingTop: '2rem', borderTop: `1px solid ${colors.border}` }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: colors.textMain, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                  Price Limit
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: colors.textMuted }}>$</span>
                    <input
                      type="number"
                      value={sidebarFilters.priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), sidebarFilters.priceRange[1]])}
                      style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.5rem', border: `1px solid ${colors.border}`, borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <span style={{ color: colors.textMuted }}>-</span>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: colors.textMuted }}>$</span>
                    <input
                      type="number"
                      value={sidebarFilters.priceRange[1]}
                      onChange={(e) => setPriceRange([sidebarFilters.priceRange[0], Number(e.target.value)])}
                      style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.5rem', border: `1px solid ${colors.border}`, borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Product Grid */}
          <div style={{ flex: 1 }}>
            {pagedProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {pagedProducts.map((product) => (
                    <div key={product.id} style={{ 
                      backgroundColor: colors.white, borderRadius: '20px', border: `1px solid ${colors.border}`, 
                      overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s'
                    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      
                      {/* Image Area */}
                      <Link to={`/product/${product.id}`} style={{ position: 'relative', display: 'block', height: '280px', overflow: 'hidden' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                        />
                        {product.badge && (
                          <span style={{ 
                            position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 0.8rem', 
                            backgroundColor: colors.accent, color: colors.white, fontSize: '0.7rem', 
                            fontWeight: '800', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}>
                            {product.badge}
                          </span>
                        )}
                        {product.stock <= 0 && (
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ padding: '0.6rem 1.2rem', backgroundColor: colors.textMain, color: colors.white, fontSize: '0.8rem', fontWeight: '700', borderRadius: '6px' }}>
                              Crafting in Progress
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Content Area */}
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          {product.category}
                        </span>
                        <Link
                          to={`/product/${product.id}`}
                          style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.textMain, textDecoration: 'none', marginBottom: '0.75rem', lineHeight: '1.4' }}
                        >
                          {product.name}
                        </Link>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < Math.floor(product.rating) ? colors.warning : 'none'}
                                style={{ color: i < Math.floor(product.rating) ? colors.warning : colors.border }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.textMuted }}>
                            {product.rating}
                          </span>
                        </div>

                        {/* Price + Action */}
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: `1px solid ${colors.border}` }}>
                          <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.textMain }}>
                              ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span style={{ fontSize: '0.8rem', color: colors.textMuted, textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {isInCart(product.id) ? (
                            <button
                              onClick={() => removeFromCart(product.id)}
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', 
                                backgroundColor: '#FFF5F5', color: colors.danger, border: `1px solid #FED7D7`,
                                borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', 
                                backgroundColor: colors.accent, color: colors.white, border: 'none',
                                borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
                                opacity: product.stock <= 0 ? 0.5 : 1
                              }}
                            >
                              <ShoppingCart size={16} />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                <Sofa size={48} style={{ color: colors.border, margin: '0 auto 1.5rem' }} />
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textMain }}>No pieces match your search</p>
                <p style={{ color: colors.textMuted, marginTop: '0.5rem' }}>Try adjusting your filters to find your perfect fit.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '4rem' }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', backgroundColor: colors.white, border: `1px solid ${colors.border}`,
                    cursor: 'pointer', opacity: safePage === 1 ? 0.4 : 1
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700',
                      cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: page === safePage ? colors.accent : colors.white,
                      color: page === safePage ? colors.white : colors.textMain,
                      border: `1px solid ${page === safePage ? colors.accent : colors.border}`
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', backgroundColor: colors.white, border: `1px solid ${colors.border}`,
                    cursor: 'pointer', opacity: safePage === totalPages ? 0.4 : 1
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}