// composables/useFirebase.ts
export const useFirebase = () => {
  const { $auth, $db } = useNuxtApp()
  return { auth: $auth, db: $db }
}
