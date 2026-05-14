// composables/useCertificates.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { Certificate } from "~/types/models";

export const useCertificates = () => {
  const { db } = useFirebase();
  const col = db ? collection(db, "certificates") : null;

  const getAll = async (onlyFeatured = false) => {
    if (!col) return [];
    try {
      const snap = await getDocs(query(col, orderBy("issueDate", "desc")));
      let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      const serialized = stringifyFirestoreData(data) as Certificate[];
      
      if (onlyFeatured) {
        return serialized.filter(c => c.isFeatured);
      }
      
      return serialized;
    } catch (err) {
      console.error("Error fetching certificates:", err);
      return [];
    }
  };

  const create = async (payload: Partial<Certificate>) => {
    if (!col) return "";
    const docRef = await addDoc(col, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const update = async (id: string, payload: Partial<Certificate>) => {
    if (!db) return;
    await updateDoc(doc(db, "certificates", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "certificates", id));
  };

  return { getAll, create, update, remove };
};
