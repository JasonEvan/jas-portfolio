<!-- components/ui/ImageUpload.vue -->
<script setup lang="ts">
import { Upload as LucideUpload } from 'lucide-vue-next'
const props = defineProps<{
  modelValue: string
  label?: string
  maxMB?: number
  maxPx?: number
  withThumb?: boolean   // jika true, emit juga thumbnail
}>()

const emit = defineEmits<{
  'update:modelValue': [base64: string]
  'thumb': [thumbBase64: string]
  'sizeWarning': [bytes: number]
}>()

const { fileToBase64, fileToThumb, estimateBase64Size, isSafeForSameDoc } = useImageBase64()
const loading = ref(false)
const error   = ref('')

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  loading.value = true
  error.value   = ''

  try {
    const base64 = await fileToBase64(file, {
      maxSizeMB:        props.maxMB ?? 0.55,
      maxWidthOrHeight: props.maxPx ?? 1280,
    })

    if (!isSafeForSameDoc(base64)) {
      emit('sizeWarning', estimateBase64Size(base64))
    }

    emit('update:modelValue', base64)

    if (props.withThumb) {
      const thumb = await fileToThumb(file)
      emit('thumb', thumb)
    }
  } catch (err: any) {
    error.value = 'Gagal memproses gambar: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="image-upload">
    <span v-if="label" class="label">{{ label }}</span>
    <label class="upload-area" :class="{ 'has-image': modelValue }">
      <input type="file" accept="image/*" class="sr-only" @change="handleFileChange" />
      
      <div v-if="loading" class="state-overlay">
        <div class="loader"></div>
        <span>Memproses...</span>
      </div>

      <div v-else-if="modelValue" class="preview-container">
        <img :src="modelValue" alt="Preview" class="preview-img" />
        <div class="preview-actions">
          <button type="button" class="btn-remove" @click.stop.prevent="emit('update:modelValue', '')">
            Hapus
          </button>
        </div>
      </div>

      <div v-else class="placeholder">
        <LucideUpload class="icon" />
        <span>Pilih Gambar</span>
      </div>
    </label>

    <p v-if="error"   class="error-text">{{ error }}</p>
  </div>
</template>

<style scoped>
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.upload-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--color-surface);
  border: 2px dashed var(--color-border-strong);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--color-accent);
  background: rgba(255, 255, 255, 0.02);
}

.has-image {
  border-style: solid;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--color-text-muted);
}

.icon {
  width: 32px;
  height: 32px;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-actions {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.upload-area:hover .preview-actions {
  opacity: 1;
}

.btn-remove {
  background: var(--color-error);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.state-overlay {
  position: absolute;
  inset: 0;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border-strong);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-text {
  font-size: 0.75rem;
  color: var(--color-error);
}
</style>
