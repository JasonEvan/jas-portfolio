<script setup lang="ts">
const { getProfile } = useProfile();
const profile = ref({
  name: "Jason Evan",
  title: "Full Stack Developer & Digital Creator",
  githubUrl: "#",
  linkedinUrl: "#",
  twitterUrl: "#",
});

onMounted(async () => {
  const data = await getProfile();
  if (data) {
    profile.value = {
      ...profile.value,
      ...data,
    };
  }
});
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-left">
          <h2 class="text-gradient">{{ profile.name }}</h2>
          <p>{{ profile.title }}</p>
        </div>
        <div class="footer-right">
          <div class="socials">
            <a
              v-if="profile.githubUrl"
              :href="profile.githubUrl"
              target="_blank"
              class="social-link"
              >Github</a
            >
            <a
              v-if="profile.linkedinUrl"
              :href="profile.linkedinUrl"
              target="_blank"
              class="social-link"
              >LinkedIn</a
            >
            <a
              v-if="profile.twitterUrl"
              :href="profile.twitterUrl"
              target="_blank"
              class="social-link"
              >Twitter</a
            >
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} {{ profile.name }}. Built with
          Nuxt 3 & Firebase.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 80px 0 40px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 60px;
}

.footer-left h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.footer-left p {
  color: var(--color-text-muted);
}

.socials {
  display: flex;
  gap: 24px;
}

.social-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--color-accent);
}

.footer-bottom {
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid var(--color-border);
}

.footer-bottom p {
  font-size: 0.875rem;
  color: var(--color-text-subtle);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 40px;
    text-align: center;
    align-items: center;
  }
}
</style>
