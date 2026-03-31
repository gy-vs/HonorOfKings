<script setup lang="ts">
import { provide } from 'vue'
import AppHeader from './components/common/AppHeader.vue'
import AppFooter from './components/common/AppFooter.vue'

// Provide theme configuration to all child components
const theme = {
  primaryColor: '#C8AA6E',
  primaryDark: '#A08050',
  bgDark: '#0A1428',
  bgCard: '#1A2744',
  textPrimary: '#F0E6D2',
  textSecondary: '#A09B8C',
  borderColor: '#785A28'
}

provide('theme', theme)
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $color-bg-dark;
}

.main-content {
  flex: 1;
  padding: $spacing-md;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

// Page transition animations
// Requirements: 7.2, 7.4 - Navigate with route transition and page transition animations

// Fade transition (default)
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Slide left transition (for detail pages)
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// Slide right transition (for going back)
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// Scale transition (for modals/overlays)
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
