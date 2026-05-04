import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { getOrders, getAllOrders } from '../services/orderService';

/**
 * useStoreOrders
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches orders from the current store's subcollection.
 *
 * Options:
 *   adminMode — if true, fetches ALL orders (requires store owner auth)
 *               if false, fetches only the current user's orders
 */
export function useStoreOrders({ adminMode = false } = {}) {
  const { storeId } = useStore();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function fetch() {
      try {
        setLoading(true);
        const data = adminMode
          ? await getAllOrders(storeId)
          : await getOrders(storeId, user.uid);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [storeId, user, adminMode]);

  const refetch = async () => {
    if (!storeId || !user) return;
    setLoading(true);
    try {
      const data = adminMode
        ? await getAllOrders(storeId)
        : await getOrders(storeId, user.uid);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
}
