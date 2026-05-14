// app/plugins/firebase.client.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey:            config.public.firebaseApiKey,
    authDomain:        config.public.firebaseAuthDomain,
    projectId:         config.public.firebaseProjectId,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId:             config.public.firebaseAppId,
  }

  // Hindari inisialisasi ganda saat hot reload
  const app = (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) as FirebaseApp
  const auth = getAuth(app) as Auth
  const db = getFirestore(app) as Firestore

  return {
    provide: { 
      firebaseApp: app, 
      auth, 
      db 
    },
  }
})
