<!-- layouts/admin.vue -->
<template>
  <div class="admin-shell">
    <aside class="admin-sidebar glass">
      <div class="sidebar-header">
        <h3 class="text-gradient">Portfolio Admin</h3>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <component :is="item.icon" class="icon" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <LucideLogOut class="icon" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <div class="admin-body">
      <header class="admin-header glass">
        <div class="header-left">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span>{{ user?.email }}</span>
          </div>
        </div>
      </header>

      <main class="admin-main">
        <slot />
      </main>
    </div>

    <ClientOnly>
      <Toaster position="top-right" richColors />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Briefcase,
  Zap,
  MessageSquare,
  LogOut as LucideLogOut,
} from "lucide-vue-next";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

definePageMeta({ middleware: "auth" });

const { logout } = useAuth();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: User, label: "Profil", to: "/admin/profile" },
  { icon: FolderOpen, label: "Proyek", to: "/admin/projects" },
  { icon: Briefcase, label: "Pengalaman", to: "/admin/experience" },
  { icon: Zap, label: "Skill", to: "/admin/skills" },
  { icon: MessageSquare, label: "Testimoni", to: "/admin/testimonials" },
];

const route = useRoute();
const currentPageTitle = computed(() => {
  const item = navItems.find(
    (i) =>
      route.path === i.to || (i.to !== "/admin" && route.path.startsWith(i.to)),
  );
  return item ? item.label : "Dashboard";
});

const handleLogout = async () => {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    await logout();
  }
};
</script>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

.admin-sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  z-index: 50;
}

.sidebar-header {
  padding: 32px 24px;
}

.sidebar-header h3 {
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-accent-glow);
  color: var(--color-accent);
}

.icon {
  width: 20px;
  height: 20px;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid var(--color-border);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.1);
}

.admin-body {
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 40;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.user-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-main {
  flex: 1;
  padding: 40px;
}
</style>
