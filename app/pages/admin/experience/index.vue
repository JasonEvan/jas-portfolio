<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Experience } from "~/types/models";
import {
  Plus,
  Search,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
  GripVertical,
} from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { getAll, create, update, remove } = useExperience();

const experiences = ref<Experience[]>([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const editingExperience = ref<Experience | null>(null);
const searchQuery = ref("");

const fetchExperiences = async () => {
  loading.value = true;
  try {
    experiences.value = await getAll();
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    toast.error("Gagal mengambil data pengalaman");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExperiences);

const filteredExperiences = computed(() => {
  if (!searchQuery.value) return experiences.value;
  const q = searchQuery.value.toLowerCase();
  return experiences.value.filter(
    (e) =>
      e.company.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );
});

const openCreate = () => {
  editingExperience.value = null;
  showForm.value = true;
};

const openEdit = (exp: Experience) => {
  editingExperience.value = { ...exp };
  showForm.value = true;
};

const handleSubmit = async (payload: Partial<Experience>) => {
  saving.value = true;
  try {
    if (editingExperience.value?.id) {
      await update(editingExperience.value.id, payload);
      toast.success("Pengalaman berhasil diperbarui");
    } else {
      await create(payload);
      toast.success("Pengalaman berhasil ditambahkan");
    }
    showForm.value = false;
    await fetchExperiences();
  } catch (err) {
    console.error("Save error:", err);
    toast.error("Gagal menyimpan pengalaman");
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus pengalaman ini?")) return;

  try {
    await remove(id);
    toast.success("Pengalaman berhasil dihapus");
    await fetchExperiences();
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Gagal menghapus pengalaman");
  }
};
</script>

<template>
  <div class="experience-admin">
    <div class="header">
      <div class="title-area">
        <h1>Pengalaman Kerja</h1>
        <p class="subtitle">
          Kelola riwayat karir dan pengalaman profesional Anda
        </p>
      </div>
      <BaseButton @click="openCreate">
        <template #icon>
          <Plus :size="18" />
        </template>
        Tambah Pengalaman
      </BaseButton>
    </div>

    <!-- Search & Toolbar -->
    <div v-if="!showForm" class="toolbar glass">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari perusahaan, peran, atau deskripsi..."
        />
      </div>
      <div class="stats">
        <span
          >Total: <strong>{{ experiences.length }}</strong></span
        >
      </div>
    </div>

    <!-- Form Section -->
    <transition name="fade-slide">
      <div v-if="showForm" class="form-container glass glow">
        <div class="form-header">
          <h3>
            {{
              editingExperience ? "Edit Pengalaman" : "Tambah Pengalaman Baru"
            }}
          </h3>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <AdminExperienceForm
          :initialData="editingExperience"
          :loading="saving"
          @submit="handleSubmit"
          @cancel="showForm = false"
        />
      </div>
    </transition>

    <!-- List Section -->
    <div v-if="!showForm" class="list-section">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Memuat data pengalaman...</p>
      </div>

      <div
        v-else-if="filteredExperiences.length === 0"
        class="empty-state glass"
      >
        <p v-if="searchQuery">
          Tidak ada pengalaman yang sesuai dengan pencarian.
        </p>
        <template v-else>
          <p>Belum ada pengalaman yang ditambahkan.</p>
          <BaseButton variant="secondary" @click="openCreate"
            >Mulai Tambah Pengalaman</BaseButton
          >
        </template>
      </div>

      <div v-else class="experience-list">
        <div
          v-for="exp in filteredExperiences"
          :key="exp.id"
          class="experience-item glass"
        >
          <div class="exp-logo">
            <img
              v-if="exp.logoBase64"
              :src="exp.logoBase64"
              :alt="exp.company"
            />
            <div v-else class="logo-placeholder">
              <Briefcase :size="24" />
            </div>
          </div>

          <div class="exp-content">
            <div class="exp-header">
              <div>
                <h4>{{ exp.role }}</h4>
                <p class="company-name">{{ exp.company }}</p>
              </div>
              <div class="exp-date">
                <Calendar :size="14" />
                <span
                  >{{ exp.startDate }} —
                  {{ exp.isCurrent ? "Present" : exp.endDate }}</span
                >
              </div>
            </div>

            <p class="exp-description">{{ exp.description }}</p>
          </div>

          <div class="exp-actions">
            <button @click="openEdit(exp)" class="icon-btn edit" title="Edit">
              <Edit2 :size="16" />
            </button>
            <button
              @click="handleDelete(exp.id!)"
              class="icon-btn delete"
              title="Hapus"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experience-admin {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-radius: 16px;
  margin-bottom: 32px;
  gap: 20px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
}

.search-box input {
  background: transparent;
  border: none;
  color: var(--color-text);
  width: 100%;
  outline: none;
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
  margin-bottom: 32px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.experience-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  gap: 20px;
  transition: transform 0.2s;
}

.experience-item:hover {
  transform: translateX(5px);
}

.exp-drag-handle {
  color: var(--color-text-muted);
  cursor: grab;
  opacity: 0.3;
}

.exp-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface-raised);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exp-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  color: var(--color-text-muted);
}

.exp-content {
  flex: 1;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.exp-header h4 {
  font-size: 1.125rem;
  font-weight: 700;
}

.company-name {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.875rem;
}

.exp-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 100px;
}

.exp-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exp-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: var(--color-text);
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
}

.icon-btn.delete:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.loading-state {
  text-align: center;
  padding: 100px;
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
