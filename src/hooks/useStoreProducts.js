import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getProducts, searchProducts, getProductsByCategory } from '../services/productService';

/**
 * useStoreProducts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches products from the current store's subcollection.
 *
 * Options:
 *   category  — filter by category name
 *   search    — client-side full-text search
 */
export function useStoreProducts({ category, search } = {}) {
  const { storeId } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) return;
    let cancelled = false;

    async function fetch() {
      try {
        setLoading(true);
        let data;
        if (search) {
          data = await searchProducts(storeId, search);
        } else if (category) {
          data = await getProductsByCategory(storeId, category);
        } else {
          data = await getProducts(storeId);
        }
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [storeId, category, search]);

  return { products, loading, error };
}
