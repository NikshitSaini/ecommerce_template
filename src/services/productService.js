import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

/** Base subcollection path: stores/{storeId}/products */
const col = (storeId) => collection(db, 'stores', storeId, 'products');

export async function getProducts(storeId) {
  const snap = await getDocs(col(storeId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductById(storeId, productId) {
  const ref = doc(db, 'stores', storeId, 'products', productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getProductsByCategory(storeId, category) {
  const q = query(col(storeId), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function searchProducts(storeId, searchTerm) {
  // Firestore doesn't support full-text search natively.
  // We fetch all products and filter client-side (fine for small catalogs).
  const all = await getProducts(storeId);
  const term = searchTerm.toLowerCase();
  return all.filter(
    (p) =>
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
  );
}

export async function addProduct(storeId, productData) {
  const ref = await addDoc(col(storeId), {
    ...productData,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProduct(storeId, productId, updates) {
  const ref = doc(db, 'stores', storeId, 'products', productId);
  await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
}

export async function deleteProduct(storeId, productId) {
  const ref = doc(db, 'stores', storeId, 'products', productId);
  await deleteDoc(ref);
}
