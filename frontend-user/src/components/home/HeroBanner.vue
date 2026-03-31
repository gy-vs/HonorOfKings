<script setup lang="ts">
/**
 * HeroBanner - 首页轮播图组件
 * Task 6.1: 实现 HeroBanner 轮播组件
 * Requirements: 1.1
 * 
 * Features:
 * - 使用 ref 控制当前索引
 * - 使用 Transition 实现切换动画
 * - 自动轮播功能
 * - 导航指示器和前后按钮
 * - 王者荣耀主题样式
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import type { BannerItem } from '@/types'

// Props interface
interface HeroBannerProps {
  items: BannerItem[]
  autoplay?: boolean
  interval?: number
}

// Define props with defaults
const props = withDefaults(defineProps<HeroBannerProps>(), {
  autoplay: true,
  interval: 5000
})

// Define emits
const emit = defineEmits<{
  (e: 'click', item: BannerItem): void
}>()

// Current slide index - using ref as per requirements
const currentIndex = ref(0)

// Transition direction for slide animation
const slideDirection = ref<'left' | 'right'>('left')

// Timer reference for autoplay
let autoplayTimer: ReturnType<typeof setInterval> | null = null

// Computed property for current banner item
const currentItem = computed(() => props.items[currentIndex.value])

// Computed property for total slides
const totalSlides = computed(() => props.items.length)

// Computed property to check if there are items
const hasItems = computed(() => props.items.length > 0)

/**
 * Go to next slide
 */
const nextSlide = (): void => {
  if (!hasItems.value) return
  slideDirection.value = 'left'
  currentIndex.value = (currentIndex.value + 1) % totalSlides.value
}

/**
 * Go to previous slide
 */
const prevSlide = (): void => {
  if (!hasItems.value) return
  slideDirection.value = 'right'
  currentIndex.value = (currentIndex.value - 1 + totalSlides.value) % totalSlides.value
}

/**
 * Go to specific slide by index
 */
const goToSlide = (index: number): void => {
  if (!hasItems.value || index === currentIndex.value) return
  slideDirection.value = index > currentIndex.value ? 'left' : 'right'
  currentIndex.value = index
}

/**
 * Handle banner click
 * Requirements: 1.1 - Banner carousel interaction
 */
const handleBannerClick = (): void => {
  if (currentItem.value) {
    emit('click', currentItem.value)
  }
}

/**
 * Start autoplay timer
 */
const startAutoplay = (): void => {
  if (!props.autoplay || !hasItems.value) return
  stopAutoplay()
  autoplayTimer = setInterval(nextSlide, props.interval)
}

/**
 * Stop autoplay timer
 */
const stopAutoplay = (): void => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

/**
 * Pause autoplay on hover
 */
const handleMouseEnter = (): void => {
  stopAutoplay()
}

/**
 * Resume autoplay on mouse leave
 */
const handleMouseLeave = (): void => {
  startAutoplay()
}

// Watch for autoplay prop changes
watch(() => props.autoplay, (newValue) => {
  if (newValue) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})

// Watch for items changes to reset index if needed
watch(() => props.items, (newItems) => {
  if (currentIndex.value >= newItems.length) {
    currentIndex.value = 0
  }
  if (props.autoplay) {
    startAutoplay()
  }
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div 
    class="hero-banner"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Empty State -->
    <div v-if="!hasItems" class="hero-banner__empty">
      <span>暂无轮播内容</span>
    </div>

    <!-- Banner Content -->
    <template v-else>
      <!-- Slide Container with Transition -->
      <div class="hero-banner__container">
        <Transition :name="`slide-${slideDirection}`" mode="out-in">
          <div 
            :key="currentIndex"
            class="hero-banner__slide"
            @click="handleBannerClick"
          >
            <img 
              :src="currentItem?.image" 
              :alt="currentItem?.title"
              class="hero-banner__image"
            />
            <!-- Overlay Gradient -->
            <div class="hero-banner__overlay" />
            <!-- Banner Title -->
            <div class="hero-banner__content">
              <h2 class="hero-banner__title">{{ currentItem?.title }}</h2>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Navigation Arrows -->
      <button 
        v-if="totalSlides > 1"
        class="hero-banner__nav hero-banner__nav--prev"
        aria-label="上一张"
        @click.stop="prevSlide"
      >
        <el-icon :size="24">
          <ArrowLeft />
        </el-icon>
      </button>
      <button 
        v-if="totalSlides > 1"
        class="hero-banner__nav hero-banner__nav--next"
        aria-label="下一张"
        @click.stop="nextSlide"
      >
        <el-icon :size="24">
          <ArrowRight />
        </el-icon>
      </button>

      <!-- Dot Indicators -->
      <div v-if="totalSlides > 1" class="hero-banner__indicators">
        <button
          v-for="(item, index) in items"
          :key="item.id"
          class="hero-banner__dot"
          :class="{ 'is-active': index === currentIndex }"
          :aria-label="`跳转到第 ${index + 1} 张`"
          :aria-current="index === currentIndex ? 'true' : undefined"
          @click.stop="goToSlide(index)"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.hero-banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: $border-radius-lg;
  background-color: $color-bg-card;

  @include respond-to('md') {
    height: 400px;
  }

  @include respond-to('lg') {
    height: 450px;
  }
}

.hero-banner__empty {
  @include flex-center;
  width: 100%;
  height: 100%;
  color: $color-text-secondary;
  font-size: $font-size-lg;
}

.hero-banner__container {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-banner__slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.hero-banner__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-slow;

  .hero-banner__slide:hover & {
    transform: scale(1.02);
  }
}

.hero-banner__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to top,
    rgba($color-bg-dark, 0.9) 0%,
    rgba($color-bg-dark, 0.5) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-banner__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  padding-bottom: $spacing-xl;

  @include respond-to('md') {
    padding: $spacing-xl;
    padding-bottom: 80px;
  }
}

.hero-banner__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  @include text-truncate-lines(2);

  @include respond-to('md') {
    font-size: $font-size-xxl;
  }
}

// Navigation Arrows
.hero-banner__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  @include flex-center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba($color-bg-dark, 0.6);
  border: 1px solid $color-border;
  border-radius: 50%;
  color: $color-text-primary;
  cursor: pointer;
  opacity: 0;
  transition: all $transition-fast;
  z-index: 10;

  .hero-banner:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba($color-bg-dark, 0.9);
    border-color: $color-primary;
    color: $color-primary;
    transform: translateY(-50%) scale(1.1);
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &--prev {
    left: $spacing-sm;

    @include respond-to('md') {
      left: $spacing-md;
    }
  }

  &--next {
    right: $spacing-sm;

    @include respond-to('md') {
      right: $spacing-md;
    }
  }
}

// Dot Indicators
.hero-banner__indicators {
  position: absolute;
  bottom: $spacing-md;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: $spacing-xs;
  z-index: 10;

  @include respond-to('md') {
    bottom: $spacing-lg;
  }
}

.hero-banner__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  background: rgba($color-text-primary, 0.4);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba($color-text-primary, 0.7);
    transform: scale(1.2);
  }

  &.is-active {
    width: 28px;
    border-radius: 5px;
    background: $color-primary;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

// Slide Transition Animations
// Slide Left (next)
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all $transition-normal;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

// Slide Right (prev)
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all $transition-normal;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
