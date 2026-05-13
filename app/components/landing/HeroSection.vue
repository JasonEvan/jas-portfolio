<script setup lang="ts">
const { splitTextReveal, revealOnScroll, magneticHover } = useGsap()

const heroTitle = ref(null)
const heroSubtitle = ref(null)
const heroCta = ref(null)

onMounted(() => {
  if (heroTitle.value) splitTextReveal(heroTitle.value)
  if (heroSubtitle.value) revealOnScroll(heroSubtitle.value, 0.5)
  if (heroCta.value) {
    revealOnScroll(heroCta.value, 0.8)
    magneticHover(heroCta.value)
  }
})
</script>

<template>
  <section class="hero dot-grid">
    <div class="container">
      <div class="hero-content">
        <h1 ref="heroTitle" class="text-gradient">
          CREATIVE<br />DEVELOPER
        </h1>
        <p ref="heroSubtitle" class="hero-subtitle">
          Building premium digital experiences with code and motion.
        </p>
        <div ref="heroCta" class="hero-actions">
          <BaseButton size="lg" class="glow">Explore Work</BaseButton>
          <BaseButton variant="ghost" size="lg">Contact Me</BaseButton>
        </div>
      </div>
      
      <div class="hero-visual">
        <LanyardCanvas />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 40px;
}

.hero-content {
  z-index: 10;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  max-width: 500px;
  margin: 32px 0 48px;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.hero-visual {
  position: relative;
  z-index: 5;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 60px;
  }
  
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
}
</style>
