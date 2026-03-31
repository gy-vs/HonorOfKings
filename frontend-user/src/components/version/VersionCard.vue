<script setup lang="ts">
/**
 * VersionCard - 版本卡片组件（可复用）
 * Task 3.3: 实现 VersionCard 组件
 * Requirements: 2.2, 2.4
 * 
 * Features:
 * - 显示版本号、发布日期、摘要和更新数量
 * - 指示是否为当前版本
 * - 处理点击导航到版本详情
 * - 响应式设计
 */
import { computed } from 'vue'
import { Check } from '@element-plus/icons-vue'
import type { Version } from '@/types'

// Props interface
interface VersionCardProps {
  version: Version
  isCurrent?: boolean
}

// Define props with defaults
const props = withDefaults(defineProps<VersionCardProps>(), {
  isCurrent: false
})

// Define emits
const emit = defineEmits<{
  (e: 'click', versionId: string): void
}>()

// Format release date
const formattedDate = computed(() => {
  const date = new Date(props.version.releaseDate)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
})

// Calculate update count
const updateCount = computed(() => props.version.updateContent.length)

/**
 * Handle card click
 * Requirements: 2.2, 2.4 - Navigate to version details page when card is clicked
 */
const handleCardClick = (): void => {
  emit('click', props.version.id)
}

/**
 * Handle keyboard navigation
 */
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleCardClick()
  }
}
</script>

<template>
  <div 
    class="version-card"
    :class="{ 'is-current': isCurrent }"
    role="button"
    tabindex="0"
    @click="handleCardClick"
    @keydown="handleKeydown"
  >
    <!-- Current version indicator -->
    <div v-if="isCurrent" class="version-card__current-badge">
      <el-icon :size="16">
        <Check />
      </el-icon>
      <span>当前版本</span>
    </div>

    <!-- Version number -->
    <h3 class="version-card__version-number">
      {{ version.versionNumber }}
    </h3>

    <!-- Release date -->
    <p class="version-card__release-date">
      {{ formattedDate }}
    </p>

    <!-- Summary -->
    <p class="version-card__summary">
      {{ version.summary }}
    </p>

    <!-- Update count -->
    <div class="version-card__footer">
      <span class="version-card__update-count">
        {{ updateCount }} 项更新
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.version-card {
  @include card-style;
  @include flex-column;
  gap: $spacing-sm;
  padding: $spacing-md;
  position: relative;
  cursor: pointer;
  transition: all $transition-normal;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  @include focus-ring;

  &:hover {
    border-color: $color-primary;
    box-shadow: 0 4px 12px rgba($color-primary, 0.15);
    transform: translateY(-2px);
  }

  &.is-current {
    border-color: $color-primary;
    background: linear-gradient(135deg, rgba($color-primary, 0.05) 0%, rgba($color-primary, 0.02) 100%);
    box-shadow: 0 2px 8px rgba($color-primary, 0.1);
  }
}

.version-card__current-badge {
  @include flex-center;
  gap: $spacing-xs / 2;
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  padding: 4px $spacing-sm;
  background-color: $color-success;
  color: white;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

.version-card__version-number {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  transition: color $transition-fast;
}

.version-card:hover .version-card__version-number {
  color: $color-primary;
}

.version-card__release-date {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.version-card__summary {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-primary;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.version-card__footer {
  @include flex-between;
  margin-top: $spacing-xs;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-border-light;
}

.version-card__update-count {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .version-card {
    padding: $spacing-md;
    gap: $spacing-sm;
  }

  .version-card__version-number {
    font-size: $font-size-md;
  }

  .version-card__summary {
    font-size: $font-size-sm;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-card {
    padding: $spacing-sm;
    gap: $spacing-xs;
  }

  .version-card__current-badge {
    top: $spacing-xs;
    right: $spacing-xs;
    padding: 3px $spacing-xs;
    font-size: $font-size-xs;
  }

  .version-card__version-number {
    font-size: $font-size-md;
  }

  .version-card__summary {
    font-size: $font-size-sm;
    -webkit-line-clamp: 1;
  }

  .version-card__update-count {
    font-size: $font-size-xs;
  }
}
</style>
