<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowLeft, Search } from "lucide-vue-next";
import type { Project } from "~/types/models";

const { getAll } = useProjects();
const projects = ref<Project[]>([]);
const loading = ref(true);
const searchQuery = ref("");

onMounted(async () => {
  projects.value = await getAll(true);
  loading.value = false;
});

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;
  const q = searchQuery.value.toLowerCase();
  return projects.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.techStack?.some((t) => t.toLowerCase().includes(q)),
  );
});
</script>

<template>
  <div class="projects-archive-page">
    <div class="container">
      <header class="page-header">
        <NuxtLink to="/" class="back-link">
          <ArrowLeft :size="18" />
          <span>Back to Home</span>
        </NuxtLink>

        <h1 class="text-gradient">All Projects</h1>
        <p class="subtitle">
          A collection of my work, experiments, and open-source contributions.
        </p>

        <div class="search-wrapper glass">
          <Search :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects by name or technology..."
          />
        </div>
      </header>

      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Discovering projects...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="empty-state glass">
        <p>No projects found matching your search.</p>
      </div>

      <div v-else class="projects-grid">
        <NuxtLink
          v-for="project in filteredProjects"
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
            </div>

            <div class="project-content">
              <div class="status-row">
                <span class="status" :class="project.status">{{
                  project.status === "done" ? "Completed" : "In Progress"
                }}</span>
              </div>
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ project.description }}</p>

              <div class="tech-stack">
                <span
                  v-for="tech in project.techStack?.slice(0, 3)"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.techStack?.length > 3"
                  class="tech-tag more"
                >
                  +{{ project.techStack.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-archive-page {
  padding: 120px 0;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 80px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 32px;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--color-text);
}

h1 {
  font-size: clamp(3rem, 8vw, 5rem);
  margin-bottom: 16px;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 48px;
}

.search-wrapper {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 8px 24px;
  border-radius: 100px;
  gap: 16px;
}

.search-icon {
  color: var(--color-text-muted);
}

.search-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: 12px 0;
  font-size: 1rem;
  outline: none;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

.project-card {
  text-decoration: none;
  color: inherit;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s var(--ease-spring);
}

.card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-image {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--color-surface-raised);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-row {
  margin-bottom: 12px;
}

.status {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 8px;
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

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.project-desc {
  font-size: 0.938rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-stack {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  background: var(--color-surface-raised);
  padding: 4px 10px;
  border-radius: 6px;
}

.loading-state {
  text-align: center;
  padding: 100px 0;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px;
  border-radius: 24px;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}
</style>
