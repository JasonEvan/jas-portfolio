import type { User } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<User | null>(null)
  const loading = ref(true)   // true sampai Firebase resolve state pertama kali

  const isLoggedIn = computed(() => !!user.value)

  const setUser    = (u: User | null) => { user.value = u }
  const clearUser  = () => { user.value = null }
  const setLoading = (v: boolean)    => { loading.value = v }

  return { user, loading, isLoggedIn, setUser, clearUser, setLoading }
})
