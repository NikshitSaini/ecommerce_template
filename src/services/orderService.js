import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

/** Base subcollection path: stores/{storeId}/orders */
const col = (storeId) => collection(db, 'stores', storeId, 'orders');

export async function getOrders(storeId, userId) {
  if (!storeId || !userId) return [];
  const q = query(col(storeId), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllOrders(storeId) {
  if (!storeId) return [];
  const snap = await getDocs(col(storeId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getOrderById(storeId, orderId) {
  const ref = doc(db, 'stores', storeId, 'orders', orderId);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}

export async function placeOrder(storeId, orderData) {
  const ref = await addDoc(col(storeId), {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateOrderStatus(storeId, orderId, status) {
  const ref = doc(db, 'stores', storeId, 'orders', orderId);
  await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
}
