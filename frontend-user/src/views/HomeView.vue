<script setup lang="ts">
/**
 * HomeView - 首页
 * Task 6.4: 组装 HomeView 页面
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 * 
 * Features:
 * - 整合所有首页组件 (HeroBanner, PopularHeroes, LatestNews)
 * - 使用 Vue 3 Composition API with setup script
 * - 处理子组件事件 (hero-click, news-click)
 * - 应用统一主题样式
 * - 页面过渡动画
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '@/components/home/HeroBanner.vue'
import PopularHeroes from '@/components/home/PopularHeroes.vue'
import LatestNews from '@/components/home/LatestNews.vue'
import { banners } from '@/data/news'
import type { Hero, BannerItem, NewsItem } from '@/types'

// Router for navigation
const router = useRouter()

// Page loading state
const isPageLoaded = ref(false)

/**
 * Handle hero card click - navigate to hero detail page
 * Requirements: 1.3 - Navigate to hero detail page when card is clicked
 */
const handleHeroClick = (hero: Hero): void => {
  router.push(`/heroes/${hero.id}`)
}

/**
 * Handle banner click - navigate to banner link
 * Requirements: 1.1 - Banner carousel interaction
 */
const handleBannerClick = (banner: BannerItem): void => {
  if (banner.link) {
    router.push(banner.link)
  }
}

/**
 * Handle news item click - navigate to events page
 * Requirements: 1.4 - News interaction
 */
const handleNewsClick = (_news: NewsItem): void => {
  // Navigate to events page (news details would be shown there)
  // The news parameter is prefixed with _ to indicate it's intentionally unused
  // In a real app, this could navigate to a specific news detail page
  router.push('/events')
}

// Lifecycle hooks
onMounted(() => {
  // Trigger page load animation
  setTimeout(() => {
    isPageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="home-view" :class="{ 'is-loaded': isPageLoaded }">
    <!-- Hero Banner Section -->
    <section class="home-view__banner">
      <HeroBanner 
        :items="banners"
        :autoplay="true"
        :interval="5000"
        @click="handleBannerClick"
      />
    </section>

    <!-- Main Content Container -->
    <div class="home-view__container">
      <!-- Popular Heroes Section -->
      <section class="home-view__section">
        <PopularHeroes 
          :max-heroes="6"
          @hero-click="handleHeroClick"
        />
      </section>

      <!-- Latest News Section -->
      <section class="home-view__section">
        <LatestNews 
          :max-items="6"
          @news-click="handleNewsClick"
        />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $color-bg-dark;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity $transition-normal, transform $transition-normal;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-view__banner {
  width: 100%;
  padding: $spacing-sm;
  padding-top: $spacing-md;

  @include respond-to('md') {
    padding: $spacing-md;
    padding-top: $spacing-lg;
  }

  @include respond-to('lg') {
    max-width: 1400px;
    margin: 0 auto;
    padding: $spacing-lg;
    padding-top: $spacing-xl;
  }
}

.home-view__container {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-sm;

  @include respond-to('md') {
    padding: 0 $spacing-md;
  }

  @include respond-to('lg') {
    padding: 0 $spacing-lg;
  }
}

.home-view__section {
  margin-bottom: $spacing-lg;

  @include respond-to('md') {
    margin-bottom: $spacing-xl;
  }

  // Section entrance animation
  opacity: 0;
  transform: translateY(20px);
  animation: section-fade-in 0.6s ease-out forwards;

  &:nth-child(1) {
    animation-delay: 0.2s;
  }

  &:nth-child(2) {
    animation-delay: 0.4s;
  }
}

@keyframes section-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
