<script setup lang="ts">
import { ref, watch } from "vue";
import type { Skill } from "~/types/models";
import { toast } from "vue-sonner";

const props = defineProps<{
  initialData?: Skill | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Skill>];
  cancel: [];
}>();

const form = ref({
  name: "",
  category: "Languages",
  iconBase64: "",
  level: 80,
});

const categories = [
  "Languages",
  "Frameworks & Libraries",
  "Databases",
  "Tools",
  "Others",
];

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        name: newData.name || "",
        category: newData.category || "Languages",
        iconBase64: newData.iconBase64 || "",
        level: newData.level ?? 80,
      };
    } else {
      form.value = {
        name: "",
        category: "Frontend",
        iconBase64: "",
        level: 80,
      };
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (!form.value.name) {
    toast.error("Nama skill harus diisi");
    return;
  }
  emit("submit", { ...form.value });
};
</script>

<template>
  <div class="skill-form-container">
    <form @submit.prevent="handleSubmit" class="skill-form">
      <div class="form-grid">
        <div class="input-col">
          <BaseInput
            v-model="form.name"
            label="Nama Skill"
            placeholder="Vue.js, Node.js, etc."
            required
          />

          <div class="input-group">
            <label class="label">Kategori</label>
            <select v-model="form.category" class="select-input">
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label class="label">Level Proficiency ({{ form.level }}%)</label>
            <input
              type="range"
              v-model.number="form.level"
              min="0"
              max="100"
              class="range-input"
            />
          </div>
        </div>

        <div class="image-col">
          <ImageUpload
            v-model="form.iconBase64"
            label="Icon Skill (SVG/PNG)"
            :maxMB="0.05"
          />
          <p class="hint">
            Gunakan SVG atau PNG transparan untuk hasil terbaik.
          </p>
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
          {{ initialData ? "Simpan Perubahan" : "Tambah Skill" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.skill-form-container {
  width: 100%;
}

.skill-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.input-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.select-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  color: var(--color-text);
  font-family: var(--font-body);
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.range-input {
  width: 100%;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.image-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}
</style>
