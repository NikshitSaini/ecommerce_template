import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const col = (storeId) => collection(db, 'stores', storeId, 'brands');

export async function getBrands(storeId) {
  const snap = await getDocs(col(storeId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addBrand(storeId, brandData) {
  const ref = await addDoc(col(storeId), {
    ...brandData,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteBrand(storeId, brandId) {
  await deleteDoc(doc(db, 'stores', storeId, 'brands', brandId));
}
