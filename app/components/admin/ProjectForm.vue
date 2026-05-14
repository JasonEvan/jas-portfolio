<script setup lang="ts">
import { ref, watch } from "vue";
import type { Project } from "~/types/models";
import { toast } from "vue-sonner";
import { Plus, Trash2, Github, ExternalLink } from "lucide-vue-next";

const props = defineProps<{
  initialData?: Project | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Project>];
  cancel: [];
}>();

type ProjectFormState = Omit<
  Project,
  | "id"
  | "slug"
  | "createdAt"
  | "updatedAt"
  | "coverBase64"
  | "images"
  | "techStack"
> & {
  coverBase64: string;
  images: string[];
  techStack: string[];
};

const form = ref<ProjectFormState>({
  title: "",
  status: "done",
  description: "",
  content: "",
  coverBase64: "",
  coverThumb: "",
  images: [],
  techStack: [],
  projectUrl: "",
  repoUrl: "",
  isFeatured: false,
  isPublished: true,
});

const techInput = ref("");

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        title: newData.title || "",
        status: newData.status || "done",
        description: newData.description || "",
        content: newData.content || "",
        coverBase64: newData.coverBase64 || "",
        coverThumb: newData.coverThumb || "",
        images: newData.images ? [...newData.images] : [],
        techStack: newData.techStack ? [...newData.techStack] : [],
        projectUrl: newData.projectUrl || "",
        repoUrl: newData.repoUrl || "",
        isFeatured: !!newData.isFeatured,
        isPublished: !!newData.isPublished,
      };
      techInput.value = newData.techStack?.join(", ") || "";
    } else {
      form.value = {
        title: "",
        status: "done",
        description: "",
        content: "",
        coverBase64: "",
        coverThumb: "",
        images: [],
        techStack: [],
        projectUrl: "",
        repoUrl: "",
        isFeatured: false,
        isPublished: true,
      };
      techInput.value = "";
    }
  },
  { immediate: true },
);

const addShowcaseImage = (base64: string) => {
  if (!form.value.images) form.value.images = [];
  form.value.images.push(base64);
};

const removeShowcaseImage = (index: number) => {
  form.value.images?.splice(index, 1);
};

const handleSubmit = () => {
  if (!form.value.title) {
    toast.error("Judul proyek harus diisi");
    return;
  }

  // Parse tech stack
  form.value.techStack = techInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  emit("submit", { ...form.value });
};
</script>

<template>
  <div class="project-form-container">
    <form @submit.prevent="handleSubmit" class="project-form">
      <div class="form-grid">
        <!-- Main Content -->
        <div class="main-col">
          <BaseInput
            v-model="form.title"
            label="Judul Proyek"
            placeholder="E-commerce App, Portfolio, etc."
            required
          />

          <div class="input-group">
            <label class="label">Status Proyek</label>
            <div class="status-toggle">
              <button
                type="button"
                class="status-btn"
                :class="{ active: form.status === 'done' }"
                @click="form.status = 'done'"
              >
                Selesai (Done)
              </button>
              <button
                type="button"
                class="status-btn"
                :class="{ active: form.status === 'not' }"
                @click="form.status = 'not'"
              >
                Belum Selesai (Not)
              </button>
            </div>
          </div>

          <div class="input-group">
            <label class="label">Deskripsi Singkat</label>
            <textarea
              v-model="form.description"
              class="textarea-input"
              placeholder="Jelaskan proyek Anda secara singkat..."
              rows="3"
            ></textarea>
          </div>

          <div class="input-group">
            <label class="label">Detail Proyek (Markdown/HTML)</label>
            <textarea
              v-model="form.content"
              class="textarea-input"
              placeholder="Ceritakan lebih detail tentang proyek ini..."
              rows="8"
            ></textarea>
          </div>

          <div class="links-grid">
            <BaseInput
              v-model="form.repoUrl"
              label="GitHub Link"
              placeholder="https://github.com/..."
            >
              <template #icon><Github :size="16" /></template>
            </BaseInput>
            <BaseInput
              v-model="form.projectUrl"
              label="Live Demo Link"
              placeholder="https://..."
            >
              <template #icon><ExternalLink :size="16" /></template>
            </BaseInput>
          </div>

          <BaseInput
            v-model="techInput"
            label="Tools / Tech Stack"
            placeholder="Vue, Nuxt, Firebase, Tailwind (pisahkan dengan koma)"
          />
        </div>

        <!-- Sidebar / Media -->
        <div class="side-col">
          <div class="image-section">
            <ImageUpload
              v-model="form.coverBase64"
              label="Thumbnail Utama"
              withThumb
              @thumb="(t) => (form.coverThumb = t)"
              :maxMB="0.2"
            />
          </div>

          <div class="showcase-section">
            <label class="label">Showcase Images</label>
            <div class="showcase-grid">
              <div
                v-for="(img, idx) in form.images"
                :key="idx"
                class="showcase-item"
              >
                <img :src="img" alt="Showcase" />
                <button
                  type="button"
                  class="remove-img"
                  @click="removeShowcaseImage(idx)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
              <ImageUpload
                modelValue=""
                @update:modelValue="addShowcaseImage"
                class="mini-upload"
              />
            </div>
            <p class="hint">Tambah foto untuk showcase detail proyek</p>
          </div>

          <div class="settings-card glass">
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isFeatured" />
              <span>Tampilkan di Unggulan</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isPublished" />
              <span>Publikasikan</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton
          type="button"
          variant="secondary"
          @click="emit('cancel')"
          :disabled="loading"
        >
          Batal
        </BaseButton>
        <BaseButton type="submit" :loading="loading">
          {{ initialData ? "Simpan Perubahan" : "Upload Proyek" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.project-form-container {
  width: 100%;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.textarea-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  color: var(--color-text);
  font-family: var(--font-body);
  resize: vertical;
  transition: border-color 0.2s;
}

.textarea-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.status-toggle {
  display: flex;
  gap: 8px;
  background: var(--color-surface);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--color-border-strong);
}

.status-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn.active {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--color-accent-rgb), 0.3);
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.showcase-item {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.showcase-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.showcase-item:hover .remove-img {
  opacity: 1;
}

.settings-card {
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-item input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
}

.hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}
</style>
