<script setup lang="ts">
/**
 * VersionHistoryList - 版本历史列表组件
 * Task 4.1: 实现 VersionHistoryList 组件
 * Requirements: 2.1, 2.2, 2.3, 2.5
 * 
 * Features:
 * - 按倒序时间顺序显示版本
 * - 显示版本号、发布日期、摘要
 * - 指示当前活跃版本
 * - 支持分页或无限滚动
 * - 响应式设计
 */
import { computed, ref } from 'vue'
import { useVersionStore } from '@/stores/version'
import VersionCard from './VersionCard.vue'
import type { Version } from '@/types'

// Constants
const ITEMS_PER_PAGE = 10

// Store
const versionStore = useVersionStore()

// State
const currentPage = ref(1)

// Computed properties
const sortedVersions = computed(() => {
  // Sort versions in reverse chronological order (newest first)
  return [...versionStore.getFilteredVersions].sort((a: Version, b: Version) => 
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  )
})

const paginatedVersions = computed(() => {
  const startIndex = (currentPage.value - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  return sortedVersions.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(sortedVersions.value.length / ITEMS_PER_PAGE)
})

const hasNextPage = computed(() => currentPage.value < totalPages.value)

const hasPreviousPage = computed(() => currentPage.value > 1)

const currentVersionId = computed(() => versionStore.currentVersion?.id)

// Methods
/**
 * Handle version card click
 * Requirements: 2.4 - Navigate to version details page
 */
const handleVersionClick = (versionId: string): void => {
  emit('version-selected', versionId)
}

/**
 * Go to next page
 */
const goToNextPage = (): void => {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

/**
 * Go to previous page
 */
const goToPreviousPage = (): void => {
  if (hasPreviousPage.value) {
    currentPage.value--
  }
}

/**
 * Reset to first page when filter changes
 */
const resetPagination = (): void => {
  currentPage.value = 1
}

// Watch for filter changes and reset pagination
import { watch } from 'vue'
watch(() => versionStore.filterState, () => {
  resetPagination()
}, { deep: true })

// Define emits
const emit = defineEmits<{
  (e: 'version-selected', versionId: string): void
}>()
</script>

<template>
  <div class="version-history-list">
    <!-- Header -->
    <div class="version-history-list__header">
      <h2 class="version-history-list__title">版本历史</h2>
      <p class="version-history-list__count">
        共 {{ sortedVersions.length }} 个版本
      </p>
    </div>

    <!-- Empty state -->
    <div v-if="sortedVersions.length === 0" class="version-history-list__empty">
      <p class="version-history-list__empty-text">暂无版本数据</p>
    </div>

    <!-- Version list -->
    <div v-else class="version-history-list__content">
      <!-- Versions grid -->
      <div class="version-history-list__grid">
        <VersionCard
          v-for="version in paginatedVersions"
          :key="version.id"
          :version="version"
          :is-current="version.id === currentVersionId"
          @click="handleVersionClick(version.id)"
        />
      </div>

      <!-- Pagination controls -->
      <div v-if="totalPages > 1" class="version-history-list__pagination">
        <button
          class="version-history-list__pagination-btn"
          :disabled="!hasPreviousPage"
          @click="goToPreviousPage"
          aria-label="上一页"
        >
          ← 上一页
        </button>

        <div class="version-history-list__page-info">
          <span class="version-history-list__page-number">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
        </div>

        <button
          class="version-history-list__pagination-btn"
          :disabled="!hasNextPage"
          @click="goToNextPage"
          aria-label="下一页"
        >
          下一页 →
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.version-history-list {
  @include flex-column;
  gap: $spacing-lg;
  width: 100%;
}

.version-history-list__header {
  @include flex-column;
  gap: $spacing-sm;
}

.version-history-list__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.version-history-list__count {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.version-history-list__empty {
  @include flex-center;
  padding: $spacing-xl;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border: 1px dashed $color-border;
}

.version-history-list__empty-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
}

.version-history-list__content {
  @include flex-column;
  gap: $spacing-lg;
}

.version-history-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-md;
  width: 100%;
}

.version-history-list__pagination {
  @include flex-center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $color-bg-card;
  border-radius: $border-radius-md;
  border: 1px solid $color-border-light;
}

.version-history-list__pagination-btn {
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

  &:hover:not(:disabled) {
    background-color: darken($color-primary, 10%);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: $color-border;
    color: $color-text-secondary;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.version-history-list__page-info {
  @include flex-center;
  gap: $spacing-sm;
}

.version-history-list__page-number {
  font-size: $font-size-md;
  color: $color-text-primary;
  font-weight: $font-weight-medium;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .version-history-list {
    gap: $spacing-md;
  }

  .version-history-list__grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: $spacing-md;
  }

  .version-history-list__pagination {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .version-history-list__pagination-btn {
    width: 100%;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-history-list {
    gap: $spacing-md;
  }

  .version-history-list__title {
    font-size: $font-size-lg;
  }

  .version-history-list__grid {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }

  .version-history-list__pagination {
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-sm;
  }

  .version-history-list__pagination-btn {
    width: 100%;
    font-size: $font-size-sm;
    padding: $spacing-sm;
  }

  .version-history-list__page-number {
    font-size: $font-size-sm;
  }
}
</style>
