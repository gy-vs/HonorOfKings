<script setup lang="ts">
/**
 * ProfileView - 个人中心页
 * Task 12.1: 实现用户信息展示
 * Task 12.2: 实现收藏英雄展示
 * Task 12.3: 实现浏览历史展示
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 * 
 * Features:
 * - 用户头像、名称展示
 * - 统计数据（收藏数、历史记录数）
 * - 使用 Pinia store 获取用户数据
 * - 收藏英雄展示（从 Pinia store 获取）
 * - 移除收藏功能
 * - 浏览历史展示（带时间戳，按最新排序）
 * - 清除历史功能
 * 
 * Property 8: Favorites Display Store Consistency
 * - Profile page favorites section displays exactly the heroes whose IDs are in the favorites array
 * 
 * Property 9: History Display Store Consistency
 * - Profile page history section displays heroes matching the history array, ordered by timestamp (most recent first)
 * 
 * Property 10: Clear History Idempotence
 * - Calling clearHistory() results in an empty history array
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getHeroById } from '@/data/heroes'
import HeroCard from '@/components/common/HeroCard.vue'
import type { Hero } from '@/types'

// Router for navigation
const router = useRouter()

// User store for favorites and history data
const userStore = useUserStore()

// Page loading state for animation
const isPageLoaded = ref(false)

// Default avatar URL (placeholder)
const defaultAvatar = 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg'

/**
 * Interface for history item with hero data
 */
interface HistoryHeroItem {
  hero: Hero
  timestamp: number
}

/**
 * Computed property to get favorite heroes data
 * Maps hero IDs from store to full hero objects
 * Property 8: Favorites Display Store Consistency
 * Requirements: 6.2 - Retrieve favorite heroes from Pinia store
 */
const favoriteHeroes = computed<Hero[]>(() => {
  return userStore.favorites
    .map(heroId => getHeroById(heroId))
    .filter((hero): hero is Hero => hero !== undefined)
})

/**
 * Computed property to get history heroes with timestamps
 * Maps history items from store to full hero objects with timestamps
 * Property 9: History Display Store Consistency
 * Requirements: 6.5 - Show recently viewed heroes with timestamps
 * 
 * Uses sortedHistory from store which is already ordered by timestamp (most recent first)
 */
const historyHeroes = computed<HistoryHeroItem[]>(() => {
  return userStore.sortedHistory
    .map(item => {
      const hero = getHeroById(item.heroId)
      if (hero) {
        return { hero, timestamp: item.timestamp }
      }
      return null
    })
    .filter((item): item is HistoryHeroItem => item !== null)
})

/**
 * Format timestamp to readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  // Show relative time for recent items
  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins} 分钟前`
  } else if (diffHours < 24) {
    return `${diffHours} 小时前`
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else {
    // Show full date for older items
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
}

/**
 * Handle hero card click - navigate to hero detail page
 * Requirements: 6.3 - Navigate to hero detail page when clicking on a favorite hero
 */
const handleHeroClick = (hero: Hero): void => {
  router.push({ name: 'hero-detail', params: { id: hero.id } })
}

/**
 * Handle favorite toggle - remove hero from favorites
 * Requirements: 6.4 - Remove hero from favorites and display success toast
 */
const handleFavoriteToggle = (hero: Hero): void => {
  userStore.toggleFavorite(hero.id)
  // Display success toast notification
  // Requirements: 6.4 - Display success toast when removing from favorites
  ElMessage.success(`已将 ${hero.name} 从收藏移除`)
}

/**
 * Handle clear history button click
 * Property 10: Clear History Idempotence
 * Requirements: 6.6 - Remove all history items and display confirmation
 */
const handleClearHistory = async (): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '确定要清除所有浏览历史吗？此操作不可恢复。',
      '清除浏览历史',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // Clear history from store
    userStore.clearHistory()
    
    // Display confirmation toast
    // Requirements: 6.6 - Display confirmation after clearing history
    ElMessage.success('浏览历史已清除')
  } catch {
    // User cancelled, do nothing
  }
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
  <div class="profile-view" :class="{ 'is-loaded': isPageLoaded }">
    <div class="profile-view__container">
      <!-- User Info Section -->
      <section class="profile-view__user-info">
        <div class="user-card">
          <!-- User Avatar -->
          <div class="user-card__avatar-wrapper">
            <img 
              :src="defaultAvatar" 
              :alt="userStore.username"
              class="user-card__avatar"
            />
            <div class="user-card__avatar-border"></div>
          </div>
          
          <!-- User Details -->
          <div class="user-card__details">
            <h1 class="user-card__name">{{ userStore.username }}</h1>
            <p class="user-card__title">王者荣耀玩家</p>
          </div>
          
          <!-- Statistics -->
          <div class="user-card__stats">
            <div class="stat-item">
              <span class="stat-item__value">{{ userStore.favoriteCount }}</span>
              <span class="stat-item__label">收藏英雄</span>
            </div>
            <div class="stat-item__divider"></div>
            <div class="stat-item">
              <span class="stat-item__value">{{ userStore.historyCount }}</span>
              <span class="stat-item__label">浏览记录</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Placeholder for future sections (Tasks 12.2 and 12.3) -->
      <section class="profile-view__content">
        <!-- Favorites Section - Task 12.2 -->
        <div class="favorites-section">
          <div class="section-header">
            <h2 class="section-header__title">收藏英雄</h2>
            <span class="section-header__count">{{ userStore.favoriteCount }} 位英雄</span>
          </div>
          
          <!-- Favorites Grid with TransitionGroup -->
          <TransitionGroup 
            v-if="favoriteHeroes.length > 0"
            name="hero-list"
            tag="div"
            class="favorites-section__grid"
          >
            <HeroCard
              v-for="hero in favoriteHeroes"
              :key="hero.id"
              :hero="hero"
              :show-favorite="true"
              :is-favorite="true"
              @click="handleHeroClick"
              @favorite="handleFavoriteToggle"
            />
          </TransitionGroup>
          
          <!-- Empty State -->
          <div v-else class="favorites-section__empty">
            <div class="empty-state">
              <div class="empty-state__icon">⭐</div>
              <h3 class="empty-state__title">暂无收藏英雄</h3>
              <p class="empty-state__description">
                浏览英雄列表，点击收藏按钮添加你喜欢的英雄
              </p>
              <router-link to="/heroes" class="empty-state__link">
                去看看英雄
              </router-link>
            </div>
          </div>
        </div>

        <!-- History Section - Task 12.3 -->
        <div class="history-section">
          <div class="section-header">
            <h2 class="section-header__title">浏览历史</h2>
            <div class="section-header__actions">
              <span class="section-header__count">{{ userStore.historyCount }} 条记录</span>
              <button 
                v-if="historyHeroes.length > 0"
                class="clear-history-btn"
                @click="handleClearHistory"
              >
                清除历史
              </button>
            </div>
          </div>
          
          <!-- History List with TransitionGroup -->
          <TransitionGroup 
            v-if="historyHeroes.length > 0"
            name="history-list"
            tag="div"
            class="history-section__list"
          >
            <div 
              v-for="item in historyHeroes"
              :key="`${item.hero.id}-${item.timestamp}`"
              class="history-item"
              @click="handleHeroClick(item.hero)"
            >
              <div class="history-item__avatar">
                <img 
                  :src="item.hero.avatar" 
                  :alt="item.hero.name"
                  class="history-item__image"
                />
              </div>
              <div class="history-item__info">
                <h3 class="history-item__name">{{ item.hero.name }}</h3>
                <p class="history-item__title">{{ item.hero.title }}</p>
              </div>
              <div class="history-item__timestamp">
                {{ formatTimestamp(item.timestamp) }}
              </div>
            </div>
          </TransitionGroup>
          
          <!-- Empty State -->
          <div v-else class="history-section__empty">
            <div class="empty-state">
              <div class="empty-state__icon">📜</div>
              <h3 class="empty-state__title">暂无浏览历史</h3>
              <p class="empty-state__description">
                浏览英雄详情页后，这里会显示你的浏览记录
              </p>
              <router-link to="/heroes" class="empty-state__link">
                去看看英雄
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  min-height: 100vh;
  background-color: $color-bg-dark;
  padding: $spacing-md;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity $transition-normal, transform $transition-normal;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }

  @include respond-to('md') {
    padding: $spacing-lg;
  }
}

.profile-view__container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-view__user-info {
  margin-bottom: $spacing-lg;
}

// User Card Styles
.user-card {
  background: linear-gradient(135deg, $color-bg-card 0%, darken($color-bg-card, 5%) 100%);
  border: 1px solid $color-border;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: $shadow-card;
  position: relative;
  overflow: hidden;

  // Decorative background pattern
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(180deg, rgba($color-primary, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }

  @include respond-to('md') {
    flex-direction: row;
    text-align: left;
    padding: $spacing-xl;
  }
}

.user-card__avatar-wrapper {
  position: relative;
  margin-bottom: $spacing-md;
  z-index: 1;

  @include respond-to('md') {
    margin-bottom: 0;
    margin-right: $spacing-lg;
  }
}

.user-card__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid $color-primary;
  box-shadow: 0 0 20px rgba($color-primary, 0.3);

  @include respond-to('md') {
    width: 120px;
    height: 120px;
  }
}

.user-card__avatar-border {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba($color-primary, 0.3);
  border-radius: 50%;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.user-card__details {
  flex: 1;
  z-index: 1;
  margin-bottom: $spacing-md;

  @include respond-to('md') {
    margin-bottom: 0;
  }
}

.user-card__name {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0 0 $spacing-xs;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @include respond-to('md') {
    font-size: $font-size-xxl;
  }
}

.user-card__title {
  font-size: $font-size-sm;
  color: $color-primary;
  margin: 0;
  letter-spacing: 1px;
}

.user-card__stats {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  z-index: 1;
  background: rgba($color-bg-dark, 0.5);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  border: 1px solid $color-border-light;

  @include respond-to('md') {
    margin-left: auto;
    padding: $spacing-md $spacing-lg;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-item__value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-primary;
  line-height: 1;
  margin-bottom: $spacing-xs;

  @include respond-to('md') {
    font-size: $font-size-xxl;
  }
}

.stat-item__label {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  white-space: nowrap;

  @include respond-to('md') {
    font-size: $font-size-sm;
  }
}

.stat-item__divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    $color-border 50%,
    transparent 100%
  );
}

.profile-view__content {
  // Placeholder for future content sections
  // Will be populated in Tasks 12.2 and 12.3
}

// Favorites Section Styles - Task 12.2
.favorites-section {
  margin-bottom: $spacing-lg;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $color-border;
}

.section-header__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: $color-primary;
    margin-right: $spacing-sm;
    vertical-align: middle;
    border-radius: 2px;
  }
}

.section-header__count {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.favorites-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-md;

  @include respond-to('sm') {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  @include respond-to('md') {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

// TransitionGroup animations for hero list
.hero-list-enter-active,
.hero-list-leave-active {
  transition: all $transition-normal;
}

.hero-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.hero-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.hero-list-move {
  transition: transform $transition-normal;
}

// Empty State Styles
.favorites-section__empty {
  padding: $spacing-xl 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $spacing-xl;
  background: rgba($color-bg-card, 0.5);
  border: 1px dashed $color-border;
  border-radius: $border-radius-lg;
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: $spacing-md;
  opacity: 0.6;
}

.empty-state__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0 0 $spacing-xs;
}

.empty-state__description {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin: 0 0 $spacing-md;
  max-width: 300px;
}

.empty-state__link {
  display: inline-block;
  padding: $spacing-sm $spacing-lg;
  background: $color-primary;
  color: $color-bg-dark;
  font-weight: $font-weight-medium;
  text-decoration: none;
  border-radius: $border-radius-md;
  transition: all $transition-fast;

  &:hover {
    background: lighten($color-primary, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-primary, 0.3);
  }
}

// History Section Styles - Task 12.3
.history-section {
  margin-top: $spacing-lg;
}

.section-header__actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.clear-history-btn {
  padding: $spacing-xs $spacing-sm;
  background: transparent;
  color: $color-text-secondary;
  border: 1px solid $color-border;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: #ff6b6b;
    border-color: #ff6b6b;
    background: rgba(#ff6b6b, 0.1);
  }
}

.history-section__list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.history-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-bg-card, 0.6);
  border: 1px solid $color-border-light;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba($color-bg-card, 0.9);
    border-color: $color-primary;
    transform: translateX(4px);
    box-shadow: $shadow-hover;
  }
}

.history-item__avatar {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: $border-radius-sm;
  overflow: hidden;
  border: 2px solid $color-border;
  transition: border-color $transition-fast;

  .history-item:hover & {
    border-color: $color-primary;
  }
}

.history-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-item__info {
  flex: 1;
  min-width: 0;
}

.history-item__name {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item__title {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item__timestamp {
  flex-shrink: 0;
  font-size: $font-size-xs;
  color: $color-text-secondary;
  padding: $spacing-xs $spacing-sm;
  background: rgba($color-bg-dark, 0.5);
  border-radius: $border-radius-sm;
  white-space: nowrap;
}

// TransitionGroup animations for history list
.history-list-enter-active,
.history-list-leave-active {
  transition: all $transition-normal;
}

.history-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.history-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.history-list-move {
  transition: transform $transition-normal;
}

// History section empty state
.history-section__empty {
  padding: $spacing-xl 0;
}
</style>
