<script setup lang="ts">
/**
 * VersionTimeline - 版本时间线组件
 * Task 4.3: 实现 VersionTimeline 组件
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 * 
 * Features:
 * - 渲染显示版本发布时间的可视化时间线
 * - 清晰标记当前版本
 * - 悬停/点击时显示版本信息
 * - 点击时导航到版本详情页面
 * - 显示至少12个月的版本历史
 * - 响应式设计
 */
import { computed, ref } from 'vue'
import { useVersionStore } from '@/stores/version'
import type { Version } from '@/types'

// Store
const versionStore = useVersionStore()

// State
const hoveredVersionId = ref<string | null>(null)

// Computed properties
const sortedVersions = computed(() => {
  // Sort versions in chronological order (oldest first) for timeline display
  return [...versionStore.getFilteredVersions].sort((a: Version, b: Version) => 
    new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  )
})

const currentVersionId = computed(() => versionStore.currentVersion?.id)

const timelineData = computed(() => {
  if (sortedVersions.value.length === 0) return []

  // Get date range for timeline
  const dates = sortedVersions.value.map(v => new Date(v.releaseDate).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  
  // Ensure at least 12 months of history
  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())
  const timelineStart = Math.min(minDate, twelveMonthsAgo.getTime())
  const timelineEnd = maxDate

  const totalDuration = timelineEnd - timelineStart

  return sortedVersions.value.map((version: Version) => {
    const versionDate = new Date(version.releaseDate).getTime()
    const position = ((versionDate - timelineStart) / totalDuration) * 100

    return {
      ...version,
      position,
      formattedDate: new Date(version.releaseDate).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  })
})

const hasVersions = computed(() => sortedVersions.value.length > 0)

// Methods
/**
 * Handle timeline point click
 * Requirements: 4.4 - Navigate to version details page
 */
const handleTimelinePointClick = (versionId: string): void => {
  emit('version-selected', versionId)
}

/**
 * Handle mouse enter on timeline point
 */
const handleMouseEnter = (versionId: string): void => {
  hoveredVersionId.value = versionId
}

/**
 * Handle mouse leave on timeline point
 */
const handleMouseLeave = (): void => {
  hoveredVersionId.value = null
}

/**
 * Handle keyboard navigation
 */
const handleKeydown = (event: KeyboardEvent, versionId: string): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleTimelinePointClick(versionId)
  }
}

// Define emits
const emit = defineEmits<{
  (e: 'version-selected', versionId: string): void
}>()
</script>

<template>
  <div class="version-timeline">
    <!-- Header -->
    <div class="version-timeline__header">
      <h2 class="version-timeline__title">版本时间线</h2>
      <p class="version-timeline__subtitle">
        显示过去12个月的版本发布历史
      </p>
    </div>

    <!-- Empty state -->
    <div v-if="!hasVersions" class="version-timeline__empty">
      <p class="version-timeline__empty-text">暂无版本数据</p>
    </div>

    <!-- Timeline -->
    <div v-else class="version-timeline__container">
      <!-- Timeline line -->
      <div class="version-timeline__line"></div>

      <!-- Timeline points -->
      <div class="version-timeline__points">
        <div
          v-for="item in timelineData"
          :key="item.id"
          class="version-timeline__point-wrapper"
          :style="{ left: `${item.position}%` }"
        >
          <!-- Timeline point -->
          <button
            class="version-timeline__point"
            :class="{
              'is-current': item.id === currentVersionId,
              'is-hovered': item.id === hoveredVersionId
            }"
            :aria-label="`版本 ${item.versionNumber}`"
            @click="handleTimelinePointClick(item.id)"
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave"
            @keydown="handleKeydown($event, item.id)"
          >
            <span class="version-timeline__point-inner"></span>
          </button>

          <!-- Tooltip -->
          <div
            v-if="item.id === hoveredVersionId"
            class="version-timeline__tooltip"
          >
            <div class="version-timeline__tooltip-version">
              {{ item.versionNumber }}
            </div>
            <div class="version-timeline__tooltip-date">
              {{ item.formattedDate }}
            </div>
            <div v-if="item.majorChanges.length > 0" class="version-timeline__tooltip-changes">
              <div class="version-timeline__tooltip-changes-title">主要变更:</div>
              <ul class="version-timeline__tooltip-changes-list">
                <li
                  v-for="(change, index) in item.majorChanges.slice(0, 3)"
                  :key="index"
                  class="version-timeline__tooltip-change-item"
                >
                  {{ change }}
                </li>
                <li
                  v-if="item.majorChanges.length > 3"
                  class="version-timeline__tooltip-change-item"
                >
                  ... 还有 {{ item.majorChanges.length - 3 }} 项
                </li>
              </ul>
            </div>
            <div class="version-timeline__tooltip-hint">
              点击查看详情
            </div>
          </div>

          <!-- Current version badge -->
          <div
            v-if="item.id === currentVersionId"
            class="version-timeline__current-badge"
          >
            当前版本
          </div>
        </div>
      </div>

      <!-- Timeline labels -->
      <div class="version-timeline__labels">
        <div class="version-timeline__label">
          <span class="version-timeline__label-text">
            {{ timelineData[0]?.formattedDate || '' }}
          </span>
        </div>
        <div class="version-timeline__label version-timeline__label--end">
          <span class="version-timeline__label-text">
            {{ timelineData[timelineData.length - 1]?.formattedDate || '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.version-timeline {
  @include flex-column;
  gap: $spacing-lg;
  width: 100%;
}

.version-timeline__header {
  @include flex-column;
  gap: $spacing-sm;
}

.version-timeline__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.version-timeline__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.version-timeline__empty {
  @include flex-center;
  padding: $spacing-xl;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border: 1px dashed $color-border;
}

.version-timeline__empty-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
}

.version-timeline__container {
  position: relative;
  padding: $spacing-xl $spacing-md;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border: 1px solid $color-border-light;
}

.version-timeline__line {
  position: absolute;
  top: 50%;
  left: $spacing-md;
  right: $spacing-md;
  height: 2px;
  background: linear-gradient(
    to right,
    $color-border-light 0%,
    $color-primary 50%,
    $color-border-light 100%
  );
  transform: translateY(-50%);
  z-index: 1;
}

.version-timeline__points {
  position: relative;
  height: 80px;
  margin: 0 $spacing-md;
  z-index: 2;
}

.version-timeline__point-wrapper {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.version-timeline__point {
  position: relative;
  width: 24px;
  height: 24px;
  padding: 0;
  background: white;
  border: 3px solid $color-border;
  border-radius: 50%;
  cursor: pointer;
  transition: all $transition-normal;
  @include focus-ring;

  &:hover {
    border-color: $color-primary;
    box-shadow: 0 0 0 6px rgba($color-primary, 0.1);
  }

  &.is-current {
    border-color: $color-primary;
    background-color: $color-primary;
    box-shadow: 0 0 0 8px rgba($color-primary, 0.15);
  }

  &.is-hovered {
    border-color: $color-primary;
    box-shadow: 0 0 0 6px rgba($color-primary, 0.1);
  }
}

.version-timeline__point-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all $transition-normal;
}

.version-timeline__point.is-current .version-timeline__point-inner {
  background-color: white;
  width: 6px;
  height: 6px;
}

.version-timeline__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  background-color: white;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 10;
  min-width: 200px;
  white-space: normal;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
  }
}

.version-timeline__tooltip-version {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-xs;
}

.version-timeline__tooltip-date {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-bottom: $spacing-sm;
}

.version-timeline__tooltip-changes {
  margin-bottom: $spacing-sm;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $color-border-light;
}

.version-timeline__tooltip-changes-title {
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  color: $color-text-secondary;
  margin-bottom: $spacing-xs;
  text-transform: uppercase;
}

.version-timeline__tooltip-changes-list {
  margin: 0;
  padding-left: $spacing-md;
  list-style: disc;
}

.version-timeline__tooltip-change-item {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  line-height: 1.4;
}

.version-timeline__tooltip-hint {
  font-size: $font-size-xs;
  color: $color-primary;
  font-weight: $font-weight-medium;
  margin-top: $spacing-xs;
}

.version-timeline__current-badge {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px $spacing-sm;
  background-color: $color-success;
  color: white;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  white-space: nowrap;
}

.version-timeline__labels {
  @include flex-between;
  margin-top: $spacing-lg;
  padding: 0 $spacing-md;
}

.version-timeline__label {
  @include flex-center;
}

.version-timeline__label--end {
  justify-self: flex-end;
}

.version-timeline__label-text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .version-timeline__container {
    padding: $spacing-lg $spacing-md;
  }

  .version-timeline__points {
    height: 100px;
  }

  .version-timeline__tooltip {
    min-width: 180px;
    padding: $spacing-sm;
  }

  .version-timeline__tooltip-version {
    font-size: $font-size-sm;
  }

  .version-timeline__tooltip-date {
    font-size: $font-size-xs;
  }

  .version-timeline__tooltip-change-item {
    font-size: $font-size-xs;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-timeline__container {
    padding: $spacing-md;
  }

  .version-timeline__line {
    left: 12px;
    right: auto;
    width: 2px;
    height: auto;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      $color-border-light 0%,
      $color-primary 50%,
      $color-border-light 100%
    );
  }

  .version-timeline__points {
    height: auto;
    margin: 0;
    padding-left: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .version-timeline__point-wrapper {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    flex-direction: row;
    align-items: flex-start;
    gap: $spacing-md;
    margin-left: -$spacing-lg;
  }

  .version-timeline__point {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .version-timeline__tooltip {
    position: static;
    transform: none;
    margin-bottom: 0;
    margin-left: $spacing-md;
    white-space: normal;
    min-width: auto;
    max-width: 200px;

    &::after {
      display: none;
    }
  }

  .version-timeline__current-badge {
    position: static;
    transform: none;
    margin-left: $spacing-md;
    margin-top: $spacing-xs;
  }

  .version-timeline__labels {
    flex-direction: column;
    gap: $spacing-md;
    margin-top: $spacing-md;
    padding: 0;
  }

  .version-timeline__title {
    font-size: $font-size-lg;
  }

  .version-timeline__subtitle {
    font-size: $font-size-xs;
  }
}
</style>
