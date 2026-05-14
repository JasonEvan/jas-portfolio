// composables/useSkills.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { Skill } from "~/types/models";

export const useSkills = () => {
  const { db } = useFirebase();
  const col = db ? collection(db, "skills") : null;

  const getAll = async () => {
    if (!col) return [];
    try {
      const snap = await getDocs(query(col, orderBy("name")));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Skill);
    } catch (err) {
      console.error("Error fetching skills:", err);
      return [];
    }
  };

  const create = async (payload: Partial<Skill>) => {
    if (!col) return "";
    const docRef = await addDoc(col, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const update = async (id: string, payload: Partial<Skill>) => {
    if (!db) return;
    await updateDoc(doc(db, "skills", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "skills", id));
  };

  return { getAll, create, update, remove };
};
