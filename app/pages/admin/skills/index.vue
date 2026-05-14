<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Skill } from "~/types/models";

definePageMeta({
  layout: "admin",
});

const { getAll, create, update, remove } = useSkills();

const skills = ref<Skill[]>([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const editingSkill = ref<Skill | null>(null);

const fetchSkills = async () => {
  loading.value = true;
  try {
    skills.value = await getAll();
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    toast.error("Gagal mengambil data skill");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSkills);

const openCreate = () => {
  editingSkill.value = null;
  showForm.value = true;
};

const openEdit = (skill: Skill) => {
  editingSkill.value = { ...skill };
  showForm.value = true;
};

const handleSubmit = async (payload: Partial<Skill>) => {
  saving.value = true;
  try {
    if (editingSkill.value?.id) {
      await update(editingSkill.value.id, payload);
      toast.success("Skill berhasil diperbarui");
    } else {
      await create(payload);
      toast.success("Skill berhasil ditambahkan");
    }
    showForm.value = false;
    await fetchSkills();
  } catch (err) {
    console.error("Save error:", err);
    toast.error("Gagal menyimpan skill");
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus skill ini?")) return;

  try {
    await remove(id);
    toast.success("Skill berhasil dihapus");
    await fetchSkills();
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Gagal menghapus skill");
  }
};

const getCategoryClass = (category: string) => {
  return category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
};
</script>

<template>
  <div class="skills-admin">
    <div class="header">
      <div class="title-area">
        <h1>Manajemen Skill</h1>
        <p class="subtitle">
          Kelola daftar keahlian yang ditampilkan di portfolio
        </p>
      </div>
      <BaseButton @click="openCreate">
        <template #icon>
          <span class="icon-plus">+</span>
        </template>
        Tambah Skill
      </BaseButton>
    </div>

    <!-- Form Section -->
    <transition name="fade-slide">
      <div v-if="showForm" class="form-container glass glow">
        <div class="form-header">
          <h3>{{ editingSkill ? "Edit Skill" : "Tambah Skill Baru" }}</h3>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <AdminSkillForm
          :initialData="editingSkill"
          :loading="saving"
          @submit="handleSubmit"
          @cancel="showForm = false"
        />
      </div>
    </transition>

    <!-- List Section -->
    <div class="list-section">
      <div v-if="loading" class="loading-state">
        <p>Memuat data skill...</p>
      </div>

      <div v-else-if="skills.length === 0" class="empty-state glass">
        <p>Belum ada skill yang ditambahkan.</p>
        <BaseButton variant="secondary" @click="openCreate"
          >Mulai Tambah Skill</BaseButton
        >
      </div>

      <div v-else class="skills-grid">
        <div v-for="skill in skills" :key="skill.id" class="skill-item glass">
          <div class="skill-icon">
            <img
              v-if="skill.iconBase64"
              :src="skill.iconBase64"
              :alt="skill.name"
            />
            <div v-else class="icon-placeholder">{{ skill.name[0] }}</div>
          </div>

          <div class="skill-info">
            <div class="skill-top">
              <span
                class="category-badge"
                :class="getCategoryClass(skill.category)"
              >
                {{ skill.category }}
              </span>
            </div>
            <h4 class="skill-name">{{ skill.name }}</h4>
            <div class="proficiency-bar">
              <div class="bar-fill" :style="{ width: skill.level + '%' }"></div>
            </div>
            <span class="level-text">{{ skill.level }}%</span>
          </div>

          <div class="skill-actions">
            <button
              @click="openEdit(skill)"
              class="action-btn edit"
              title="Edit"
            >
              Edit
            </button>
            <button
              @click="handleDelete(skill.id!)"
              class="action-btn delete"
              title="Hapus"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-admin {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #888 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--color-text-muted);
}

.form-container {
  margin-bottom: 40px;
  padding: 32px;
  border-radius: 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-text);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skill-item {
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.skill-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-surface-raised);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.skill-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.icon-placeholder {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

.skill-info {
  flex: 1;
}

.skill-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.1);
}

.category-badge.languages {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}
.category-badge.frameworks-libraries {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}
.category-badge.databases {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}
.category-badge.tools {
  color: #f472b6;
  background: rgba(244, 114, 182, 0.1);
}
.category-badge.others {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
}

.order-badge {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.proficiency-bar {
  height: 6px;
  background: var(--color-surface);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 3px;
}

.level-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.skill-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-surface-raised);
}

.action-btn.delete:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 60px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-state {
  text-align: center;
  padding: 100px;
  color: var(--color-text-muted);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
