<script setup lang="ts">
/**
 * HeroCard - 英雄卡片组件
 * Task 3.3: 实现 HeroCard 组件
 * Requirements: 1.3, 2.4, 8.4
 * 
 * Features:
 * - 使用 props 接收英雄数据
 * - 使用 emit 触发点击和收藏事件
 * - 使用 slots 实现内容定制
 * - 实现 hover 效果
 * 
 * Property 1: Hero Card Navigation Consistency
 * - Clicking the card emits 'click' event with hero data
 */
import { computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import type { Hero } from '@/types'

// Props interface
interface HeroCardProps {
  hero: Hero
  showFavorite?: boolean
  isFavorite?: boolean
}

// Define props with defaults
const props = withDefaults(defineProps<HeroCardProps>(), {
  showFavorite: false,
  isFavorite: false
})

// Define emits
const emit = defineEmits<{
  (e: 'click', hero: Hero): void
  (e: 'favorite', hero: Hero): void
}>()

// Role display mapping
const roleDisplayMap: Record<string, string> = {
  warrior: '战士',
  mage: '法师',
  assassin: '刺客',
  marksman: '射手',
  support: '辅助',
  tank: '坦克'
}

// Computed property for role display text
const roleDisplay = computed(() => roleDisplayMap[props.hero.role] || props.hero.role)

// Generate difficulty stars array
const difficultyStars = computed(() => {
  return Array.from({ length: 3 }, (_, index) => index < props.hero.difficulty)
})

/**
 * Handle card click
 * Requirements: 1.3, 2.4 - Navigate to hero detail page when card is clicked
 * Property 1: Hero Card Navigation Consistency
 */
const handleCardClick = (): void => {
  emit('click', props.hero)
}

/**
 * Handle favorite button click
 * Requirements: 3.5 - Add/remove hero from favorites
 * Property 5: Favorite Toggle Round-Trip
 */
const handleFavoriteClick = (event: Event): void => {
  // Stop propagation to prevent card click
  event.stopPropagation()
  emit('favorite', props.hero)
}
</script>

<template>
  <div 
    class="hero-card"
    role="button"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter="handleCardClick"
  >
    <!-- Header Slot -->
    <div v-if="$slots.header" class="hero-card__header-slot">
      <slot name="header" :hero="hero" />
    </div>

    <!-- Hero Avatar -->
    <div class="hero-card__avatar-wrapper">
      <img 
        :src="hero.avatar" 
        :alt="hero.name"
        class="hero-card__avatar"
        loading="lazy"
      />
      <!-- Role Badge -->
      <span class="hero-card__role-badge">{{ roleDisplay }}</span>
      
      <!-- Favorite Button -->
      <button
        v-if="showFavorite"
        class="hero-card__favorite-btn"
        :class="{ 'is-favorite': isFavorite }"
        :aria-label="isFavorite ? '取消收藏' : '添加收藏'"
        @click="handleFavoriteClick"
      >
        <el-icon :size="20">
          <StarFilled v-if="isFavorite" />
          <Star v-else />
        </el-icon>
      </button>
    </div>

    <!-- Hero Info -->
    <div class="hero-card__info">
      <h3 class="hero-card__name">{{ hero.name }}</h3>
      <p class="hero-card__title">{{ hero.title }}</p>
      
      <!-- Difficulty Indicator -->
      <div class="hero-card__difficulty" :aria-label="`难度: ${hero.difficulty}星`">
        <span class="hero-card__difficulty-label">难度</span>
        <div class="hero-card__difficulty-stars">
          <el-icon 
            v-for="(filled, index) in difficultyStars" 
            :key="index"
            :size="14"
            class="hero-card__star"
            :class="{ 'is-filled': filled }"
          >
            <StarFilled v-if="filled" />
            <Star v-else />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- Default Slot for custom content at bottom -->
    <div v-if="$slots.default" class="hero-card__footer-slot">
      <slot :hero="hero" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-card {
  @include card-style;
  display: flex;
  flex-direction: row;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  @include focus-ring;
  gap: $spacing-md;

  // Requirements: 8.4 - Hover effects with color transitions
  &:hover {
    .hero-card__avatar {
      transform: scale(1.05);
    }

    .hero-card__name {
      color: $color-primary;
    }
  }
}

.hero-card__header-slot {
  padding: $spacing-xs $spacing-sm;
  border-bottom: 1px solid $color-border-light;
}

.hero-card__avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: $color-bg-dark;
}

.hero-card__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-normal;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.hero-card__role-badge {
  position: absolute;
  top: $spacing-xs;
  left: $spacing-xs;
  padding: 2px $spacing-xs;
  background: rgba($color-bg-dark, 0.8);
  border: 1px solid $color-primary;
  border-radius: $border-radius-sm;
  color: $color-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

.hero-card__favorite-btn {
  position: absolute;
  top: $spacing-xs;
  right: $spacing-xs;
  @include flex-center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba($color-bg-dark, 0.8);
  border: 1px solid $color-border;
  border-radius: 50%;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba($color-bg-dark, 0.95);
    border-color: $color-primary;
    color: $color-primary;
    transform: scale(1.1);
  }

  &.is-favorite {
    color: $color-warning;
    border-color: $color-warning;

    &:hover {
      color: $color-warning;
      border-color: $color-warning;
    }
  }
}

.hero-card__info {
  @include flex-column;
  gap: $spacing-xs / 2;
  padding: $spacing-sm;
  flex: 1;
  min-width: 0;
}

.hero-card__name {
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  transition: color $transition-fast;
  @include text-truncate;
}

.hero-card__title {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  @include text-truncate;
}

.hero-card__difficulty {
  @include flex-between;
  margin-top: $spacing-xs / 2;
}

.hero-card__difficulty-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.hero-card__difficulty-stars {
  display: flex;
  gap: 2px;
}

.hero-card__star {
  color: $color-text-muted;
  transition: color $transition-fast;

  &.is-filled {
    color: $color-warning;
  }
}

.hero-card__footer-slot {
  padding: $spacing-xs $spacing-sm $spacing-sm;
  border-top: 1px solid $color-border-light;
}
</style>
