<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const stats = [
  { label: 'Total Proyek', value: 12, icon: 'FolderOpen' },
  { label: 'Pengalaman', value: 5, icon: 'Briefcase' },
  { label: 'Skill', value: 24, icon: 'Zap' },
  { label: 'Testimoni', value: 8, icon: 'MessageSquare' },
]
</script>

<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card glass glow">
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
          Edit Profil & Lanyard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
