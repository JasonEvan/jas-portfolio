// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const store = useAuthStore()
  // Tunggu Firebase selesai cek token (hindari flash redirect)
  if (store.loading) {
    await new Promise<void>((resolve) => {
      const stop = watch(() => store.loading, (val) => {
        if (!val) { stop(); resolve() }
      })
    })
  }
  if (!store.isLoggedIn) return navigateTo('/admin/login')
})
