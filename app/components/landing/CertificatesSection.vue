<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Certificate } from "~/types/models";
import { Award, Calendar, ExternalLink } from "lucide-vue-next";
import { useCertificates } from "~/composables/useCertificates";

const { getAll } = useCertificates();
const certificates = ref<Certificate[]>([]);
const loading = ref(true);

onMounted(async () => {
  certificates.value = await getAll();
  loading.value = false;
});

const formatDate = (dateStr: string | null) => {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-"))
    return dateStr || "";
  const parts = dateStr.split("-");
  const y = parts[0];
  const m = parts[1];
  if (!y || !m) return dateStr;

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
    "Des",
  ];
  const monthIdx = parseInt(m, 10) - 1;
  const monthName = monthNames[monthIdx] || m;
  return `${monthName} ${y}`;
};
</script>

<template>
  <section id="certificates" class="certificates-section">
    <div class="container">
      <div class="section-header">
        <div class="badge-wrapper">
          <span class="badge">Accolades</span>
        </div>
        <h2 class="text-gradient">Certifications</h2>
        <p class="subtitle">
          Continuous learning and professional validations of my expertise.
        </p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="skeleton-grid">
          <div v-for="i in 4" :key="i" class="skeleton-card glass"></div>
        </div>
      </div>

      <div v-else class="certs-grid">
        <div
          v-for="cert in certificates"
          :key="cert.id"
          class="cert-item glass hover-lift"
        >
          <div class="cert-visual">
            <img
              v-if="cert.imageBase64"
              :src="cert.imageBase64"
              :alt="cert.title"
            />
            <div v-else class="cert-placeholder"><Award :size="48" /></div>

            <div class="cert-overlay">
              <a
                v-if="cert.credentialUrl"
                :href="cert.credentialUrl"
                target="_blank"
                class="view-cert"
              >
                <span>View Credential</span>
                <ExternalLink :size="16" />
              </a>
            </div>
          </div>

          <div class="cert-body">
            <h3 class="cert-title">{{ cert.title }}</h3>
            <p class="cert-issuer">{{ cert.issuer }}</p>
            <div class="cert-footer">
              <span class="date"
                ><Calendar :size="14" /> {{ formatDate(cert.issueDate) }}</span
              >
              <span v-if="cert.expiryDate" class="expiry"
                >Expires: {{ formatDate(cert.expiryDate) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && certificates.length === 0"
        class="empty-state glass"
      >
        <p>Certificates are being validated. Coming soon!</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certificates-section {
  padding: 120px 0;
  background: var(--color-bg);
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  margin-bottom: 64px;
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
  color: var(--color-accent-teal);
  padding: 4px 12px;
  background: rgba(45, 212, 191, 0.1);
  border-radius: 100px;
  border: 1px solid rgba(45, 212, 191, 0.2);
}

.subtitle {
  color: var(--color-text-muted);
  max-width: 500px;
  margin-top: 12px;
  font-size: 1.125rem;
}

.certs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.cert-item {
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s var(--ease-spring);
}

.cert-visual {
  position: relative;
  aspect-ratio: 3/2;
  background: var(--color-surface-raised);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cert-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.cert-item:hover .cert-visual img {
  transform: scale(1.1);
}

.cert-placeholder {
  color: var(--color-text-muted);
  opacity: 0.3;
}

.cert-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cert-item:hover .cert-overlay {
  opacity: 1;
}

.view-cert {
  background: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transform: translateY(10px);
  transition: transform 0.3s var(--ease-spring);
}

.cert-item:hover .view-cert {
  transform: translateY(0);
}

.cert-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cert-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.4;
}
.cert-issuer {
  color: var(--color-accent-teal);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 16px;
}
.cert-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.date,
.expiry {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.skeleton-card {
  height: 320px;
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
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--color-accent-teal);
}
</style>
