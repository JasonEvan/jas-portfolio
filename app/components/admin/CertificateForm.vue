<script setup lang="ts">
import { ref, watch } from "vue";
import type { Certificate } from "~/types/models";
import { toast } from "vue-sonner";
import { Award, Calendar, Link, Image as LucideImage } from "lucide-vue-next";

const props = defineProps<{
  initialData?: Certificate | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Certificate>];
  cancel: [];
}>();

interface CertificateFormState {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  imageBase64: string;
  isFeatured: boolean;
}

const form = ref<CertificateFormState>({
  title: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  imageBase64: "",
  isFeatured: false,
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
const expiryYears = Array.from({ length: 50 }, (_, i) => (currentYear + 10 - i).toString());

const issueMonth = ref("01");
const issueYear = ref(currentYear.toString());
const expiryMonth = ref("01");
const expiryYear = ref(currentYear.toString());
const hasExpiry = ref(false);

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        title: newData.title || "",
        issuer: newData.issuer || "",
        issueDate: newData.issueDate || "",
        expiryDate: newData.expiryDate || "",
        credentialId: newData.credentialId || "",
        credentialUrl: newData.credentialUrl || "",
        imageBase64: newData.imageBase64 || "",
        isFeatured: !!newData.isFeatured,
      };

      if (newData.issueDate && typeof newData.issueDate === "string" && newData.issueDate.includes("-")) {
        const [y, m] = newData.issueDate.split("-");
        if (y) issueYear.value = y;
        if (m) issueMonth.value = m;
      }

      if (newData.expiryDate && typeof newData.expiryDate === "string" && newData.expiryDate.includes("-")) {
        const [y, m] = newData.expiryDate.split("-");
        if (y) expiryYear.value = y;
        if (m) expiryMonth.value = m;
        hasExpiry.value = true;
      } else {
        hasExpiry.value = false;
      }
    } else {
      form.value = {
        title: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        imageBase64: "",
        isFeatured: false,
      };
      issueMonth.value = "01";
      issueYear.value = currentYear.toString();
      hasExpiry.value = false;
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (!form.value.title || !form.value.issuer) {
    toast.error("Judul dan penerbit sertifikat harus diisi");
    return;
  }

  form.value.issueDate = `${issueYear.value}-${issueMonth.value}`;
  if (hasExpiry.value) {
    form.value.expiryDate = `${expiryYear.value}-${expiryMonth.value}`;
  } else {
    form.value.expiryDate = "";
  }

  const payload: Partial<Certificate> = {
    ...form.value,
    expiryDate: form.value.expiryDate || null,
  };

  emit("submit", payload);
};
</script>

<template>
  <div class="certificate-form-container">
    <form @submit.prevent="handleSubmit" class="certificate-form">
      <div class="form-grid">
        <div class="main-col">
          <div class="row">
            <BaseInput
              v-model="form.title"
              label="Judul Sertifikat"
              placeholder="Google Data Analytics, etc."
              required
            >
              <template #icon><Award :size="16" /></template>
            </BaseInput>
            <BaseInput
              v-model="form.issuer"
              label="Penerbit / Organisasi"
              placeholder="Coursera, Google, Microsoft"
              required
            />
          </div>

          <div class="row">
            <div class="input-group">
              <label class="label">Tanggal Terbit</label>
              <div class="date-select-group">
                <select v-model="issueMonth" class="select-input">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
                <select v-model="issueYear" class="select-input">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>

            <div class="input-group" :class="{ 'disabled-group': !hasExpiry }">
              <label class="label">Tanggal Kadaluarsa</label>
              <div class="date-select-group">
                <select v-model="expiryMonth" class="select-input" :disabled="!hasExpiry">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
                <select v-model="expiryYear" class="select-input" :disabled="!hasExpiry">
                  <option v-for="y in expiryYears" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <BaseInput
              v-model="form.credentialId"
              label="Credential ID"
              placeholder="ABC-123-XYZ"
            />
            <BaseInput
              v-model="form.credentialUrl"
              label="Credential URL"
              placeholder="https://..."
            >
              <template #icon><Link :size="16" /></template>
            </BaseInput>
          </div>
        </div>

        <div class="side-col">
          <div class="image-section">
            <ImageUpload
              v-model="form.imageBase64"
              label="Foto / Gambar Sertifikat"
              :maxMB="0.2"
            />
          </div>

          <div class="settings-card glass">
            <label class="checkbox-item">
              <input type="checkbox" v-model="hasExpiry" />
              <span>Memiliki Kadaluarsa</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isFeatured" />
              <span>Tampilkan di Unggulan</span>
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
          {{ initialData ? "Simpan Perubahan" : "Simpan Sertifikat" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.certificate-form-container { width: 100%; }
.certificate-form { display: flex; flex-direction: column; gap: 32px; }
.form-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
@media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } }
.main-col { display: flex; flex-direction: column; gap: 24px; }
.side-col { display: flex; flex-direction: column; gap: 24px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
.input-group { display: flex; flex-direction: column; gap: 8px; }
.label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.date-select-group { display: grid; grid-template-columns: 1fr 100px; gap: 8px; }
.select-input { width: 100%; padding: 12px 16px; background: var(--color-surface); border: 1px solid var(--color-border-strong); border-radius: 12px; color: var(--color-text); font-family: var(--font-body); cursor: pointer; transition: all 0.2s ease; }
.select-input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px var(--color-accent-glow); }
.select-input:disabled { opacity: 0.5; cursor: not-allowed; }
.disabled-group { opacity: 0.6; }
.settings-card { padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 16px; }
.checkbox-item { display: flex; align-items: center; gap: 12px; cursor: pointer; font-weight: 500; }
.checkbox-item input { width: 18px; height: 18px; accent-color: var(--color-accent); }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 24px; border-top: 1px solid var(--color-border); }
</style>
