<script setup lang="ts">
/**
 * UpdateContentSection - 更新内容展示组件
 * Task 6.1: 实现 UpdateContentSection 组件
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 * 
 * Features:
 * - 按分类组织更新内容（英雄、皮肤、平衡、bug修复、其他）
 * - 显示每个变更的描述
 * - 为新内容显示图片/图标
 * - 为平衡调整显示前后对比
 * - 响应式设计
 */
import { computed } from 'vue'
import type { UpdateContent, UpdateCategory } from '@/types'

// Props interface
interface UpdateContentSectionProps {
  updateContent: UpdateContent[]
}

// Define props
const props = defineProps<UpdateContentSectionProps>()

// Category display configuration
const categoryConfig: Record<UpdateCategory, { label: string; icon: string; color: string }> = {
  heroes: { label: '新英雄', icon: '⚔️', color: '#FF6B6B' },
  skins: { label: '新皮肤', icon: '🎨', color: '#4ECDC4' },
  balance: { label: '平衡调整', icon: '⚖️', color: '#FFE66D' },
  bugFixes: { label: 'Bug修复', icon: '🐛', color: '#95E1D3' },
  other: { label: '其他', icon: '📝', color: '#A8DADC' }
}

// Group updates by category
const groupedUpdates = computed(() => {
  const grouped: Record<UpdateCategory, UpdateContent[]> = {
    heroes: [],
    skins: [],
    balance: [],
    bugFixes: [],
    other: []
  }

  // Sort updates by order and group by category
  const sortedUpdates = [...props.updateContent].sort((a, b) => a.order - b.order)
  
  sortedUpdates.forEach(update => {
    if (grouped[update.category]) {
      grouped[update.category].push(update)
    }
  })

  return grouped
})

// Get categories that have content
const activeCategories = computed(() => {
  return (Object.keys(categoryConfig) as UpdateCategory[]).filter(
    category => groupedUpdates.value[category].length > 0
  )
})

/**
 * Format comparison value for display
 */
const formatComparisonValue = (value: any): string => {
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ')
  }
  return String(value)
}

/**
 * Check if update has image
 */
const hasImage = (update: UpdateContent): boolean => {
  return !!update.imageUrl
}

/**
 * Check if update has comparison data
 */
const hasComparison = (update: UpdateContent): boolean => {
  return update.beforeValue !== undefined && update.afterValue !== undefined
}
</script>

<template>
  <div class="update-content-section">
    <!-- Empty state -->
    <div v-if="updateContent.length === 0" class="update-content-section__empty">
      <p class="update-content-section__empty-text">暂无更新内容</p>
    </div>

    <!-- Content by category -->
    <div v-else class="update-content-section__content">
      <!-- Category sections -->
      <div
        v-for="category in activeCategories"
        :key="category"
        class="update-content-section__category"
      >
        <!-- Category header -->
        <div class="update-content-section__category-header">
          <span class="update-content-section__category-icon">
            {{ categoryConfig[category].icon }}
          </span>
          <h3 class="update-content-section__category-title">
            {{ categoryConfig[category].label }}
          </h3>
          <span class="update-content-section__category-count">
            {{ groupedUpdates[category].length }}
          </span>
        </div>

        <!-- Category items -->
        <div class="update-content-section__items">
          <div
            v-for="update in groupedUpdates[category]"
            :key="update.id"
            class="update-content-section__item"
          >
            <!-- Item header with title -->
            <div class="update-content-section__item-header">
              <h4 class="update-content-section__item-title">
                {{ update.title }}
              </h4>
            </div>

            <!-- Item description -->
            <p class="update-content-section__item-description">
              {{ update.description }}
            </p>

            <!-- Image display for new content -->
            <div v-if="hasImage(update)" class="update-content-section__image-container">
              <img
                :src="update.imageUrl"
                :alt="update.title"
                class="update-content-section__image"
                loading="lazy"
              />
            </div>

            <!-- Before/after comparison for balance adjustments -->
            <div v-if="hasComparison(update)" class="update-content-section__comparison">
              <div class="update-content-section__comparison-item">
                <span class="update-content-section__comparison-label">调整前</span>
                <span class="update-content-section__comparison-value before">
                  {{ formatComparisonValue(update.beforeValue) }}
                </span>
              </div>

              <div class="update-content-section__comparison-arrow">
                →
              </div>

              <div class="update-content-section__comparison-item">
                <span class="update-content-section__comparison-label">调整后</span>
                <span class="update-content-section__comparison-value after">
                  {{ formatComparisonValue(update.afterValue) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.update-content-section {
  @include flex-column;
  gap: $spacing-lg;
  width: 100%;
}

.update-content-section__empty {
  @include flex-center;
  padding: $spacing-xl;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border: 1px dashed $color-border;
}

.update-content-section__empty-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
}

.update-content-section__content {
  @include flex-column;
  gap: $spacing-lg;
}

.update-content-section__category {
  @include flex-column;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border-left: 4px solid $color-primary;
}

.update-content-section__category-header {
  @include flex-between;
  align-items: center;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $color-border-light;
}

.update-content-section__category-icon {
  font-size: $font-size-xl;
  display: inline-block;
}

.update-content-section__category-title {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  flex: 1;
}

.update-content-section__category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 $spacing-xs;
  background-color: $color-primary;
  color: white;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}

.update-content-section__items {
  @include flex-column;
  gap: $spacing-md;
}

.update-content-section__item {
  @include flex-column;
  gap: $spacing-sm;
  padding: $spacing-md;
  background-color: white;
  border-radius: $border-radius-sm;
  border: 1px solid $color-border-light;
  transition: all $transition-normal;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: $color-primary;
  }
}

.update-content-section__item-header {
  @include flex-between;
  align-items: flex-start;
  gap: $spacing-md;
}

.update-content-section__item-title {
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  line-height: 1.4;
}

.update-content-section__item-description {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.update-content-section__image-container {
  @include flex-center;
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: $border-radius-sm;
  background-color: $color-bg-card;
  border: 1px solid $color-border-light;
}

.update-content-section__image {
 
  height: 100%;
  object-fit: cover;
  transition: transform $transition-normal;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;

  .update-content-section__item:hover & {
    transform: scale(1.02);
  }
}

.update-content-section__comparison {
  @include flex-center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: rgba($color-warning, 0.05);
  border-radius: $border-radius-sm;
  border: 1px solid rgba($color-warning, 0.2);
}

.update-content-section__comparison-item {
  @include flex-column;
  gap: $spacing-xs;
  flex: 1;
  text-align: center;
}

.update-content-section__comparison-label {
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  color: $color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.update-content-section__comparison-value {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  background-color: white;
  border: 1px solid $color-border-light;

  &.before {
    color: $color-info;
  }

  &.after {
    color: $color-success;
  }
}

.update-content-section__comparison-arrow {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-warning;
  flex-shrink: 0;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .update-content-section {
    gap: $spacing-md;
  }

  .update-content-section__category {
    padding: $spacing-md;
    gap: $spacing-md;
  }

  .update-content-section__category-header {
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  .update-content-section__item {
    padding: $spacing-md;
    gap: $spacing-sm;
  }

  .update-content-section__comparison {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .update-content-section__comparison-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: $breakpoint-sm) {
  .update-content-section {
    gap: $spacing-md;
  }

  .update-content-section__category {
    padding: $spacing-sm;
    gap: $spacing-sm;
    border-left-width: 3px;
  }

  .update-content-section__category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-xs;
    padding-bottom: $spacing-sm;
  }

  .update-content-section__category-title {
    font-size: $font-size-md;
  }

  .update-content-section__item {
    padding: $spacing-sm;
    gap: $spacing-xs;
  }

  .update-content-section__item-title {
    font-size: $font-size-sm;
  }

  .update-content-section__item-description {
    font-size: $font-size-xs;
  }

  .update-content-section__image-container {
    max-height: 200px;
  }

  .update-content-section__comparison {
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-sm;
  }

  .update-content-section__comparison-item {
    gap: $spacing-xs;
  }

  .update-content-section__comparison-label {
    font-size: $font-size-xs;
  }

  .update-content-section__comparison-value {
    font-size: $font-size-sm;
  }

  .update-content-section__comparison-arrow {
    font-size: $font-size-md;
  }
}
</style>
