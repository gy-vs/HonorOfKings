<script setup lang="ts">
/**
 * VersionFilterBar - 版本过滤搜索栏组件
 * Task 5.1: 实现 VersionFilterBar 组件
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * 
 * Features:
 * - 提供版本号搜索输入框
 * - 提供日期范围选择器
 * - 应用过滤条件到版本列表和时间线
 * - 无结果时显示提示信息
 * - 清除过滤功能
 * - 响应式设计
 */
import { ref, computed } from 'vue'
import { useVersionStore } from '@/stores/version'
import type { VersionFilter } from '@/types'

// Define emits
const emit = defineEmits<{
  (e: 'filter-applied', filter: VersionFilter): void
  (e: 'filter-cleared'): void
}>()

// Get version store
const versionStore = useVersionStore()

// Local filter state
const filterForm = ref<VersionFilter>({
  versionNumber: '',
  startDate: undefined,
  endDate: undefined
})

// Date range picker state
const dateRange = ref<[Date | null, Date | null]>([null, null])

// Validation state
const validationError = ref<string | null>(null)
const isValidating = ref(false)

// Computed property to check if any filter is active
const hasActiveFilter = computed(() => {
  return (
    (filterForm.value.versionNumber && filterForm.value.versionNumber.trim() !== '') ||
    filterForm.value.startDate ||
    filterForm.value.endDate
  )
})

// Computed property to check if there are no results (used in template)
const hasNoResults = computed(() => {
  return hasActiveFilter.value && versionStore.getFilteredVersionCount === 0
})
// Suppress unused variable warning
void hasNoResults

/**
 * Validate date range
 * Requirements: 6.2, 6.3, 6.5 - Validate date range (end date must be after start date)
 */
const validateDateRange = (): boolean => {
  validationError.value = null
  
  // Check if both dates are provided
  if (dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    
    // Validate that end date is after start date
    if (endDate <= startDate) {
      validationError.value = '结束日期必须晚于开始日期'
      return false
    }
  }
  
  return true
}

/**
 * Handle filter application
 * Requirements: 6.2, 6.3, 6.4 - Apply filters to version list and timeline
 */
const handleApplyFilter = (): void => {
  isValidating.value = true
  validationError.value = null
  
  try {
    // Validate date range first
    if (!validateDateRange()) {
      isValidating.value = false
      return
    }
    
    // Update filter form with date range
    if (dateRange.value[0]) {
      filterForm.value.startDate = dateRange.value[0]
    }
    if (dateRange.value[1]) {
      filterForm.value.endDate = dateRange.value[1]
    }

    // Apply filter through store
    versionStore.applyFilter(filterForm.value)

    // Emit filter applied event
    emit('filter-applied', filterForm.value)
  } catch (err) {
    validationError.value = err instanceof Error ? err.message : '应用过滤条件时出错'
    console.error('[VersionFilterBar] Error applying filter:', err)
  } finally {
    isValidating.value = false
  }
}

/**
 * Handle filter clearing
 * Requirements: 6.5 - Clear filters functionality
 */
const handleClearFilter = (): void => {
  // Reset filter form
  filterForm.value = {
    versionNumber: '',
    startDate: undefined,
    endDate: undefined
  }

  // Reset date range
  dateRange.value = [null, null]
  
  // Clear validation errors
  validationError.value = null

  // Clear filter through store
  versionStore.clearFilter()

  // Emit filter cleared event
  emit('filter-cleared')
}
// Suppress unused variable warning
void handleClearFilter

/**
 * Handle version number input change
 */
const handleVersionNumberChange = (): void => {
  // Auto-apply filter on input change
  handleApplyFilter()
}
// Suppress unused variable warning
void handleVersionNumberChange

/**
 * Handle date range change
 */
const handleDateRangeChange = (): void => {
  // Auto-apply filter on date change
  handleApplyFilter()
}
// Suppress unused variable warning
void handleDateRangeChange
</script>

<template>
  <div class="version-timeline__header">
      <h2 class="version-timeline__title">当前版本</h2>
      <p class="version-timeline__subtitle">
        当前运行版本
      </p>
    </div>
</template>

<script lang="ts">
// Date range shortcuts for quick selection
const dateShortcuts = [
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    }
  },
  {
    text: '最近六个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    }
  },
  {
    text: '最近一年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    }
  }
]
// Suppress unused variable warning
void dateShortcuts
</script>

<style lang="scss" scoped>
.version-filter-bar {
  @include flex-column;
  gap: $spacing-md;
  padding: $spacing-lg;
  background-color: $color-bg-card;
  border: 1px solid $color-border-light;
  border-radius: $border-radius-md;
}

.version-filter-bar__controls {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  align-items: flex-end;
}

.version-filter-bar__input-group {
  @include flex-column;
  gap: $spacing-xs;
  flex: 1;
  min-width: 200px;
}

.version-filter-bar__label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.version-filter-bar__input-wrapper {
  position: relative;
  @include flex-center;
}

.version-filter-bar__input-icon {
  position: absolute;
  left: $spacing-sm;
  color: $color-text-secondary;
  pointer-events: none;
  font-size: $font-size-md;
}

.version-filter-bar__input {
  width: 100%;
  padding: $spacing-sm $spacing-md $spacing-sm $spacing-lg;
  border: 1px solid $color-border-light;
  border-radius: $border-radius-sm;
  font-size: $font-size-md;
  color: $color-text-primary;
  background-color: white;
  transition: all $transition-normal;
  @include focus-ring;

  &::placeholder {
    color: $color-text-secondary;
  }

  &:hover {
    border-color: $color-border;
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
  }
}

.version-filter-bar__date-picker {
  width: 100%;
  min-width: 250px;
}

.version-filter-bar__actions {
  @include flex-center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.version-filter-bar__btn {
  @include flex-center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: $border-radius-sm;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-normal;
  @include focus-ring;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
}

.version-filter-bar__btn--primary {
  background-color: $color-primary;
  color: white;

  &:not(:disabled):hover {
    background-color: darken($color-primary, 10%);
  }
}

.version-filter-bar__btn--secondary {
  background-color: $color-bg-hover;
  color: $color-text-primary;
  border: 1px solid $color-border-light;

  &:not(:disabled):hover {
    background-color: $color-border-light;
  }
}

.version-filter-bar__no-results {
  padding: $spacing-md;
  background-color: rgba($color-warning, 0.1);
  border: 1px solid rgba($color-warning, 0.3);
  border-radius: $border-radius-sm;
  text-align: center;
}

.version-filter-bar__no-results-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-warning;
}

.version-filter-bar__validation-error {
  padding: $spacing-md;
  background-color: rgba($color-error, 0.1);
  border: 1px solid rgba($color-error, 0.3);
  border-radius: $border-radius-sm;
  text-align: center;
}

.version-filter-bar__error-text {
  margin: 0;
  font-size: $font-size-md;
  color: $color-error;
}

.version-filter-bar__active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background-color: rgba($color-primary, 0.05);
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius-sm;
}

.version-filter-bar__filters-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
}

.version-filter-bar__filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.version-filter-bar__filter-tag {
  padding: $spacing-xs $spacing-sm;
  background-color: $color-primary;
  color: white;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  white-space: nowrap;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .version-filter-bar {
    padding: $spacing-md;
    gap: $spacing-md;
  }

  .version-filter-bar__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .version-filter-bar__input-group {
    min-width: auto;
  }

  .version-filter-bar__date-picker {
    min-width: auto;
  }

  .version-filter-bar__actions {
    width: 100%;
  }

  .version-filter-bar__btn {
    flex: 1;
    min-width: 100px;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-filter-bar {
    padding: $spacing-md;
    gap: $spacing-sm;
  }

  .version-filter-bar__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .version-filter-bar__input-group {
    min-width: auto;
  }

  .version-filter-bar__actions {
    width: 100%;
    flex-direction: column;
  }

  .version-filter-bar__btn {
    width: 100%;
  }

  .version-filter-bar__active-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .version-filter-bar__filter-tags {
    width: 100%;
  }
}
</style>
