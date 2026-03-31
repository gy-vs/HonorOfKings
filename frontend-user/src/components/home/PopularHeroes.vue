<script setup lang="ts">
/**
 * PopularHeroes - 热门英雄区块组件
 * Task 6.2: 实现 PopularHeroes 热门英雄区块
 * Requirements: 1.2, 1.3
 * 
 * Features:
 * - 使用 computed 计算热门英雄
 * - 使用 HeroCard 组件展示
 * - Emit click event when a hero card is clicked (for navigation)
 * - Apply responsive grid layout
 * - Apply Honor of Kings theme styling
 */
import { computed } from 'vue'
import HeroCard from '@/components/common/HeroCard.vue'
import { popularHeroes } from '@/data/heroes'
import type { Hero } from '@/types'

// Props interface
interface PopularHeroesProps {
  /** Maximum number of heroes to display */
  maxHeroes?: number
}

// Define props with defaults
const props = withDefaults(defineProps<PopularHeroesProps>(), {
  maxHeroes: 6
})

// Define emits
const emit = defineEmits<{
  /** Emitted when a hero card is clicked, for navigation to hero detail page */
  (e: 'hero-click', hero: Hero): void
}>()

/**
 * Computed property to get popular heroes
 * Requirements: 1.2 - Display a list of popular heroes with hover effects
 */
const displayedHeroes = computed<Hero[]>(() => {
  return popularHeroes.slice(0, props.maxHeroes)
})

/**
 * Handle hero card click
 * Requirements: 1.3 - Navigate to hero detail page when card is clicked
 */
const handleHeroClick = (hero: Hero): void => {
  emit('hero-click', hero)
}
</script>

<template>
  <section class="popular-heroes" aria-labelledby="popular-heroes-title">
    <!-- Section Header -->
    <div class="popular-heroes__header">
      <h2 id="popular-heroes-title" class="popular-heroes__title">
        <span class="popular-heroes__title-icon">🔥</span>
        热门英雄
      </h2>
      <p class="popular-heroes__subtitle">最受玩家喜爱的英雄</p>
    </div>

    <!-- Heroes Grid -->
    <div class="popular-heroes__grid">
      <HeroCard
        v-for="hero in displayedHeroes"
        :key="hero.id"
        :hero="hero"
        class="popular-heroes__card"
        @click="handleHeroClick"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.popular-heroes {
  padding: $spacing-lg 0;
}

.popular-heroes__header {
  text-align: center;
  margin-bottom: $spacing-lg;
}

.popular-heroes__title {
  @include flex-center;
  gap: $spacing-xs;
  margin: 0 0 $spacing-xs;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.popular-heroes__title-icon {
  font-size: $font-size-lg;
}

.popular-heroes__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.popular-heroes__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-md;

  // Responsive grid layout
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

.popular-heroes__card {
  // Ensure cards have consistent sizing
  min-width: 0;
}
</style>
