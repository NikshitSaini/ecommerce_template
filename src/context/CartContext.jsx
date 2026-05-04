import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const CartContext = createContext(null);

/**
 * CartContext — Store-Isolated Cart
 * ─────────────────────────────────────────────────────────────────────────────
 * Cart data is stored in localStorage keyed by storeId so carts from
 * different stores never bleed into each other.
 *
 * Key format: `cart_${storeId}` (e.g. "cart_store_med_tech")
 *
 * This avoids Firestore reads/writes for cart state and keeps the UX instant.
 * When an order is placed, CheckoutPage persists it to Firestore.
 */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const { storeId } = useStore();

  const cartKey = storeId ? `cart_${storeId}` : null;

  const [cartItems, setCartItems] = useState(() => {
    if (!cartKey) return [];
    try {
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-load cart when storeId changes (user switches stores)
  useEffect(() => {
    if (!cartKey) return;
    try {
      const saved = localStorage.getItem(cartKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  }, [cartKey]);

  // Clear cart when user signs out
  useEffect(() => {
    if (!user) {
      setCartItems([]);
    }
  }, [user]);

  /** Persist cart to localStorage */
  function persist(items) {
    if (!cartKey) return;
    try {
      localStorage.setItem(cartKey, JSON.stringify(items));
    } catch (err) {
      console.error('[CartContext] Failed to persist cart:', err);
    }
  }

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      const updated = existing
        ? prev.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        : [...prev, { ...product, quantity }];
      persist(updated);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      persist(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, getNewQuantity) => {
    setCartItems((prev) => {
      const updated = prev
        .map((p) => {
          if (p.id !== productId) return p;
          const newQty = getNewQuantity(p.quantity);
          return newQty > 0 ? { ...p, quantity: newQty } : null;
        })
        .filter(Boolean);
      persist(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (cartKey) localStorage.removeItem(cartKey);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading: false, // kept for API compatibility
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
