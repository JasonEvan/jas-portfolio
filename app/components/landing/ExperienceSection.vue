<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Experience } from "~/types/models";
import { Briefcase, Calendar, Globe } from "lucide-vue-next";

const { getAll } = useExperience();
const experiences = ref<Experience[]>([]);
const loading = ref(true);

onMounted(async () => {
  experiences.value = await getAll();
  loading.value = false;
});

const formatDate = (dateStr: string | null) => {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-"))
    return dateStr || "";
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;

  const year = parts[0];
  const month = parts[1];
  if (!year || !month) return dateStr;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIdx] || month;
  return `${monthName} ${year}`;
};
</script>

<template>
  <section id="experience" class="experience-section">
    <div class="container">
      <div class="section-header">
        <div class="badge-wrapper">
          <span class="badge">Career</span>
        </div>
        <h2 class="text-gradient">Professional Journey</h2>
        <p class="subtitle">
          My career path and the companies I've grown with.
        </p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="skeleton-timeline">
          <div v-for="i in 3" :key="i" class="skeleton-item glass"></div>
        </div>
      </div>

      <div v-else class="timeline">
        <div class="timeline-line"></div>

        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="timeline-item"
          :class="{
            'item-right': index % 2 !== 0,
            'item-left': index % 2 === 0,
          }"
        >
          <div class="timeline-dot">
            <div class="dot-inner"></div>
          </div>

          <div class="timeline-content glass hover-lift">
            <div class="content-header">
              <div class="company-logo">
                <img
                  v-if="exp.logoBase64"
                  :src="exp.logoBase64"
                  :alt="exp.company"
                />
                <Briefcase v-else :size="24" />
              </div>
              <div class="header-main">
                <h3 class="role-title">{{ exp.role }}</h3>
                <div class="company-row">
                  <span class="company-name">{{ exp.company }}</span>
                  <a
                    v-if="exp.companyUrl"
                    :href="exp.companyUrl"
                    target="_blank"
                    class="company-link"
                  >
                    <Globe :size="14" />
                  </a>
                </div>
              </div>
            </div>

            <div class="date-badge">
              <Calendar :size="14" />
              <span
                >{{ formatDate(exp.startDate) }} —
                {{ exp.isCurrent ? "Present" : formatDate(exp.endDate) }}</span
              >
            </div>

            <p class="description">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && experiences.length === 0"
        class="empty-state glass"
      >
        <p>Currently building more experiences. Stay tuned!</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  background: var(--color-background);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  margin-bottom: 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border: 1px solid rgba(var(--color-accent-rgb), 0.2);
}

.subtitle {
  color: var(--color-text-muted);
  max-width: 500px;
  margin-top: 12px;
  font-size: 1.125rem;
}

/* Timeline Layout */
.timeline {
  position: relative;
  margin-top: 40px;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--color-border-strong) 10%,
    var(--color-border-strong) 90%,
    transparent
  );
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  justify-content: flex-end;
  padding-right: 50%;
  position: relative;
  margin-bottom: 60px;
  width: 100%;
}

.timeline-item.item-right {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: 50%;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 30px;
  width: 20px;
  height: 20px;
  background: var(--color-background);
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-inner {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-accent);
}

.timeline-content {
  width: 90%;
  padding: 32px;
  border-radius: 24px;
  position: relative;
  transition: all 0.4s var(--ease-spring);
}

.item-left .timeline-content {
  margin-right: 40px;
}

.item-right .timeline-content {
  margin-left: 40px;
}

.content-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.company-logo {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface-raised);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.role-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.2;
}

.company-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.company-name {
  font-weight: 600;
  color: var(--color-accent);
}

.company-link {
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.company-link:hover {
  color: var(--color-text);
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.description {
  color: var(--color-text-muted);
  font-size: 0.938rem;
  line-height: 1.6;
  white-space: pre-line;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
  }

  .timeline-item {
    padding-right: 0;
    padding-left: 40px;
    justify-content: flex-start;
  }

  .timeline-item.item-right {
    padding-left: 40px;
  }

  .timeline-dot {
    left: 20px;
  }

  .item-left .timeline-content,
  .item-right .timeline-content {
    margin-left: 20px;
    margin-right: 0;
    width: 100%;
  }
}

/* Skeletons */
.skeleton-timeline {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.skeleton-item {
  height: 200px;
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

.empty-state {
  text-align: center;
  padding: 60px;
  border-radius: 24px;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--color-accent);
}
</style>
