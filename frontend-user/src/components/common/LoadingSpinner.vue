<script setup lang="ts">
/**
 * LoadingSpinner - 加载动画组件
 * Task 3.6: 实现 LoadingSpinner 组件
 * Requirements: 2.5, 5.5
 * 
 * Features:
 * - Display a loading spinner animation
 * - Support optional loading text
 * - Support different sizes (small, medium, large)
 * - Apply Honor of Kings theme styling (gold color)
 * - Can be used as overlay or inline
 */
import { computed } from 'vue'

// Props interface
interface LoadingSpinnerProps {
  /** Spinner size: 'small' | 'medium' | 'large' */
  size?: 'small' | 'medium' | 'large'
  /** Optional loading text to display below spinner */
  text?: string
  /** Whether to show as full overlay covering parent container */
  overlay?: boolean
}

// Define props with defaults
const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'medium',
  text: '',
  overlay: false
})

// Size configuration mapping
const sizeConfig = {
  small: {
    spinnerSize: 24,
    borderWidth: 2,
    fontSize: '12px'
  },
  medium: {
    spinnerSize: 40,
    borderWidth: 3,
    fontSize: '14px'
  },
  large: {
    spinnerSize: 56,
    borderWidth: 4,
    fontSize: '16px'
  }
}

// Computed styles for spinner
const spinnerStyle = computed(() => {
  const config = sizeConfig[props.size]
  return {
    width: `${config.spinnerSize}px`,
    height: `${config.spinnerSize}px`,
    borderWidth: `${config.borderWidth}px`
  }
})

// Computed styles for text
const textStyle = computed(() => {
  const config = sizeConfig[props.size]
  return {
    fontSize: config.fontSize
  }
})
</script>

<template>
  <div 
    class="loading-spinner"
    :class="{ 
      'loading-spinner--overlay': overlay,
      [`loading-spinner--${size}`]: true
    }"
    role="status"
    aria-live="polite"
    :aria-label="text || '加载中'"
  >
    <div class="loading-spinner__content">
      <!-- Spinner Animation -->
      <div 
        class="loading-spinner__spinner"
        :style="spinnerStyle"
      >
        <div class="loading-spinner__inner"></div>
      </div>
      
      <!-- Loading Text -->
      <span 
        v-if="text" 
        class="loading-spinner__text"
        :style="textStyle"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Spinner animation keyframes
@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.loading-spinner {
  @include flex-center;

  // Inline mode (default)
  &:not(.loading-spinner--overlay) {
    padding: $spacing-sm;
  }

  // Overlay mode - covers parent container
  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color-bg-dark, 0.85);
    z-index: $z-index-modal-backdrop;
    backdrop-filter: blur(2px);
  }
}

.loading-spinner__content {
  @include flex-column;
  @include flex-center;
  gap: $spacing-sm;
}

.loading-spinner__spinner {
  position: relative;
  border-radius: 50%;
  border-style: solid;
  border-color: rgba($color-primary, 0.2);
  border-top-color: $color-primary;
  border-right-color: $color-primary;
  animation: spinner-rotate 1s linear infinite;
  box-shadow: 
    0 0 10px rgba($color-primary, 0.3),
    inset 0 0 10px rgba($color-primary, 0.1);
}

.loading-spinner__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, $color-primary 0%, transparent 70%);
  border-radius: 50%;
  animation: spinner-pulse 1.5s ease-in-out infinite;
}

.loading-spinner__text {
  color: $color-primary;
  font-weight: $font-weight-medium;
  text-align: center;
  animation: spinner-pulse 1.5s ease-in-out infinite;
  text-shadow: 0 0 10px rgba($color-primary, 0.5);
}

// Size-specific adjustments
.loading-spinner--small {
  .loading-spinner__content {
    gap: $spacing-xs;
  }
}

.loading-spinner--large {
  .loading-spinner__content {
    gap: $spacing-md;
  }
  
  .loading-spinner__spinner {
    box-shadow: 
      0 0 20px rgba($color-primary, 0.4),
      inset 0 0 15px rgba($color-primary, 0.15);
  }
}
</style>
