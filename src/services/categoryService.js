import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const col = (storeId) => collection(db, 'stores', storeId, 'categories');

export async function getCategories(storeId) {
  const snap = await getDocs(col(storeId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCategory(storeId, categoryData) {
  const ref = await addDoc(col(storeId), {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteCategory(storeId, categoryId) {
  await deleteDoc(doc(db, 'stores', storeId, 'categories', categoryId));
}
