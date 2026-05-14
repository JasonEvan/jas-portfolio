<script setup lang="ts">
import { ref, watch } from "vue";
import type { Experience } from "~/types/models";
import { toast } from "vue-sonner";
import { Briefcase, Calendar, Globe } from "lucide-vue-next";

const props = defineProps<{
  initialData?: Experience | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Experience>];
  cancel: [];
}>();

interface ExperienceFormState {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  logoBase64: string;
  companyUrl: string;
}

const form = ref<ExperienceFormState>({
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  logoBase64: "",
  companyUrl: "",
});

// Month and Year selection logic
const months = [
  { label: "Januari", value: "01" },
  { label: "Februari", value: "02" },
  { label: "Maret", value: "03" },
  { label: "April", value: "04" },
  { label: "Mei", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "Agustus", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 40 }, (_, i) => (currentYear - i).toString());

const startMonth = ref("01");
const startYear = ref(currentYear.toString());
const endMonth = ref("01");
const endYear = ref(currentYear.toString());

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        company: newData.company || "",
        role: newData.role || "",
        description: newData.description || "",
        startDate: newData.startDate || "",
        endDate: newData.endDate || "",
        isCurrent: !!newData.isCurrent,
        logoBase64: newData.logoBase64 || "",
        companyUrl: newData.companyUrl || "",
      };

      // Parse dates for dropdowns (Format: YYYY-MM)
      if (newData.startDate && typeof newData.startDate === "string" && newData.startDate.includes("-")) {
        const [y, m] = newData.startDate.split("-");
        if (y) startYear.value = y;
        if (m) startMonth.value = m;
      }
      if (newData.endDate && typeof newData.endDate === "string" && newData.endDate.includes("-")) {
        const [y, m] = newData.endDate.split("-");
        if (y) endYear.value = y;
        if (m) endMonth.value = m;
      }
    } else {
      form.value = {
        company: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        logoBase64: "",
        companyUrl: "",
      };
      startMonth.value = "01";
      startYear.value = currentYear.toString();
      endMonth.value = "01";
      endYear.value = currentYear.toString();
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (!form.value.company || !form.value.role) {
    toast.error("Nama perusahaan dan peran harus diisi");
    return;
  }

  // Set formatted dates
  form.value.startDate = `${startYear.value}-${startMonth.value}`;
  if (form.value.isCurrent) {
    form.value.endDate = "";
  } else {
    form.value.endDate = `${endYear.value}-${endMonth.value}`;
  }

  const payload: Partial<Experience> = {
    ...form.value,
    endDate: form.value.endDate || null,
  };

  emit("submit", payload);
};
</script>

<template>
  <div class="experience-form-container">
    <form @submit.prevent="handleSubmit" class="experience-form">
      <div class="form-grid">
        <!-- Main Content -->
        <div class="main-col">
          <div class="row">
            <BaseInput
              v-model="form.company"
              label="Perusahaan"
              placeholder="Google, Microsoft, etc."
              required
            >
              <template #icon><Briefcase :size="16" /></template>
            </BaseInput>
            <BaseInput
              v-model="form.role"
              label="Peran / Jabatan"
              placeholder="Senior Frontend Developer"
              required
            />
          </div>

          <div class="input-group">
            <label class="label">Deskripsi Pekerjaan</label>
            <textarea
              v-model="form.description"
              class="textarea-input"
              placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
              rows="6"
            ></textarea>
          </div>

          <!-- Date Selectors -->
          <div class="row">
            <div class="input-group">
              <label class="label">Tanggal Mulai</label>
              <div class="date-select-group">
                <select v-model="startMonth" class="select-input">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
                <select v-model="startYear" class="select-input">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>

            <div class="input-group" :class="{ 'disabled-group': form.isCurrent }">
              <label class="label">Tanggal Selesai</label>
              <div class="date-select-group">
                <select v-model="endMonth" class="select-input" :disabled="form.isCurrent">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
                <select v-model="endYear" class="select-input" :disabled="form.isCurrent">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <BaseInput
              v-model="form.companyUrl"
              label="Website Perusahaan"
              placeholder="https://company.com"
            >
              <template #icon><Globe :size="16" /></template>
            </BaseInput>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="side-col">
          <div class="image-section">
            <ImageUpload
              v-model="form.logoBase64"
              label="Logo Perusahaan"
              :maxMB="0.1"
            />
          </div>

          <div class="settings-card glass">
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isCurrent" />
              <span>Masih Bekerja di Sini</span>
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
          {{ initialData ? "Simpan Perubahan" : "Simpan Pengalaman" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.experience-form-container {
  width: 100%;
}

.experience-form {
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

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
  }
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

.date-select-group {
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 8px;
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
  transition: all 0.2s ease;
}

.select-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-glow);
}

.select-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled-group {
  opacity: 0.6;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}
</style>
