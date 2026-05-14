<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowUpRight } from "lucide-vue-next";
import type { Project } from "~/types/models";

const { getAll } = useProjects();
const projects = ref<Project[]>([]);
const loading = ref(true);

onMounted(async () => {
  projects.value = await getAll(true); // Get published only
  loading.value = false;
});

const getStatusLabel = (status: string) => {
  return status === "done" ? "Completed" : "In Progress";
};
</script>

<template>
  <section id="projects" class="projects-section">
    <div class="container">
      <div class="section-header">
        <div class="badge-wrapper">
          <span class="badge">Portfolio</span>
        </div>
        <h2 class="text-gradient">Featured Projects</h2>
        <p class="subtitle">
          Exploring the boundary of possibilities through code and design.
        </p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="skeleton-grid">
          <div v-for="i in 3" :key="i" class="skeleton-card glass"></div>
        </div>
      </div>

      <div v-else class="projects-grid">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class="project-card glass hover-lift"
        >
          <div class="card-inner">
            <div class="project-image">
              <img
                v-if="project.coverThumb || project.coverBase64"
                :src="project.coverThumb || project.coverBase64!"
                :alt="project.title"
              />
              <div v-else class="placeholder">No Image</div>

              <div class="overlay">
                <div class="view-btn">
                  <span>View Project</span>
                  <ArrowUpRight :size="20" />
                </div>
              </div>
            </div>

            <div class="project-content">
              <div class="top-row">
                <span class="status" :class="project.status">{{
                  getStatusLabel(project.status)
                }}</span>
                <span class="index">0{{ index + 1 }}</span>
              </div>

              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ project.description }}</p>

              <div class="tech-stack">
                <span
                  v-for="tech in project.techStack?.slice(0, 4)"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.techStack?.length > 4"
                  class="tech-tag more"
                >
                  +{{ project.techStack.length - 4 }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="section-footer">
        <div class="line-accent"></div>
        <NuxtLink to="/projects" class="view-all">
          <span>Explore All Projects</span>
          <ArrowUpRight :size="18" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  margin-bottom: 64px;
  text-align: left;
}

.badge-wrapper {
  margin-bottom: 16px;
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  padding: 4px 12px;
  background: var(--color-accent-glow);
  border-radius: 100px;
  border: 1px solid rgba(79, 142, 247, 0.2);
}

.subtitle {
  color: var(--color-text-muted);
  max-width: 500px;
  margin-top: 12px;
  font-size: 1.125rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

.project-card {
  text-decoration: none;
  color: inherit;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s var(--ease-spring);
  display: block;
}

.card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-smooth);
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(7, 9, 15, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.project-card:hover .overlay {
  opacity: 1;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  color: black;
  padding: 12px 24px;
  border-radius: 100px;
  font-weight: 700;
  transform: translateY(20px);
  transition: transform 0.4s var(--ease-spring);
}

.project-card:hover .view-btn {
  transform: translateY(0);
}

.project-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 4px;
}

.status.done {
  color: var(--color-success);
  background: rgba(52, 211, 153, 0.1);
}

.status.not {
  color: var(--color-warning);
  background: rgba(251, 191, 36, 0.1);
}

.index {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-subtle);
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.project-desc {
  font-size: 0.938rem;
  color: var(--color-text-muted);
  margin-bottom: 24px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tech-tag {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  padding: 4px 10px;
  background: var(--color-surface-raised);
  border-radius: 6px;
}

.section-footer {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.125rem;
  padding: 16px 32px;
  border-radius: 100px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  transition: all 0.3s ease;
}

.view-all:hover {
  background: var(--color-surface-raised);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

/* Skeletons */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.skeleton-card {
  height: 450px;
  border-radius: 24px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.5;
  }
}

.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
</style>
