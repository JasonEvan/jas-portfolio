// composables/useProjects.ts
import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'

export interface Project {
  id?: string
  title: string
  slug: string
  description: string
  content: string
  coverBase64: string | null
  coverThumb: string
  techStack: string[]
  projectUrl: string
  repoUrl: string
  isFeatured: boolean
  isPublished: boolean
  orderIndex: number
  hasSeparateImage?: boolean
}

export const useProjects = () => {
  const { db } = useFirebase()
  const col = collection(db, 'projects')

  /** List untuk halaman daftar — tanpa coverBase64 penuh */
  const getAll = async (publishedOnly = false) => {
    const constraints: any[] = publishedOnly
      ? [where('isPublished', '==', true), orderBy('orderIndex')]
      : [orderBy('orderIndex')]
    
    try {
      const snap = await getDocs(query(col, ...constraints))
      return snap.docs.map(d => {
        const data = d.data()
        const { coverBase64, ...rest } = data
        return { id: d.id, ...rest }
      })
    } catch (err) {
      console.error('Error fetching projects:', err)
      return []
    }
  }

  const getBySlug = async (slug: string) => {
    const q = query(col, where('slug', '==', slug), where('isPublished', '==', true))
    const snap = await getDocs(q)
    if (snap.empty || !snap.docs[0]) return null
    
    const docData = snap.docs[0].data()
    return { id: snap.docs[0].id, ...docData } as Project
  }

  const create = async (payload: Partial<Project>) => {
    const slug = (payload.title || '').toLowerCase().replace(/ /g, '-')
    const docRef = await addDoc(col, {
      ...payload,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  }

  const update = async (id: string, payload: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), {
      ...payload,
      updatedAt: serverTimestamp(),
    })
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id))
  }

  return { getAll, getBySlug, create, update, remove }
}
