import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, createUserProfile, getStoreUser, createStoreUser } from '../services/userService';
import { useStore } from './StoreContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { storeId } = useStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't subscribe until storeId is resolved
    if (!storeId) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Fetch global SaaS user profile (Only for super admins)
        let profile = await getUserProfile(firebaseUser.uid);

        // 2. If not a super admin, fetch their store-specific profile
        if (!profile) {
          profile = await getStoreUser(storeId, firebaseUser.uid);
        }

        // 3. If no profile exists anywhere, they are a new shopper for this store
        if (!profile) {
          await createStoreUser(storeId, firebaseUser.uid, {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/100?u=${firebaseUser.uid}`,
            role: 'shopper',
          });
          profile = await getStoreUser(storeId, firebaseUser.uid);
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || `https://i.pravatar.cc/100?u=${firebaseUser.uid}`,
          ...profile,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId]);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Register them as a shopper of this specific store
      await createStoreUser(storeId, uid, {
        name: name || email.split('@')[0],
        email,
        phone: '',
        avatar: `https://i.pravatar.cc/100?u=${uid}`,
        role: 'shopper',
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  /** True if user is the store owner/admin of the CURRENT store */
  const isStoreOwner = user?.role === 'admin' || user?.role === 'store_owner';
  /** True if user is the SaaS platform super admin */
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
        isStoreOwner,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

