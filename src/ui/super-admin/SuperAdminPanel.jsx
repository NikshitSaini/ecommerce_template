import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import CreateStoreModal from './CreateStoreModal';

/**
 * SuperAdminPanel
 * ─────────────────────────────────────────────────────────────────────────────
 * The SaaS platform owner's control center. Lists all client stores, allows
 * creating new stores, and provides quick links to each store's admin panel.
 *
 * Accessible only to users with role: "super_admin"
 */
export default function SuperAdminPanel() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');

  async function fetchStores() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'stores'));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStores(data);
    } catch (err) {
      console.error('[SuperAdmin] Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStores(); }, []);

  const toggleStoreActive = async (storeId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'stores', storeId), {
        'config.isActive': !currentStatus,
        updatedAt: new Date().toISOString(),
      });
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? { ...s, config: { ...s.config, isActive: !currentStatus } }
            : s
        )
      );
    } catch (err) {
      console.error('[SuperAdmin] Toggle failed:', err);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.config?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.domain?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      fontFamily: 'Inter, sans-serif',
      color: '#e6edf3',
    }}>
      {/* Top Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '64px',
        background: '#161b22', borderBottom: '1px solid #30363d',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>🚀</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem' }}>SaaS Platform</div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Super Admin Control Center</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>
            Logged in as <strong style={{ color: '#a78bfa' }}>{user?.email}</strong>
          </span>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Stores', value: stores.length, icon: '🏪', color: '#7c3aed' },
            { label: 'Active Stores', value: stores.filter(s => s.config?.isActive !== false).length, icon: '✅', color: '#10b981' },
            { label: 'Inactive Stores', value: stores.filter(s => s.config?.isActive === false).length, icon: '⏸️', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#161b22', border: '1px solid #30363d',
              borderRadius: '0.75rem', padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#8b949e' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Header + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', flex: 1 }}>All Client Stores</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores…"
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              border: '1px solid #30363d', background: '#0d1117',
              color: '#e6edf3', fontSize: '0.875rem', outline: 'none', width: '220px',
            }}
          />
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            + New Store
          </button>
        </div>

        {/* Store Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            Loading stores…
          </div>
        ) : filteredStores.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            background: '#161b22', borderRadius: '0.75rem',
            border: '1px solid #30363d', color: '#6b7280',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
            <p>No stores found. Create your first client store!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredStores.map((store) => {
              const isActive = store.config?.isActive !== false;
              return (
                <div key={store.id} style={{
                  background: '#161b22', border: '1px solid #30363d',
                  borderRadius: '0.75rem', padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#30363d'}>
                  {/* Status dot */}
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: isActive ? '#10b981' : '#6b7280', flexShrink: 0,
                  }} />

                  {/* Store info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                        {store.config?.name || store.id}
                      </span>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: '2rem',
                        background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa',
                        fontSize: '0.65rem', fontWeight: '700', fontFamily: 'monospace',
                      }}>
                        {store.id}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#8b949e' }}>
                      <span>🌐 {store.domain || 'No domain'}</span>
                      <span>💰 {store.config?.currency || '₹'}</span>
                      <span>🎨 {Object.keys(store.activeSkin || {}).length} skin slots</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <a
                      href={`/playground?store=${store.id}`}
                      style={{
                        padding: '0.4rem 0.875rem', border: '1px solid #7c3aed',
                        borderRadius: '0.375rem', background: 'transparent',
                        color: '#a78bfa', fontSize: '0.75rem', fontWeight: '600',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      🎨 Playground
                    </a>
                    <a
                      href={`/admin?store=${store.id}`}
                      style={{
                        padding: '0.4rem 0.875rem', border: '1px solid #30363d',
                        borderRadius: '0.375rem', background: 'transparent',
                        color: '#8b949e', fontSize: '0.75rem', fontWeight: '600',
                        textDecoration: 'none', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.color = '#e6edf3'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e'; }}
                    >
                      ⚙️ Admin
                    </a>
                    <button
                      onClick={() => toggleStoreActive(store.id, isActive)}
                      style={{
                        padding: '0.4rem 0.875rem', border: 'none',
                        borderRadius: '0.375rem', cursor: 'pointer',
                        background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: isActive ? '#f87171' : '#10b981',
                        fontSize: '0.75rem', fontWeight: '600',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isActive ? '⏸ Disable' : '▶ Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateStoreModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newStore) => {
            fetchStores();
          }}
        />
      )}
    </div>
  );
}
