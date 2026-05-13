// composables/useProfile.ts
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  resumeUrl: string
  avatarBase64: string
}

export const useProfile = () => {
  const { db } = useFirebase()
  const docRef = doc(db, 'profile', 'main')

  const getProfile = async () => {
    const snap = await getDoc(docRef)
    if (!snap.exists()) return null
    return snap.data() as Profile
  }

  const updateProfile = async (data: Partial<Profile>) => {
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true })
  }

  return { getProfile, updateProfile }
}
