<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <div class="input-wrapper">
      <input
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input"
        :class="{ 'has-error': error }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.required {
  color: var(--color-error);
}

.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  padding: 12px 16px;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-glow);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.has-error {
  border-color: var(--color-error);
}

.error-text {
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: 2px;
}
</style>
