import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Global SaaS user profiles (users/ root collection) ───────────────────
// Stores role, ownsStoreId, etc. Visible only to the user themselves + super admin.

export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    {
      ...data,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function updateUserProfile(uid, updates) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
}

// ─── Store-scoped user profiles (stores/{storeId}/users/) ───────────
// One per store per user. Stores role (admin vs shopper), spend, wishlist, etc.

export async function getStoreUser(storeId, uid) {
  const ref = doc(db, 'stores', storeId, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createStoreUser(storeId, uid, data) {
  const ref = doc(db, 'stores', storeId, 'users', uid);
  const existing = await getDoc(ref);
  // Only create if it doesn't already exist (don't overwrite on every login)
  if (!existing.exists()) {
    await setDoc(ref, {
      ...data,
      totalSpent: 0,
      orderCount: 0,
      joinedAt: new Date().toISOString(),
    });
  }
}

export async function updateStoreUser(storeId, uid, updates) {
  const ref = doc(db, 'stores', storeId, 'users', uid);
  await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
}
