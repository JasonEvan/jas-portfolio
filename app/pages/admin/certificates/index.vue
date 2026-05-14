<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Certificate } from "~/types/models";
import {
  Plus,
  Search,
  Award,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-vue-next";
import { useCertificates } from "~/composables/useCertificates";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { getAll, create, update, remove } = useCertificates();

const certificates = ref<Certificate[]>([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const editingCertificate = ref<Certificate | null>(null);
const searchQuery = ref("");

const fetchCertificates = async () => {
  loading.value = true;
  try {
    certificates.value = await getAll();
  } catch (err) {
    console.error("Failed to fetch certificates:", err);
    toast.error("Gagal mengambil data sertifikat");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCertificates);

const filteredCertificates = computed(() => {
  if (!searchQuery.value) return certificates.value;
  const q = searchQuery.value.toLowerCase();
  return certificates.value.filter(
    (c) =>
      c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q),
  );
});

const openCreate = () => {
  editingCertificate.value = null;
  showForm.value = true;
};

const openEdit = (cert: Certificate) => {
  editingCertificate.value = { ...cert };
  showForm.value = true;
};

const handleSubmit = async (payload: Partial<Certificate>) => {
  saving.value = true;
  try {
    if (editingCertificate.value?.id) {
      await update(editingCertificate.value.id, payload);
      toast.success("Sertifikat berhasil diperbarui");
    } else {
      await create(payload);
      toast.success("Sertifikat berhasil ditambahkan");
    }
    showForm.value = false;
    await fetchCertificates();
  } catch (err) {
    console.error("Save error:", err);
    toast.error("Gagal menyimpan sertifikat");
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) return;

  try {
    await remove(id);
    toast.success("Sertifikat berhasil dihapus");
    await fetchCertificates();
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Gagal menghapus sertifikat");
  }
};

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
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const monthIdx = parseInt(m, 10) - 1;
  const monthName = monthNames[monthIdx] || m;
  return `${monthName} ${y}`;
};
</script>

<template>
  <div class="certificates-admin">
    <div class="header">
      <div class="title-area">
        <h1>Sertifikasi</h1>
        <p class="subtitle">Kelola daftar sertifikasi dan penghargaan Anda</p>
      </div>
      <BaseButton @click="openCreate">
        <template #icon>
          <Plus :size="18" />
        </template>
        Tambah Sertifikat
      </BaseButton>
    </div>

    <div v-if="!showForm" class="toolbar glass">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul atau penerbit..."
        />
      </div>
      <div class="stats">
        <span
          >Total: <strong>{{ certificates.length }}</strong></span
        >
      </div>
    </div>

    <transition name="fade-slide">
      <div v-if="showForm" class="form-container glass glow">
        <div class="form-header">
          <h3>
            {{
              editingCertificate ? "Edit Sertifikat" : "Tambah Sertifikat Baru"
            }}
          </h3>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <AdminCertificateForm
          :initialData="editingCertificate"
          :loading="saving"
          @submit="handleSubmit"
          @cancel="showForm = false"
        />
      </div>
    </transition>

    <div v-if="!showForm" class="list-section">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Memuat data sertifikat...</p>
      </div>

      <div
        v-else-if="filteredCertificates.length === 0"
        class="empty-state glass"
      >
        <p v-if="searchQuery">Tidak ada sertifikat yang sesuai.</p>
        <template v-else>
          <p>Belum ada sertifikat yang ditambahkan.</p>
          <BaseButton variant="secondary" @click="openCreate"
            >Mulai Tambah Sertifikat</BaseButton
          >
        </template>
      </div>

      <div v-else class="certificates-grid">
        <div
          v-for="cert in filteredCertificates"
          :key="cert.id"
          class="cert-card glass"
        >
          <div class="cert-image">
            <img
              v-if="cert.imageBase64"
              :src="cert.imageBase64"
              :alt="cert.title"
            />
            <div v-else class="cert-placeholder"><Award :size="40" /></div>
            <div v-if="cert.isFeatured" class="featured-badge">Featured</div>
          </div>

          <div class="cert-info">
            <h4>{{ cert.title }}</h4>
            <p class="issuer">{{ cert.issuer }}</p>
            <div class="cert-meta">
              <span class="date"
                ><Calendar :size="14" /> {{ formatDate(cert.issueDate) }}</span
              >
              <a
                v-if="cert.credentialUrl"
                :href="cert.credentialUrl"
                target="_blank"
                class="link-btn"
              >
                <ExternalLink :size="14" />
              </a>
            </div>
            <div class="cert-actions">
              <button @click="openEdit(cert)" class="icon-btn edit">
                <Edit2 :size="16" />
              </button>
              <button @click="handleDelete(cert.id!)" class="icon-btn delete">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificates-admin {
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
  cursor: pointer;
}
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.cert-card {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}
.cert-card:hover {
  transform: translateY(-5px);
}
.cert-image {
  aspect-ratio: 4/3;
  position: relative;
  background: var(--color-surface-raised);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.cert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cert-placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}
.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--color-accent);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}
.cert-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cert-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.issuer {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 12px;
}
.cert-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}
.date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.link-btn {
  color: var(--color-text-muted);
  transition: color 0.2s;
}
.link-btn:hover {
  color: var(--color-accent);
}
.cert-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 12px;
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
  transition: all 0.4s var(--ease-spring);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
