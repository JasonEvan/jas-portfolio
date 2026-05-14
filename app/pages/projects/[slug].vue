<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
} from "lucide-vue-next";
import type { Project } from "~/types/models";

const route = useRoute();
const router = useRouter();
const { getBySlug } = useProjects();

const project = ref<Project | null>(null);
const loading = ref(true);

onMounted(async () => {
  const slug = route.params.slug as string;
  const data = await getBySlug(slug);
  if (!data) {
    router.push("/projects");
    return;
  }
  project.value = data;
  loading.value = false;
});

const getStatusLabel = (status: string) => {
  return status === "done" ? "Completed" : "In Progress";
};
</script>

<template>
  <div class="project-detail-page">
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>

    <template v-else-if="project">
      <!-- Hero Header -->
      <section class="detail-hero">
        <div class="container">
          <NuxtLink to="/#projects" class="back-btn">
            <ArrowLeft :size="20" />
            <span>Back to Projects</span>
          </NuxtLink>

          <div class="hero-content">
            <div class="meta">
              <span class="status-badge" :class="project.status">
                <component
                  :is="project.status === 'done' ? CheckCircle2 : Clock"
                  :size="14"
                />
                {{ getStatusLabel(project.status) }}
              </span>
              <span class="date">
                <Calendar :size="14" />
                Featured Project
              </span>
            </div>

            <h1 class="project-title">{{ project.title }}</h1>
            <p class="project-summary">{{ project.description }}</p>

            <div class="action-links">
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                class="btn glass"
              >
                <Github :size="20" />
                <span>Source Code</span>
              </a>
              <a
                v-if="project.projectUrl"
                :href="project.projectUrl"
                target="_blank"
                class="btn primary"
              >
                <ExternalLink :size="20" />
                <span>Live Demo</span>
              </a>
            </div>
          </div>
        </div>

        <div class="hero-image-wrapper">
          <div class="container">
            <img
              :src="project.coverBase64!"
              :alt="project.title"
              class="main-image glow"
            />
          </div>
          <div class="bg-glow"></div>
        </div>
      </section>

      <!-- Content Grid -->
      <section class="detail-body">
        <div class="container">
          <div class="content-grid">
            <!-- Left: Main Content -->
            <div class="main-content">
              <div class="section">
                <h3>About this project</h3>
                <div
                  class="prose"
                  v-html="project.content || project.description"
                ></div>
              </div>

              <!-- Showcase Images -->
              <div
                v-if="project.images && project.images.length > 0"
                class="showcase-section"
              >
                <h3>Project Showcase</h3>
                <div class="showcase-grid">
                  <div
                    v-for="(img, idx) in project.images"
                    :key="idx"
                    class="showcase-item glass"
                  >
                    <img
                      :src="img"
                      :alt="`${project.title} showcase ${idx + 1}`"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Sidebar -->
            <aside class="sidebar">
              <div class="sidebar-card glass">
                <h4>Technologies</h4>
                <div class="tech-list">
                  <span
                    v-for="tech in project.techStack"
                    :key="tech"
                    class="tech-item"
                  >
                    <Tag :size="14" />
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="sidebar-card glass share">
                <h4>Let's connect</h4>
                <p>
                  Loved this project? Feel free to reach out for collaborations.
                </p>
                <NuxtLink to="/#contact" class="contact-link"
                  >Get in touch</NuxtLink
                >
              </div>
            </aside>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  padding-bottom: 100px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.detail-hero {
  padding-top: 140px;
  position: relative;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 48px;
  transition: color 0.3s;
}

.back-btn:hover {
  color: var(--color-text);
}

.hero-content {
  text-align: center;
  margin-bottom: 64px;
}

.meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.813rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 100px;
}

.status-badge.done {
  color: var(--color-success);
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.status-badge.not {
  color: var(--color-warning);
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.813rem;
  color: var(--color-text-muted);
}

.project-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  margin-bottom: 24px;
}

.project-summary {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.action-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
}

.btn.primary {
  background: var(--color-text);
  color: var(--color-bg);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
}

.btn.glass:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.hero-image-wrapper {
  position: relative;
  margin-bottom: 100px;
}

.main-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 32px;
  border: 1px solid var(--color-border-strong);
  position: relative;
  z-index: 1;
}

.bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: var(--color-accent);
  filter: blur(120px);
  opacity: 0.15;
  z-index: 0;
}

/* Body Content */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 64px;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

h3 {
  font-size: 2rem;
  margin-bottom: 24px;
}

.prose {
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1.8;
}

.showcase-section {
  margin-top: 80px;
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.showcase-item {
  border-radius: 24px;
  overflow: hidden;
  padding: 8px;
}

.showcase-item img {
  width: 100%;
  border-radius: 16px;
  display: block;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  padding: 24px;
  border-radius: 24px;
}

.sidebar-card h4 {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  color: var(--color-text);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
}

.sidebar-card.share p {
  font-size: 0.938rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.contact-link {
  display: inline-block;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 700;
  border-bottom: 2px solid var(--color-accent);
}

.loading-overlay {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
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
