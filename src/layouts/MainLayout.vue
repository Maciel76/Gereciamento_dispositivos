<template>
  <div class="layout">
    <aside :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
      <div class="sidebar-header">
        <div class="logo">
          <h1>{{ isCollapsed ? "TI" : "T.Informação" }}</h1>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="nav-item"
          active-class="nav-item-active"
        >
          <span class="nav-icon">
            <Icon :icon="route.meta.icon" />
          </span>
          <span v-if="!isCollapsed" class="nav-text">{{
            route.meta.title
          }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button
          class="collapse-btn"
          @click="toggleSidebar"
          :title="isCollapsed ? 'Expandir' : 'Recolher'"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline
              :points="isCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"
            ></polyline>
          </svg>
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="header">
        <div class="header-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              <span>TI</span>
            </div>
            <div class="user-details">
              <span class="user-name">Assistente TI</span>
              <span class="user-role">Técnico</span>
            </div>
          </div>
        </div>
      </header>

      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const isCollapsed = ref(false);

const routes = computed(() => {
  return router.options.routes.filter((r) => r.meta?.title);
});

const currentPageTitle = computed(() => {
  return route.meta?.title || "Dashboard";
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--light);
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  background: var(--white);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  transition: var(--transition);
  z-index: 100;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--header-height);
}

.logo h1 {
  color: var(--primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 12px 16px;
  color: var(--gray-700);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: var(--transition);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
}

.nav-item:hover {
  background: var(--primary-alpha);
  color: var(--primary);
}

.nav-item-active {
  background: var(--primary);
  color: var(--white);
}

.nav-icon {
  font-size: var(--font-size-xl);
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.collapse-btn {
  width: 100%;
  padding: 12px;
  background: var(--gray-100);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: var(--gray-700);
}

.collapse-btn:hover {
  background: var(--gray-200);
  color: var(--primary);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.sidebar-collapsed + .main-content {
  margin-left: 80px;
}

.header {
  background: var(--white);
  box-shadow: var(--shadow);
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  font-size: var(--font-size-sm);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

.content {
  flex: 1;
  padding: var(--spacing-xl);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-collapsed {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .sidebar-collapsed + .main-content {
    margin-left: 80px;
  }
}
</style>
