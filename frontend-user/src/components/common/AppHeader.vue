<script setup lang="ts">
/**
 * AppHeader - 全局导航头组件
 * Task 3.1: 实现 AppHeader 导航组件
 * Requirements: 7.1, 7.3
 * 
 * Features:
 * - 使用 provide/inject 注入主题
 * - 实现导航链接高亮
 * - 响应式移动端菜单
 */
import { inject, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  User, 
  Box, 
  Trophy, 
  Menu as MenuIcon,
  Close,
  DocumentCopy
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

// Navigation item interface
interface NavItem {
  path: string
  name: string
  title: string
  icon: Component
}

// Theme interface for type safety
interface Theme {
  primaryColor: string
  primaryDark: string
  bgDark: string
  bgCard: string
  textPrimary: string
  textSecondary: string
  borderColor: string
}

const route = useRoute()
const router = useRouter()

// Inject theme from App.vue
// Requirements: 7.1 - Persistent navigation header with consistent theme
const theme = inject<Theme>('theme')

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Navigation items configuration
// Requirements: 7.1 - Provide persistent navigation header on all pages
const navItems: NavItem[] = [
  { path: '/', name: 'home', title: '首页', icon: HomeFilled },
  { path: '/heroes', name: 'heroes', title: '英雄', icon: User },
  { path: '/equipment', name: 'equipment', title: '装备', icon: Box },
  { path: '/events', name: 'events', title: '赛事', icon: Trophy },
  { path: '/version-hub', name: 'version-hub', title: '版本中心', icon: DocumentCopy },
 
]

// Current route path for active state detection
const currentPath = computed(() => route.path)

/**
 * Check if a navigation item is active
 * Requirements: 7.3 - Highlight the current active route in the navigation
 * Property 11: Navigation Active State Consistency
 */
const isActive = (path: string): boolean => {
  if (path === '/') {
    return currentPath.value === '/'
  }
  return currentPath.value.startsWith(path)
}

/**
 * Navigate to a specific route
 * Requirements: 7.2 - Navigate to corresponding page with route transition
 */
const navigateTo = (item: NavItem): void => {
  router.push(item.path)
  // Close mobile menu after navigation
  isMobileMenuOpen.value = false
}

// Toggle mobile menu
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

// Emit event for menu click (for parent component if needed)
const emit = defineEmits<{
  (e: 'menu-click', item: NavItem): void
}>()

const handleNavClick = (item: NavItem): void => {
  emit('menu-click', item)
  navigateTo(item)
}

// Expose theme for potential use in template
const themeColors = computed(() => theme || {
  primaryColor: '#C8AA6E',
  primaryDark: '#A08050',
  bgDark: '#0A1428',
  bgCard: '#1A2744',
  textPrimary: '#F0E6D2',
  textSecondary: '#A09B8C',
  borderColor: '#785A28'
})

// Suppress unused variable warning while keeping theme available
void themeColors
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo" @click="navigateTo(navItems[0])" role="button" tabindex="0">
        <span class="logo-text">王者荣耀</span>
      </div>
      
      <!-- Desktop Navigation Menu -->
      <nav class="nav-menu desktop-nav" aria-label="主导航">
        <div
          v-for="item in navItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          role="link"
          tabindex="0"
          @click="handleNavClick(item)"
          @keydown.enter="handleNavClick(item)"
        >
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="nav-title">{{ item.title }}</span>
        </div>
      </nav>

      <!-- Mobile Menu Toggle Button -->
      <el-button
        class="mobile-menu-toggle"
        :icon="isMobileMenuOpen ? Close : MenuIcon"
        circle
        @click="toggleMobileMenu"
        aria-label="切换菜单"
        :aria-expanded="isMobileMenuOpen"
      />
    </div>

    <!-- Mobile Navigation Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="mobile-menu-overlay"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile Navigation Menu -->
    <Transition name="slide-down">
      <nav 
        v-if="isMobileMenuOpen" 
        class="nav-menu mobile-nav"
        aria-label="移动端导航"
      >
        <div
          v-for="item in navItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          role="link"
          tabindex="0"
          @click="handleNavClick(item)"
          @keydown.enter="handleNavClick(item)"
        >
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="nav-title">{{ item.title }}</span>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
  background: linear-gradient(180deg, $color-bg-dark 0%, rgba($color-bg-dark, 0.95) 100%);
  border-bottom: 1px solid $color-border-light;
  backdrop-filter: blur(10px);
}

.header-container {
  @include flex-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: $spacing-sm $spacing-md;
}

.logo {
  cursor: pointer;
  transition: transform $transition-fast;
  @include focus-ring;

  &:hover {
    transform: scale(1.02);
  }

  .logo-text {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    @include gold-text;
  }
}

// Desktop Navigation
.desktop-nav {
  display: flex;
  gap: $spacing-xs;

  @include respond-below('md') {
    display: none;
  }
}

.nav-item {
  @include flex-center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  cursor: pointer;
  color: $color-text-secondary;
  transition: all $transition-fast;
  @include focus-ring;

  &:hover {
    color: $color-primary;
    background-color: rgba($color-primary, 0.1);
  }

  // Requirements: 7.3 - Highlight the current active route
  &.active {
    color: $color-primary;
    background-color: rgba($color-primary, 0.15);
    border: 1px solid rgba($color-primary, 0.3);

    .nav-title {
      font-weight: $font-weight-medium;
    }
  }

  .nav-icon {
    font-size: 18px;
  }

  .nav-title {
    font-size: $font-size-sm;
  }
}

// Mobile Menu Toggle Button
.mobile-menu-toggle {
  display: none;
  background-color: transparent;
  border: 1px solid $color-border;
  color: $color-primary;

  &:hover {
    background-color: rgba($color-primary, 0.1);
    border-color: $color-primary;
  }

  @include respond-below('md') {
    display: flex;
  }
}

// Mobile Menu Overlay
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color-bg-dark, 0.7);
  z-index: $z-index-modal-backdrop;

  @include respond-to('md') {
    display: none;
  }
}

// Mobile Navigation Menu
.mobile-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: $color-bg-card;
  border-bottom: 1px solid $color-border;
  padding: $spacing-sm;
  z-index: $z-index-modal;
  box-shadow: $shadow-modal;

  @include respond-to('md') {
    display: none;
  }

  .nav-item {
    width: 100%;
    padding: $spacing-sm;
    margin-bottom: $spacing-xs;
    border-radius: $border-radius-md;
    justify-content: flex-start;

    &:last-child {
      margin-bottom: 0;
    }

    .nav-icon {
      font-size: 20px;
    }

    .nav-title {
      font-size: $font-size-md;
    }
  }
}

// Transition animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all $transition-normal;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
