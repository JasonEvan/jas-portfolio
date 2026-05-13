<script setup lang="ts">
const navRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const { $gsap: gsap } = useNuxtApp()
  if (gsap && navRef.value) {
    (gsap as any).from(navRef.value, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      delay: 0.5
    })
  }
})

const navLinks = [
  { label: 'About', to: '#about' },
  { label: 'Skills', to: '#skills' },
  { label: 'Projects', to: '#projects' },
  { label: 'Experience', to: '#experience' },
  { label: 'Contact', to: '#contact' },
]
</script>

<template>
  <nav ref="navRef" class="navbar glass">
    <div class="container">
      <NuxtLink to="/" class="logo text-gradient">
        JAS
      </NuxtLink>

      <div class="links">
        <a v-for="link in navLinks" :key="link.to" :href="link.to" class="link">
          {{ link.label }}
        </a>
      </div>

      <div class="actions">
        <NuxtLink to="/admin/login" class="admin-link">
          Admin
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 800px;
  height: 64px;
  border-radius: 32px;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 32px;
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.5rem;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 32px;
}

.link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--color-text);
}

.admin-link {
  font-size: 0.75rem;
  color: var(--color-text-subtle);
  text-decoration: none;
  border: 1px solid var(--color-border);
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.admin-link:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .links {
    display: none;
  }
}
</style>
