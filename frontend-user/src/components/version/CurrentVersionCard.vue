<script setup lang="ts">
/**
 * CurrentVersionCard - 当前版本卡片组件
 * Task 3.1: 实现 CurrentVersionCard 组件
 * Requirements: 1.1, 1.2, 1.3, 1.4
 * 
 * Features:
 * - 显示当前版本号、发布日期、状态和摘要
 * - 显示主要变更列表
 * - 提供版本详情页面链接
 * - 响应式设计
 */
import { computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { Version } from '@/types'

// Props interface
interface CurrentVersionCardProps {
  version: Version
}

// Define props
const props = defineProps<CurrentVersionCardProps>()

// Define emits
const emit = defineEmits<{
  (e: 'view-details', versionId: string): void
}>()

// Status display mapping
const statusDisplayMap: Record<string, { text: string; class: string }> = {
  active: { text: '活跃', class: 'status-active' },
  upcoming: { text: '即将推出', class: 'status-upcoming' },
  deprecated: { text: '已过期', class: 'status-deprecated' }
}

// Computed property for status display
const statusDisplay = computed(() => statusDisplayMap[props.version.status] || { text: props.version.status, class: '' })

// Format release date
const formattedDate = computed(() => {
  const date = new Date(props.version.releaseDate)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})

/**
 * Handle view details button click
 * Requirements: 1.1, 1.2, 1.3, 1.4 - Navigate to version details page
 */
const handleViewDetails = (): void => {
  emit('view-details', props.version.id)
}
</script>

<template>
  <div class="current-version-card">
    <!-- Header with version number and status -->
    <div class="current-version-card__header">
      <div class="current-version-card__title-section">
        <h2 class="current-version-card__version-number">
          版本 {{ version.versionNumber }}
        </h2>
        <span 
          class="current-version-card__status"
          :class="statusDisplay.class"
          :aria-label="`版本状态: ${statusDisplay.text}`"
        >
          {{ statusDisplay.text }}
        </span>
      </div>
      <p class="current-version-card__release-date">
        发布于 {{ formattedDate }}
      </p>
    </div>

    <!-- Summary section -->
    <div class="current-version-card__summary">
      <p class="current-version-card__summary-text">
        {{ version.summary }}
      </p>
    </div>

    <!-- Major changes section -->
    <div class="current-version-card__changes">
      <h3 class="current-version-card__changes-title">主要变更</h3>
      <ul class="current-version-card__changes-list">
        <li 
          v-for="(change, index) in version.majorChanges" 
          :key="index"
          class="current-version-card__change-item"
        >
          {{ change }}
        </li>
      </ul>
    </div>

    <!-- Footer with action button -->
    <div class="current-version-card__footer">
      <button 
        class="current-version-card__details-btn"
        @click="handleViewDetails"
        aria-label="查看版本详情"
      >
        查看详情
        <el-icon class="current-version-card__btn-icon">
          <ArrowRight />
        </el-icon>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.current-version-card {
  @include card-style;
  @include flex-column;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($color-primary, 0.05) 0%, rgba($color-primary, 0.02) 100%);
  border: 2px solid $color-primary;
  border-radius: $border-radius-md;
}

.current-version-card__header {
  @include flex-column;
  gap: $spacing-sm;
}

.current-version-card__title-section {
  @include flex-between;
  align-items: center;
  gap: $spacing-md;
}

.current-version-card__version-number {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.current-version-card__status {
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  white-space: nowrap;

  &.status-active {
    background-color: rgba($color-success, 0.1);
    color: $color-success;
    border: 1px solid $color-success;
  }

  &.status-upcoming {
    background-color: rgba($color-warning, 0.1);
    color: $color-warning;
    border: 1px solid $color-warning;
  }

  &.status-deprecated {
    background-color: rgba($color-info, 0.1);
    color: $color-info;
    border: 1px solid $color-info;
  }
}

.current-version-card__release-date {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.current-version-card__summary {
  padding: $spacing-md;
  background-color: rgba($color-bg-card, 0.5);
  border-radius: $border-radius-sm;
  border-left: 3px solid $color-primary;
}

.current-version-card__summary-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-primary;
  line-height: 1.6;
}

.current-version-card__changes {
  @include flex-column;
  gap: $spacing-sm;
}

.current-version-card__changes-title {
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.current-version-card__changes-list {
  margin: 0;
  padding-left: $spacing-md;
  list-style: none;

  @include flex-column;
  gap: $spacing-xs;
}

.current-version-card__change-item {
  position: relative;
  padding-left: $spacing-md;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.5;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: $color-success;
    font-weight: $font-weight-bold;
  }
}

.current-version-card__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: $spacing-md;
  border-top: 1px solid $color-border-light;
}

.current-version-card__details-btn {
  @include flex-center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background-color: $color-primary;
  color: white;
  border: none;
  border-radius: $border-radius-sm;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-normal;
  @include focus-ring;

  &:hover {
    background-color: darken($color-primary, 10%);
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(0);
  }
}

.current-version-card__btn-icon {
  font-size: $font-size-md;
  transition: transform $transition-normal;
}

.current-version-card__details-btn:hover .current-version-card__btn-icon {
  transform: translateX(4px);
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .current-version-card {
    padding: $spacing-md;
    gap: $spacing-md;
  }

  .current-version-card__title-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .current-version-card__version-number {
    font-size: $font-size-lg;
  }

  .current-version-card__summary {
    padding: $spacing-md;
  }
}

@media (max-width: $breakpoint-sm) {
  .current-version-card {
    padding: $spacing-md;
    gap: $spacing-sm;
  }

  .current-version-card__version-number {
    font-size: $font-size-md;
  }

  .current-version-card__summary-text {
    font-size: $font-size-sm;
  }

  .current-version-card__change-item {
    font-size: $font-size-sm;
  }

  .current-version-card__details-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
