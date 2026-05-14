// composables/useExperience.ts
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
import type { Experience } from "~/types/models";

export const useExperience = () => {
  const { db } = useFirebase();
  const col = db ? collection(db, "experience") : null;

  const getAll = async () => {
    if (!col) return [];
    try {
      const snap = await getDocs(query(col, orderBy("orderIndex")));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Experience);
    } catch (err) {
      console.error("Error fetching experience:", err);
      return [];
    }
  };

  const create = async (payload: Partial<Experience>) => {
    if (!col) return "";
    const docRef = await addDoc(col, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const update = async (id: string, payload: Partial<Experience>) => {
    if (!db) return;
    await updateDoc(doc(db, "experience", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "experience", id));
  };

  return { getAll, create, update, remove };
};
