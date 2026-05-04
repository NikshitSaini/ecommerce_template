import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const DEFAULT_HOME_SKIN = `
function Home({ storeData }) {
  const { products = [], config = {} } = storeData;
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '4rem 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', color: 'white', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0 }}>{config.name || 'Welcome to Our Store'}</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginTop: '1rem' }}>Discover our amazing products</p>
        <a href="/products" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'white', color: '#764ba2', borderRadius: '2rem', textDecoration: 'none', fontWeight: '700' }}>Shop Now</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {products.slice(0, 6).map(p => (
          <a key={p.id} href={'/product/' + p.id} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <img src={p.images?.[0] || 'https://placehold.co/400x300'} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontWeight: '600' }}>{p.title}</h3>
              <p style={{ margin: 0, fontWeight: '700', color: '#764ba2' }}>{config.currency || '₹'}{p.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
`;

const DEFAULT_LISTING_SKIN = `
function ProductListing({ storeData }) {
  const { products = [], config = {} } = storeData;
  const [search, setSearch] = React.useState('');
  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>All Products</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '1rem', marginBottom: '2rem', boxSizing: 'border-box' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(p => (
          <a key={p.id} href={'/product/' + p.id} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <img src={p.images?.[0] || 'https://placehold.co/400x300'} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: '600' }}>{p.title}</h3>
              <p style={{ margin: 0, fontWeight: '700', color: '#764ba2' }}>{config.currency || '₹'}{p.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
`;

/**
 * CreateStoreModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Form for the super admin to onboard a new client store.
 */
export default function CreateStoreModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    storeName: '',
    domain: '',
    currency: '₹',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Generate storeId from store name
      const storeId = 'store_' + form.storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');

      // 2. Create owner in Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.ownerEmail,
        form.ownerPassword
      );
      const ownerUid = cred.user.uid;

      // 3. Create owner's store user doc (admin role)
      await setDoc(doc(db, 'stores', storeId, 'users', ownerUid), {
        name: form.ownerName,
        email: form.ownerEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
        avatar: `https://i.pravatar.cc/100?u=${ownerUid}`,
      });

      // 4. Create the store document with default skins
      await setDoc(doc(db, 'stores', storeId), {
        domain: form.domain.replace(/^www\./, '').toLowerCase(),
        ownerUid,
        config: {
          name: form.storeName,
          currency: form.currency,
          logo: '',
          primaryColor: '#764ba2',
          isActive: true,
        },
        activeSkin: {
          'Home.jsx': DEFAULT_HOME_SKIN,
          'ProductListing.jsx': DEFAULT_LISTING_SKIN,
        },
        createdAt: new Date().toISOString(),
      });

      onCreated({ storeId, ownerUid, ...form });
      onClose();
    } catch (err) {
      console.error('[CreateStoreModal]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '0.5rem',
    color: '#e6edf3',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#8b949e',
    marginBottom: '0.375rem',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflow: 'auto',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#e6edf3', fontSize: '1.25rem', fontWeight: '800' }}>
            🏪 Create New Store
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem' }}>✕</button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Store details */}
          <div style={{ background: '#0d1117', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Store Details</p>
            <div>
              <label style={labelStyle}>Store Name *</label>
              <input style={inputStyle} value={form.storeName} onChange={update('storeName')} placeholder="MedTech Supplies" required />
            </div>
            <div>
              <label style={labelStyle}>Domain (without www) *</label>
              <input style={inputStyle} value={form.domain} onChange={update('domain')} placeholder="medtech.com" required />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#6b7280' }}>Point your domain's CNAME to this platform's Vercel URL.</p>
            </div>
            <div>
              <label style={labelStyle}>Currency Symbol</label>
              <input style={{ ...inputStyle, maxWidth: '100px' }} value={form.currency} onChange={update('currency')} placeholder="₹" />
            </div>
          </div>

          {/* Owner details */}
          <div style={{ background: '#0d1117', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Store Owner Login</p>
            <div>
              <label style={labelStyle}>Owner Name *</label>
              <input style={inputStyle} value={form.ownerName} onChange={update('ownerName')} placeholder="Dr. Priya Sharma" required />
            </div>
            <div>
              <label style={labelStyle}>Owner Email *</label>
              <input type="email" style={inputStyle} value={form.ownerEmail} onChange={update('ownerEmail')} placeholder="owner@medtech.com" required />
            </div>
            <div>
              <label style={labelStyle}>Temporary Password *</label>
              <input type="password" style={inputStyle} value={form.ownerPassword} onChange={update('ownerPassword')} placeholder="min 6 characters" required minLength={6} />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#6b7280' }}>Share this with the store owner. They can change it later.</p>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.625rem 1.25rem', border: '1px solid #30363d', borderRadius: '0.5rem', background: 'transparent', color: '#8b949e', fontSize: '0.875rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '0.625rem 1.5rem', border: 'none', borderRadius: '0.5rem', background: loading ? '#21262d' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: loading ? '#6e7681' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating…' : '🚀 Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
