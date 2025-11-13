<template>
  <div class="layout">
    <!-- Mobile overlay when sidebar is open -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="mobile-overlay" 
      @click="closeMobileSidebar"
    ></div>

    <!-- Mobile header with hamburger menu -->
    <header class="mobile-header">
      <button 
        class="menu-toggle" 
        @click="toggleMobileSidebar"
        aria-label="Abrir menu"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <h2 class="page-title">{{ currentPageTitle }}</h2>
    </header>

    <aside 
      :class="['sidebar', { 
        'sidebar-collapsed': isCollapsed && !isMobile(),
        'sidebar-mobile-open': isMobileSidebarOpen
      }]"
    >
      <div class="sidebar-header">
        <div class="logo">
          <h1>{{ isCollapsed && !isMobile() ? "TI" : "T.Informação" }}</h1>
        </div>
        <button 
          v-if="isMobile()" 
          class="close-btn"
          @click="closeMobileSidebar"
          aria-label="Fechar menu"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="nav-item"
          active-class="nav-item-active"
          @click="isMobile() ? closeMobileSidebar() : null"
        >
          <span class="nav-icon">
            <Icon :icon="route.meta.icon" />
          </span>
          <span class="nav-text" :class="{ 'always-visible': !isMobile() || !isCollapsed }">
            {{ route.meta.title }}
          </span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button
          v-if="!isMobile()"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const isCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const windowWidth = ref(window.innerWidth);

// Update window width when resized
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const routes = computed(() => {
  return router.options.routes.filter((r) => r.meta?.title);
});

const currentPageTitle = computed(() => {
  return route.meta?.title || "Dashboard";
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
}

function closeMobileSidebar() {
  isMobileSidebarOpen.value = false;
}

function isMobile() {
  return windowWidth.value < 768;
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--light);
  position: relative;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--white);
  box-shadow: var(--shadow);
  padding: 0 var(--spacing-lg);
  align-items: center;
  justify-content: space-between;
  z-index: 150;
}

.mobile-header .page-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius);
  color: var(--gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle:hover {
  background: var(--gray-100);
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
  transform: translateX(0);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-mobile-open {
  transform: translateX(0);
  z-index: 200;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-height);
}

.logo h1 {
  color: var(--primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  white-space: nowrap;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--border-radius);
  color: var(--gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--gray-100);
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
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.nav-text.always-visible {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-collapsed .nav-text {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
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
  padding-top: 0;
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
  padding-top: var(--header-height);
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

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 190;
  backdrop-filter: blur(2px);
}

/* Responsive for mobile */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
  
  .header {
    display: none;
  }

  .sidebar {
    width: 260px;
    transform: translateX(-100%);
  }

  .sidebar-mobile-open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding-top: var(--header-height);
  }

  .content {
    padding: var(--spacing-lg);
    padding-top: calc(var(--spacing-lg) + var(--header-height));
  }

  .stats-grid {
    grid-template-columns: 1fr !important;
  }

  .dashboard-grid {
    grid-template-columns: 1fr !important;
  }

  .page-title {
    display: none;
  }

  .mobile-header .page-title {
    display: block;
  }
  
  .nav-text {
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .content {
    padding: var(--spacing-md);
    padding-top: calc(var(--spacing-md) + var(--header-height));
  }
  
  .stats-grid {
    gap: var(--spacing-md);
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: var(--font-size-2xl);
  }
}

/* Small devices (landscape phones, 600px and up) */
@media only screen and (max-width: 768px) {
  .user-info {
    display: none;
  }
  
  .sidebar-footer {
    padding: var(--spacing-sm);
  }
  
  .nav-item {
    padding: 10px 14px;
  }
}
</style>
