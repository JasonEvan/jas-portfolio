<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit" | "reset";
  to?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "base" | "lg";
  loading?: boolean;
  disabled?: boolean;
}>();

const isNuxtLink = computed(() => !!props.to);
const isExternalLink = computed(() => !!props.href);
const componentType = computed(() => {
  if (isNuxtLink.value) return resolveComponent("NuxtLink");
  if (isExternalLink.value) return "a";
  return "button";
});
</script>

<template>
  <component
    :is="componentType"
    :type="!to && !href ? type || 'button' : undefined"
    :to="to"
    :href="href"
    class="btn"
    :class="[variant || 'primary', size || 'base', { loading, disabled }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="loader"></span>
    <slot v-else />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease-smooth);
  border: 1px solid transparent;
  font-family: var(--font-body);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}
.base {
  padding: 12px 24px;
  font-size: 1rem;
}
.lg {
  padding: 16px 32px;
  font-size: 1.125rem;
}

.primary {
  background: var(--color-accent);
  color: white;
}
.primary:hover:not(:disabled) {
  background: #3b7be6;
  box-shadow: 0 0 20px var(--color-accent-glow);
}

.secondary {
  background: var(--color-surface-raised);
  color: var(--color-text);
}
.secondary:hover:not(:disabled) {
  background: var(--color-surface-overlay);
}

.outline {
  background: transparent;
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
.outline:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-text-muted);
}

.ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
}

.danger {
  background: var(--color-error);
  color: white;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
