<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Project } from "~/types/models";
import {
  Plus,
  Search,
  ExternalLink,
  Github,
  Eye,
  Edit2,
  Trash2,
} from "lucide-vue-next";

definePageMeta({
  layout: "admin",
});

const { getAll, create, update, remove } = useProjects();

const projects = ref<Project[]>([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const editingProject = ref<Project | null>(null);
const searchQuery = ref("");

const fetchProjects = async () => {
  loading.value = true;
  try {
    projects.value = await getAll();
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    toast.error("Gagal mengambil data proyek");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProjects);

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;
  const q = searchQuery.value.toLowerCase();
  return projects.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.techStack?.some((t) => t.toLowerCase().includes(q)),
  );
});

const openCreate = () => {
  editingProject.value = null;
  showForm.value = true;
};

const openEdit = (project: Project) => {
  editingProject.value = { ...project };
  showForm.value = true;
};

const handleSubmit = async (payload: Partial<Project>) => {
  saving.value = true;
  try {
    if (editingProject.value?.id) {
      await update(editingProject.value.id, payload);
      toast.success("Proyek berhasil diperbarui");
    } else {
      await create(payload);
      toast.success("Proyek berhasil ditambahkan");
    }
    showForm.value = false;
    await fetchProjects();
  } catch (err) {
    console.error("Save error:", err);
    toast.error("Gagal menyimpan proyek");
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;

  try {
    await remove(id);
    toast.success("Proyek berhasil dihapus");
    await fetchProjects();
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Gagal menghapus proyek");
  }
};
</script>

<template>
  <div class="projects-admin">
    <div class="header">
      <div class="title-area">
        <h1>Manajemen Proyek</h1>
        <p class="subtitle">
          Kelola portofolio karya dan proyek yang telah Anda kerjakan
        </p>
      </div>
      <BaseButton @click="openCreate">
        <template #icon>
          <Plus :size="18" />
        </template>
        Tambah Proyek
      </BaseButton>
    </div>

    <!-- Search & Filters -->
    <div v-if="!showForm" class="toolbar glass">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari proyek berdasarkan judul atau teknologi..."
        />
      </div>
      <div class="stats">
        <span
          >Total: <strong>{{ projects.length }}</strong></span
        >
      </div>
    </div>

    <!-- Form Section -->
    <transition name="fade-slide">
      <div v-if="showForm" class="form-container glass glow">
        <div class="form-header">
          <h3>{{ editingProject ? "Edit Proyek" : "Tambah Proyek Baru" }}</h3>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <AdminProjectForm
          :initialData="editingProject"
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
        <p>Memuat data proyek...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="empty-state glass">
        <p v-if="searchQuery">Tidak ada proyek yang sesuai dengan pencarian.</p>
        <template v-else>
          <p>Belum ada proyek yang ditambahkan.</p>
          <BaseButton variant="secondary" @click="openCreate"
            >Mulai Tambah Proyek</BaseButton
          >
        </template>
      </div>

      <div v-else class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card glass"
        >
          <div class="project-thumbnail">
            <img
              v-if="project.coverBase64"
              :src="project.coverBase64"
              :alt="project.title"
            />
            <div v-else class="thumb-placeholder">No Thumbnail</div>

            <div class="status-badge" :class="project.status">
              {{ project.status === "done" ? "Done" : "In Progress" }}
            </div>

            <div v-if="!project.isPublished" class="draft-badge">Draft</div>
          </div>

          <div class="project-info">
            <div class="project-main">
              <h4 class="project-title">{{ project.title }}</h4>
              <p class="project-desc">{{ project.description }}</p>

              <div class="tech-tags">
                <span
                  v-for="tech in project.techStack?.slice(0, 3)"
                  :key="tech"
                  class="tag"
                >
                  {{ tech }}
                </span>
                <span v-if="project.techStack?.length > 3" class="tag more">
                  +{{ project.techStack.length - 3 }}
                </span>
              </div>
            </div>

            <div class="project-footer">
              <div class="external-links">
                <a
                  v-if="project.repoUrl"
                  :href="project.repoUrl"
                  target="_blank"
                  title="GitHub"
                >
                  <Github :size="16" />
                </a>
                <a
                  v-if="project.projectUrl"
                  :href="project.projectUrl"
                  target="_blank"
                  title="Live Site"
                >
                  <ExternalLink :size="16" />
                </a>
              </div>

              <div class="actions">
                <button
                  @click="openEdit(project)"
                  class="icon-btn edit"
                  title="Edit"
                >
                  <Edit2 :size="16" />
                </button>
                <button
                  @click="handleDelete(project.id!)"
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
    </div>
  </div>
</template>

<style scoped>
.projects-admin {
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.project-card {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background: var(--color-surface-raised);
}

.project-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-weight: 600;
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.done {
  background: #10b981;
  color: white;
}

.status-badge.not {
  background: #f59e0b;
  color: white;
}

.draft-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #6b7280;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.project-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-main {
  flex: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.project-desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-muted);
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.external-links {
  display: flex;
  gap: 12px;
}

.external-links a {
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.external-links a:hover {
  color: var(--color-accent);
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.icon-btn.delete:hover {
  border-color: #ef4444;
  color: #ef4444;
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
