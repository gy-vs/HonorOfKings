<script setup lang="ts">
/**
 * HeroListView - 英雄列表页
 * Task 7.1: 实现英雄分类筛选功能
 * - 使用 reactive 管理筛选状态
 * - 使用 watch 监听筛选变化
 * Requirements: 2.2
 * 
 * Task 7.3: 实现英雄搜索功能
 * - 使用 computed 实现实时过滤
 * - 搜索按英雄名称过滤（不区分大小写）
 * - 搜索与分类筛选组合使用
 * Requirements: 2.3
 * 
 * Task 7.5: 实现英雄列表展示
 * - 使用 TransitionGroup 实现列表动画
 * - 空状态处理
 * - 使用 HeroCard 组件展示英雄
 * - 点击卡片导航到英雄详情页
 * Requirements: 2.1, 2.5, 2.6
 */
import { reactive, computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { heroes } from '@/data/heroes'
import type { Hero, HeroRole } from '@/types'
import HeroCard from '@/components/common/HeroCard.vue'

// 英雄分类定义
interface CategoryItem {
  key: HeroRole | 'all'
  label: string
}

const categories: CategoryItem[] = [
  { key: 'all', label: '全部' },
  { key: 'warrior', label: '战士' },
  { key: 'mage', label: '法师' },
  { key: 'assassin', label: '刺客' },
  { key: 'marksman', label: '射手' },
  { key: 'support', label: '辅助' },
  { key: 'tank', label: '坦克' }
]

// 使用 reactive 管理筛选状态（包含分类和搜索）
const filterState = reactive({
  selectedCategory: 'all' as HeroRole | 'all',
  searchQuery: ''  // Task 7.3: 搜索关键词
})

// 使用 computed 计算过滤后的英雄列表（结合分类和搜索）
const filteredHeroes = computed(() => {
  let result = heroes

  // 分类筛选
  if (filterState.selectedCategory !== 'all') {
    result = result.filter(hero => hero.role === filterState.selectedCategory)
  }

  // 搜索筛选（不区分大小写，匹配部分名称）
  if (filterState.searchQuery.trim()) {
    const query = filterState.searchQuery.trim().toLowerCase()
    result = result.filter(hero => hero.name.toLowerCase().includes(query))
  }

  return result
})

// 使用 watch 监听筛选变化
watch(
  () => filterState.selectedCategory,
  (newCategory, oldCategory) => {
    console.log(`Category filter changed from "${oldCategory}" to "${newCategory}"`)
    // 可以在这里添加额外的副作用，如记录分析数据等
  }
)

// 监听搜索变化
watch(
  () => filterState.searchQuery,
  (newQuery, oldQuery) => {
    console.log(`Search query changed from "${oldQuery}" to "${newQuery}"`)
  }
)

// 清除搜索
const clearSearch = () => {
  filterState.searchQuery = ''
}

// 选择分类
const selectCategory = (category: HeroRole | 'all') => {
  filterState.selectedCategory = category
}

// 判断分类是否被选中
const isCategoryActive = (category: HeroRole | 'all') => {
  return filterState.selectedCategory === category
}

// Task 7.5: Router for navigation
const router = useRouter()

// Task 7.5: Loading state for transition animations
const isLoading = ref(false)

/**
 * Handle hero card click - navigate to hero detail page
 * Requirements: 2.4 - Navigate to hero detail page with hero ID as route parameter
 * Property 1: Hero Card Navigation Consistency
 */
const handleHeroClick = (hero: Hero): void => {
  router.push({
    name: 'hero-detail',
    params: { id: hero.id }
  })
}

// Simulate loading state when filters change (for transition effect)
watch(
  [() => filterState.selectedCategory, () => filterState.searchQuery],
  () => {
    isLoading.value = true
    // Short delay to show loading state
    setTimeout(() => {
      isLoading.value = false
    }, 150)
  }
)
</script>

<template>
  <div class="hero-list-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">英雄列表</h1>
      <p class="page-subtitle">浏览所有英雄，选择你的战场伙伴</p>
    </div>

    <!-- 搜索框 - Task 7.3 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </span>
        <input
          v-model="filterState.searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索英雄名称..."
          aria-label="搜索英雄"
        />
        <button
          v-if="filterState.searchQuery"
          class="clear-button"
          @click="clearSearch"
          aria-label="清除搜索"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 分类筛选标签 -->
    <div class="filter-section">
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.key"
          class="category-tab"
          :class="{ active: isCategoryActive(category.key) }"
          @click="selectCategory(category.key)"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- 英雄数量统计 -->
    <div class="hero-count">
      共 <span class="count-number">{{ filteredHeroes.length }}</span> 位英雄
    </div>

    <!-- Task 7.5: 英雄列表展示 -->
    <!-- Requirements: 2.1 - Display all heroes in a grid layout -->
    <!-- Requirements: 2.5 - Show loading state and display results with transition animation -->
    <div class="hero-grid-container" :class="{ 'is-loading': isLoading }">
      <!-- Empty State - Requirements: 2.6 -->
      <div v-if="filteredHeroes.length === 0 && !isLoading" class="empty-state">
        <div class="empty-state__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <path d="M8 8l6 6"></path>
            <path d="M14 8l-6 6"></path>
          </svg>
        </div>
        <h3 class="empty-state__title">未找到匹配的英雄</h3>
        <p class="empty-state__description">
          <template v-if="filterState.searchQuery && filterState.selectedCategory !== 'all'">
            没有找到名称包含"{{ filterState.searchQuery }}"的{{ categories.find(c => c.key === filterState.selectedCategory)?.label }}英雄
          </template>
          <template v-else-if="filterState.searchQuery">
            没有找到名称包含"{{ filterState.searchQuery }}"的英雄
          </template>
          <template v-else>
            当前分类下没有英雄
          </template>
        </p>
        <button class="empty-state__action" @click="clearSearch(); selectCategory('all')">
          查看全部英雄
        </button>
      </div>

      <!-- Hero Grid with TransitionGroup -->
      <TransitionGroup 
        v-else
        name="hero-list" 
        tag="div" 
        class="hero-grid"
      >
        <HeroCard
          v-for="hero in filteredHeroes"
          :key="hero.id"
          :hero="hero"
          class="hero-grid__item"
          @click="handleHeroClick"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-list-view {
  min-height: 100vh;
  padding: $spacing-md;
  background-color: $color-bg-dark;
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-lg;
  padding: $spacing-md 0;
}

.page-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin: 0 0 $spacing-xs 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: $font-size-md;
  color: $color-text-secondary;
  margin: 0;
}

// 搜索框样式 - Task 7.3
.search-section {
  max-width: 500px;
  margin: 0 auto $spacing-md;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: $color-bg-card;
  border: 1px solid $color-border-light;
  border-radius: $border-radius-lg;
  transition: all $transition-normal;

  &:hover {
    border-color: $color-primary;
  }

  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
  }
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: $spacing-sm;
  color: $color-text-secondary;
  pointer-events: none;
}

.search-input {
  flex: 1;
  padding: $spacing-sm;
  font-size: $font-size-md;
  color: $color-text-primary;
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: $color-text-secondary;
  }
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: $spacing-xs;
  padding: 0;
  color: $color-text-secondary;
  background: transparent;
  border: none;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $color-primary;
    background-color: $color-bg-hover;
  }

  &:active {
    transform: scale(0.95);
  }
}

.filter-section {
  margin-bottom: $spacing-md;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
}

.category-tab {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  min-width: 60px;

  &:hover {
    color: $color-primary;
    background-color: $color-bg-hover;
    border-color: $color-border-light;
  }

  &.active {
    color: $color-bg-dark;
    background-color: $color-primary;
    border-color: $color-primary;
    font-weight: $font-weight-bold;

    &:hover {
      background-color: $color-primary-light;
      border-color: $color-primary-light;
    }
  }
}

.hero-count {
  text-align: center;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-bottom: $spacing-md;

  .count-number {
    color: $color-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
  }
}

// Task 7.5: Hero Grid Container
.hero-grid-container {
  transition: opacity $transition-normal;

  &.is-loading {
    opacity: 0.6;
    pointer-events: none;
  }
}

// Task 7.5: Hero Grid - Responsive layout (2-6 columns based on screen size)
// Requirements: 2.1 - Display all heroes in a grid layout
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-md;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-sm;
  }
  
  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-sm;
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }
}

.hero-grid__item {
  // Ensure consistent sizing
  width: 100%;
}

// Task 7.5: TransitionGroup Animations
// Requirements: 2.5 - Display results with transition animation
.hero-list-move,
.hero-list-enter-active,
.hero-list-leave-active {
  transition: all 0.3s ease;
}

.hero-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.hero-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

// Ensure leaving items are taken out of layout flow
.hero-list-leave-active {
  position: absolute;
}

// Task 7.5: Empty State Styles
// Requirements: 2.6 - Display empty state message when no heroes match filters
.empty-state {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xl * 2;
  text-align: center;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
}

.empty-state__icon {
  color: $color-text-muted;
  margin-bottom: $spacing-md;
  opacity: 0.6;
}

.empty-state__title {
  margin: 0 0 $spacing-xs 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.empty-state__description {
  margin: 0 0 $spacing-md 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
  max-width: 400px;
}

.empty-state__action {
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-bg-dark;
  background-color: $color-primary;
  border: none;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background-color: $color-primary-light;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-primary, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: $breakpoint-md) {
  .hero-list-view {
    padding: $spacing-sm;
  }

  .page-title {
    font-size: $font-size-xl;
  }

  .search-section {
    margin-bottom: $spacing-sm;
  }

  .search-input {
    font-size: $font-size-sm;
    padding: $spacing-xs $spacing-sm;
  }

  .category-tabs {
    gap: 4px;
    padding: $spacing-xs;
  }

  .category-tab {
    padding: 6px $spacing-xs;
    font-size: $font-size-xs;
    min-width: 50px;
  }
}
</style>
