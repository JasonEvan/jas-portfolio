<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "guest",
});

const { login } = useAuth();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) return;

  loading.value = true;
  error.value = "";

  try {
    await login(email.value, password.value);
  } catch (err: any) {
    error.value = "Email atau password salah.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page dot-grid">
    <div class="login-card glass glow">
      <div class="header">
        <h2 class="text-gradient">Admin Access</h2>
        <p>Silakan login untuk mengelola portfolio</p>
      </div>

      <form class="form" @submit.prevent="handleLogin">
        <BaseInput
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="admin@example.com"
          required
        />

        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <div v-if="error" class="error-box">
          {{ error }}
        </div>

        <BaseButton type="submit" class="submit-btn" :loading="loading">
          Masuk ke Dashboard
        </BaseButton>
      </form>

      <div class="footer">
        <NuxtLink to="/" class="back-link">
          &larr; Kembali ke Portfolio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg);
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border-radius: 24px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h2 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.header p {
  color: var(--color-text-muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
}

.error-box {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.footer {
  margin-top: 32px;
  text-align: center;
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-text);
}
</style>
