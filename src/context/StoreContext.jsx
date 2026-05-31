import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * StoreContext — The Domain Router
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the very first thing that runs. It resolves the current hostname
 * to a Firestore store document and makes the storeId + store config available
 * to the entire app via context.
 *
 * Resolution order:
 *  1. Dev override: VITE_DEV_STORE_OVERRIDE env var (skips hostname lookup)
 *  2. URL param: ?store=<storeId> (useful for local testing specific stores)
 *  3. Hostname: window.location.hostname → query stores where domain == hostname
 */

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [storeId, setStoreId] = useState(null);
  const [storeConfig, setStoreConfig] = useState(null);
  const [activeSkin, setActiveSkin] = useState({});
  const [storeName, setStoreName] = useState('');
  const [ownerUid, setOwnerUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    async function resolveStore() {
      try {
        setLoading(true);

        // ── Step 1: Determine which store to load ────────────────────────────
        let resolvedStoreId = null;

        // Dev override via .env (highest priority)
        const devOverride = import.meta.env.VITE_DEV_STORE_OVERRIDE;
        if (devOverride && import.meta.env.DEV) {
          console.log(`[StoreContext] 🔧 Dev override active: ${devOverride}`);
          resolvedStoreId = devOverride;
        }

        // URL query param override: ?store=store_med_tech
        if (!resolvedStoreId) {
          const params = new URLSearchParams(window.location.search);
          const storeParam = params.get('store');
          if (storeParam) {
            console.log(`[StoreContext] 🔗 URL param override: ${storeParam}`);
            resolvedStoreId = storeParam;
          }
        }

        // ── Step 2: Hostname-based lookup (production) ────────────────────────
        if (!resolvedStoreId) {
          const hostname = window.location.hostname;
          // Strip www. prefix for matching
          const domain = hostname.replace(/^www\./, '');
          console.log(`[StoreContext] 🌐 Resolving domain: ${domain}`);

          const q = query(
            collection(db, 'stores'),
            where('domain', '==', domain)
          );
          const snap = await getDocs(q);

          if (snap.empty) {
            setError(`No store found for domain: ${domain}`);
            setLoading(false);
            return;
          }

          resolvedStoreId = snap.docs[0].id;
        }

        // ── Step 3: Subscribe to real-time updates ───────────────────────────
        const ref = doc(db, 'stores', resolvedStoreId);
        
        unsubscribe = onSnapshot(ref, (snap) => {
          if (!snap.exists()) {
            setError(`Store document not found: ${resolvedStoreId}`);
            setLoading(false);
            return;
          }

          applyStoreData(resolvedStoreId, snap.data());
          setLoading(false);
        }, (err) => {
          console.error('[StoreContext] Real-time listener error:', err);
          setError(err.message);
          setLoading(false);
        });

      } catch (err) {
        console.error('[StoreContext] Failed to resolve store:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    function getMergedSkins(id, firestoreSkins) {
      const merged = { ...(firestoreSkins || {}) };
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const prefix = `playground_skin_${id}_`;
          if (key && key.startsWith(prefix)) {
            const slotKey = key.substring(prefix.length);
            const val = localStorage.getItem(key);
            if (val !== null) {
              merged[slotKey] = val;
            }
          }
        }
      } catch (err) {
        console.error('[StoreContext] LocalStorage read failed:', err);
      }
      return merged;
    }

    function applyStoreData(id, data) {
      console.log(`[StoreContext] ✅ Store applied: ${id}`);
      setStoreId(id);
      setStoreName(data.config?.name || id);
      setStoreConfig(data.config || {});
      setActiveSkin(getMergedSkins(id, data.activeSkin));
      setOwnerUid(data.ownerUid || null);
    }

    resolveStore();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Refreshes the active skin from Firestore.
   * Called after the Playground saves a new skin.
   */
  async function refreshSkin() {
    if (!storeId) return;
    try {
      const snap = await getDoc(doc(db, 'stores', storeId));
      if (snap.exists()) {
        const merged = { ...(snap.data().activeSkin || {}) };
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const prefix = `playground_skin_${storeId}_`;
          if (key && key.startsWith(prefix)) {
            const slotKey = key.substring(prefix.length);
            const val = localStorage.getItem(key);
            if (val !== null) {
              merged[slotKey] = val;
            }
          }
        }
        setActiveSkin(merged);
      }
    } catch (err) {
      console.error('[StoreContext] Failed to refresh skin:', err);
    }
  }

  function updateLocalSkin(key, code) {
    if (!storeId) return;
    try {
      localStorage.setItem(`playground_skin_${storeId}_${key}`, code);
      setActiveSkin(prev => ({
        ...prev,
        [key]: code
      }));
    } catch (err) {
      console.error('[StoreContext] Failed to save skin to localStorage:', err);
    }
  }

  function clearLocalSkin(key) {
    if (!storeId) return;
    try {
      localStorage.removeItem(`playground_skin_${storeId}_${key}`);
      refreshSkin();
    } catch (err) {
      console.error('[StoreContext] Failed to remove skin from localStorage:', err);
    }
  }

  const value = {
    storeId,
    storeName,
    storeConfig,
    activeSkin,
    ownerUid,
    loading,
    error,
    refreshSkin,
    updateLocalSkin,
    clearLocalSkin,
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: '#0f0f0f',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #333',
          borderTop: '3px solid #764ba2',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Loading store…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: '#0f0f0f',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h1 style={{ color: '#ef4444', margin: 0 }}>Store Not Found</h1>
        <p style={{ color: '#888', maxWidth: '400px' }}>
          No store is configured for this domain.
          {import.meta.env.DEV && (
            <span> Try adding <code>VITE_DEV_STORE_OVERRIDE=your_store_id</code> to your <code>.env</code> file.</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
}
