<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

import { ref, onMounted, computed } from "vue";

const { getAll: getProjects } = useProjects();
const { getAll: getExperience } = useExperience();
const { getAll: getSkills } = useSkills();
const { getAll: getTestimonials } = useTestimonials();

const projectCount = ref(0);
const experienceCount = ref(0);
const skillCount = ref(0);
const testimonialCount = ref(0);
const loading = ref(true);

const stats = computed(() => [
  { label: "Total Proyek", value: projectCount.value, icon: "FolderOpen" },
  { label: "Pengalaman", value: experienceCount.value, icon: "Briefcase" },
  { label: "Skill", value: skillCount.value, icon: "Zap" },
  { label: "Testimoni", value: testimonialCount.value, icon: "MessageSquare" },
]);

onMounted(async () => {
  loading.value = true;
  try {
    const [projects, experience, skills, testimonials] = await Promise.all([
      getProjects(),
      getExperience(),
      getSkills(),
      getTestimonials(),
    ]);

    projectCount.value = projects.length;
    experienceCount.value = experience.length;
    skillCount.value = skills.length;
    testimonialCount.value = testimonials.length;
  } catch (err) {
    console.error("Failed to load dashboard stats:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="dashboard-container">
    <transition name="fade">
      <div v-if="loading" class="loading-overlay glass">
        <div class="loader"></div>
        <p>Menyiapkan Dashboard...</p>
      </div>

      <div v-else class="dashboard">
        <div class="stats-grid">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card glass glow"
          >
            <div class="stat-info">
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value">{{ stat.value }}</p>
            </div>
          </div>
        </div>

        <div class="quick-actions glass">
          <h3>Aksi Cepat</h3>
          <div class="actions-grid">
            <NuxtLink to="/admin/projects/create" class="action-btn">
              Tambah Proyek Baru
            </NuxtLink>
            <NuxtLink to="/admin/experience/create" class="action-btn">
              Tambah Pengalaman
            </NuxtLink>
            <NuxtLink to="/admin/profile" class="action-btn">
              Edit Profil
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 24px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 32px;
  border-radius: 24px;
  text-align: center;
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: var(--font-heading);
}

.quick-actions {
  padding: 32px;
  border-radius: 24px;
}

h3 {
  margin-bottom: 24px;
}

.actions-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  background: var(--color-surface-raised);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-accent);
  color: white;
  transform: translateY(-2px);
}
</style>
