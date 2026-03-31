<script setup lang="ts">
/**
 * LatestNews - 最新资讯区块组件
 * Task 6.3: 实现 LatestNews 资讯区块
 * Requirements: 1.4
 * 
 * Features:
 * - 使用 onMounted 获取数据
 * - 新闻列表展示
 * - 分类标签筛选
 * - 王者荣耀主题样式
 * - 悬停效果
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLatestNews, newsCategories } from '@/data/news'
import type { NewsItem } from '@/types'

// Props interface
interface LatestNewsProps {
  /** Maximum number of news items to display */
  maxItems?: number
}

// Define props with defaults
const props = withDefaults(defineProps<LatestNewsProps>(), {
  maxItems: 6
})

// Define emits
const emit = defineEmits<{
  /** Emitted when a news item is clicked */
  (e: 'news-click', news: NewsItem): void
}>()

// Router for navigation
const router = useRouter()

// State
const newsList = ref<NewsItem[]>([])
const activeCategory = ref<string>('all')
const isLoading = ref<boolean>(true)

/**
 * Computed property to filter news by category
 */
const filteredNews = computed<NewsItem[]>(() => {
  if (activeCategory.value === 'all') {
    return newsList.value.slice(0, props.maxItems)
  }
  return newsList.value
    .filter(item => item.category === activeCategory.value)
    .slice(0, props.maxItems)
})

/**
 * Load news data
 * Requirements: 1.4 - Fetch and display latest news items
 */
const loadNews = (): void => {
  isLoading.value = true
  // Simulate async data fetching
  setTimeout(() => {
    newsList.value = getLatestNews(8)
    isLoading.value = false
  }, 300)
}

/**
 * Handle category tab click
 */
const handleCategoryClick = (categoryKey: string): void => {
  activeCategory.value = categoryKey
}

/**
 * Handle news item click
 */
const handleNewsClick = (news: NewsItem): void => {
  emit('news-click', news)
  // Navigate to events page with news context
  router.push('/events')
}

/**
 * Format date for display
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

/**
 * Get category badge class based on category
 */
const getCategoryClass = (category: string): string => {
  const classMap: Record<string, string> = {
    '新英雄': 'category--hero',
    '赛事': 'category--event',
    '活动': 'category--activity',
    '更新': 'category--update'
  }
  return classMap[category] || ''
}

// Lifecycle hooks
onMounted(() => {
  loadNews()
})
</script>

<template>
  <section class="latest-news" aria-labelledby="latest-news-title">
    <!-- Section Header -->
    <div class="latest-news__header">
      <h2 id="latest-news-title" class="latest-news__title">
        <span class="latest-news__title-icon">📰</span>
        最新资讯
      </h2>
      <p class="latest-news__subtitle">了解王者荣耀最新动态</p>
    </div>

    <!-- Category Tabs -->
    <div class="latest-news__tabs">
      <button
        v-for="category in newsCategories"
        :key="category.key"
        class="latest-news__tab"
        :class="{ 'is-active': activeCategory === category.key }"
        @click="handleCategoryClick(category.key)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="latest-news__loading">
      <div class="latest-news__skeleton" v-for="i in 3" :key="i">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-meta"></div>
        </div>
      </div>
    </div>

    <!-- News List -->
    <div v-else class="latest-news__list">
      <TransitionGroup name="news-list">
        <article
          v-for="news in filteredNews"
          :key="news.id"
          class="news-card"
          @click="handleNewsClick(news)"
        >
          <!-- News Image -->
          <div class="news-card__image-wrapper">
            <img 
              :src="news.image" 
              :alt="news.title"
              class="news-card__image"
              loading="lazy"
            />
            <span 
              class="news-card__category"
              :class="getCategoryClass(news.category)"
            >
              {{ news.category }}
            </span>
          </div>

          <!-- News Content -->
          <div class="news-card__content">
            <h3 class="news-card__title">{{ news.title }}</h3>
            <p class="news-card__summary">{{ news.summary }}</p>
            <div class="news-card__meta">
              <span class="news-card__date">{{ formatDate(news.date) }}</span>
              <span class="news-card__read-more">阅读更多 →</span>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="filteredNews.length === 0" class="latest-news__empty">
        <span>暂无相关资讯</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.latest-news {
  padding: $spacing-lg 0;
}

.latest-news__header {
  text-align: center;
  margin-bottom: $spacing-md;
}

.latest-news__title {
  @include flex-center;
  gap: $spacing-xs;
  margin: 0 0 $spacing-xs;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.latest-news__title-icon {
  font-size: $font-size-lg;
}

.latest-news__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// Category Tabs
.latest-news__tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
}

.latest-news__tab {
  padding: $spacing-xs $spacing-sm;
  background: transparent;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  color: $color-text-secondary;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $color-primary;
    border-color: $color-primary;
    background: rgba($color-primary, 0.1);
  }

  &.is-active {
    color: $color-bg-dark;
    background: $color-primary;
    border-color: $color-primary;
  }
}

// Loading State
.latest-news__loading {
  display: grid;
  gap: $spacing-sm;

  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

.latest-news__skeleton {
  display: flex;
  flex-direction: column;
  background: $color-bg-card;
  border-radius: $border-radius-md;
  overflow: hidden;

  .skeleton-image {
    width: 100%;
    height: 160px;
    background: linear-gradient(90deg, $color-bg-hover 25%, $color-bg-card 50%, $color-bg-hover 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-content {
    padding: $spacing-sm;
  }

  .skeleton-title {
    height: 20px;
    width: 80%;
    background: linear-gradient(90deg, $color-bg-hover 25%, $color-bg-card 50%, $color-bg-hover 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: $border-radius-sm;
    margin-bottom: $spacing-xs;
  }

  .skeleton-text {
    height: 14px;
    width: 100%;
    background: linear-gradient(90deg, $color-bg-hover 25%, $color-bg-card 50%, $color-bg-hover 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: $border-radius-sm;
    margin-bottom: $spacing-xs;
  }

  .skeleton-meta {
    height: 12px;
    width: 40%;
    background: linear-gradient(90deg, $color-bg-hover 25%, $color-bg-card 50%, $color-bg-hover 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: $border-radius-sm;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// News List
.latest-news__list {
  display: grid;
  gap: $spacing-sm;

  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

// News Card
.news-card {
  display: flex;
  flex-direction: column;
  background: $color-bg-card;
  border-radius: $border-radius-md;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: $color-border;

    .news-card__image {
      transform: scale(1.05);
    }

    .news-card__read-more {
      color: $color-primary;
    }
  }
}

.news-card__image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;

  @include respond-to('md') {
    height: 180px;
  }
}

.news-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-normal;
}

.news-card__category {
  position: absolute;
  top: $spacing-xs;
  left: $spacing-xs;
  padding: 4px $spacing-xs;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  background: rgba($color-bg-dark, 0.8);
  border-radius: $border-radius-sm;
  backdrop-filter: blur(4px);

  &.category--hero {
    background: rgba(#E84057, 0.9);
  }

  &.category--event {
    background: rgba(#0BC4E2, 0.9);
  }

  &.category--activity {
    background: rgba(#0ACF83, 0.9);
  }

  &.category--update {
    background: rgba(#F5A623, 0.9);
  }
}

.news-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: $spacing-sm;
}

.news-card__title {
  margin: 0 0 $spacing-xs;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  line-height: 1.4;
  @include text-truncate-lines(2);
}

.news-card__summary {
  margin: 0 0 $spacing-sm;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.5;
  flex: 1;
  @include text-truncate-lines(2);
}

.news-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-card__date {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.news-card__read-more {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  transition: color $transition-fast;
}

// Empty State
.latest-news__empty {
  grid-column: 1 / -1;
  @include flex-center;
  padding: $spacing-xl;
  color: $color-text-secondary;
  font-size: $font-size-md;
}

// List Transition Animation
.news-list-enter-active,
.news-list-leave-active {
  transition: all $transition-normal;
}

.news-list-enter-from,
.news-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.news-list-move {
  transition: transform $transition-normal;
}
</style>
