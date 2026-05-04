import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = (storeId) => collection(db, 'stores', storeId, 'coupons');

export async function getCoupons(storeId) {
  const snap = await getDocs(col(storeId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function validateCoupon(storeId, code) {
  const q = query(col(storeId), where('code', '==', code.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() };
  // Check expiry
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return null;
  return coupon;
}

export async function addCoupon(storeId, couponData) {
  const ref = await addDoc(col(storeId), {
    ...couponData,
    code: couponData.code.toUpperCase(),
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteCoupon(storeId, couponId) {
  await deleteDoc(doc(db, 'stores', storeId, 'coupons', couponId));
}
