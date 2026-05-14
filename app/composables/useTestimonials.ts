// composables/useTestimonials.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { Testimonial } from "~/types/models";

export const useTestimonials = () => {
  const { db } = useFirebase();
  const col = db ? collection(db, "testimonials") : null;

  const getAll = async (publishedOnly = false) => {
    if (!col) return [];
    const constraints: any[] = publishedOnly
      ? [where("isPublished", "==", true), orderBy("orderIndex")]
      : [orderBy("orderIndex")];

    try {
      const snap = await getDocs(query(col, ...constraints));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return stringifyFirestoreData(data) as Testimonial[];
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      return [];
    }
  };

  const create = async (payload: Partial<Testimonial>) => {
    if (!col) return "";
    const docRef = await addDoc(col, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const update = async (id: string, payload: Partial<Testimonial>) => {
    if (!db) return;
    await updateDoc(doc(db, "testimonials", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "testimonials", id));
  };

  return { getAll, create, update, remove };
};
