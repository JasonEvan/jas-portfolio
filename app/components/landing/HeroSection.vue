<script setup lang="ts">
const { splitTextReveal, revealOnScroll, magneticHover } = useGsap();

const heroTitle = ref(null);
const heroSubtitle = ref(null);
const heroCta = ref(null);

onMounted(async () => {
  await nextTick();

  if (heroTitle.value) splitTextReveal(heroTitle.value);
  if (heroSubtitle.value) revealOnScroll(heroSubtitle.value, 0.5);
  if (heroCta.value) {
    revealOnScroll(heroCta.value, 0.8);
    magneticHover(heroCta.value);
  }

  // Refresh scroll trigger after layout settles
  const { $ScrollTrigger } = useNuxtApp();
  if ($ScrollTrigger) ($ScrollTrigger as any).refresh();
});
</script>

<template>
  <section class="hero dot-grid">
    <div class="container">
      <div class="hero-content">
        <h1 ref="heroTitle" class="text-gradient">SOFTWARE<br />DEVELOPER</h1>
        <p ref="heroSubtitle" class="hero-subtitle">
          Building premium digital experiences with code and motion.
        </p>
        <div ref="heroCta" class="hero-actions">
          <BaseButton to="#projects" size="lg" class="glow"
            >Explore Work</BaseButton
          >
          <BaseButton to="#contact" variant="ghost" size="lg"
            >Contact Me</BaseButton
          >
        </div>
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-content {
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 32px 0 48px;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

@media (max-width: 1024px) {
  .hero-subtitle {
    font-size: 1.25rem;
  }
}
</style>
