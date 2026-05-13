// composables/useAuth.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

export const useAuth = () => {
  const { auth }  = useFirebase()
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    authStore.setUser(cred.user)
    await navigateTo('/admin')
  }

  const logout = async () => {
    await signOut(auth)
    authStore.clearUser()
    await navigateTo('/admin/login')
  }

  /**
   * Dipanggil sekali di app.vue.
   * Memantau perubahan auth state secara realtime.
   */
  const initAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
      authStore.setUser(user)
      authStore.setLoading(false)
    })
  }

  return { login, logout, initAuthListener }
}
