<script setup lang="ts">
const { getAll } = useSkills();
const { data: skills, pending } = await useAsyncData("skills", () => getAll());

const categories = [
  "Languages",
  "Frameworks & Libraries",
  "Databases",
  "Tools",
  "Others",
];

const getSkillsByCategory = (category: string) => {
  return skills.value?.filter((s) => s.category === category) || [];
};
</script>

<template>
  <section id="skills" class="skills-section">
    <div class="container">
      <div class="section-header" v-gsap-reveal>
        <h2 class="section-title">
          Technical <span class="text-accent">Expertise</span>
        </h2>
        <p class="section-subtitle">
          The tools and technologies I use to bring ideas to life.
        </p>
      </div>

      <div v-if="pending" class="loading-state">
        <div class="loader"></div>
      </div>

      <div v-else class="categories-grid">
        <div
          v-for="cat in categories"
          :key="cat"
          v-show="getSkillsByCategory(cat).length > 0"
          class="category-card glass"
          v-gsap-reveal
        >
          <h3 class="category-title">{{ cat }}</h3>
          <div class="skills-list">
            <div
              v-for="skill in getSkillsByCategory(cat)"
              :key="skill.id"
              class="skill-tag"
              :title="`${skill.name} - ${skill.level}%`"
            >
              <img
                v-if="skill.iconBase64"
                :src="skill.iconBase64"
                :alt="skill.name"
                class="skill-icon"
              />
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-progress-mini">
                <div
                  class="progress-fill"
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  margin-bottom: 64px;
  text-align: center;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  font-family: var(--font-heading);
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

.category-card {
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.05);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--color-accent);
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.skill-tag:hover {
  border-color: var(--color-accent);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(var(--color-accent-rgb), 0.2);
}

.skill-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.skill-name {
  font-size: 0.938rem;
  font-weight: 500;
}

.skill-progress-mini {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  opacity: 0.5;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-surface-raised);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
