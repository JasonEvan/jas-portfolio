// composables/useProfile.ts
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  resumeUrl: string;
  avatarBase64: string;
  hasSeparateAvatar?: boolean;
}

export const useProfile = () => {
  const { db } = useFirebase();
  const { isSafeForSameDoc } = useImageBase64();
  const docRef = doc(db, "profile", "main");

  const getProfile = async () => {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data() as Profile;

    // If avatar is stored separately, fetch it
    if (data.hasSeparateAvatar) {
      const avatarSnap = await getDoc(doc(db, "profile/main/images/avatar"));
      if (avatarSnap.exists()) {
        data.avatarBase64 = avatarSnap.data()?.base64;
      }
    }

    return data;
  };

  const updateProfile = async (data: Partial<Profile>) => {
    const profileData = { ...data };
    const avatarBase64 = profileData.avatarBase64;

    if (avatarBase64 && !isSafeForSameDoc(avatarBase64)) {
      // Large image: save in sub-document
      profileData.avatarBase64 = "";
      profileData.hasSeparateAvatar = true;

      await setDoc(doc(db, "profile/main/images/avatar"), {
        base64: avatarBase64,
        updatedAt: serverTimestamp(),
      });
    } else if (avatarBase64) {
      // Small image: save in main document
      profileData.hasSeparateAvatar = false;
    }

    await setDoc(
      docRef,
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  return { getProfile, updateProfile };
};
