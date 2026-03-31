<script setup lang="ts">
/**
 * VersionHubView - 版本中心主页面
 * Task 8.1: 实现 VersionHubView 主页面组件
 * Requirements: 1.1, 2.1, 4.1, 6.1, 7.1, 7.2, 7.3
 * 
 * Features:
 * - 集成 CurrentVersionCard、VersionHistoryList、VersionTimeline、VersionFilterBar
 * - 管理过滤状态并协调子组件之间的通信
 * - 处理版本详情页面的导航
 * - 显示加载和错误状态
 * - 使用 useVersionStore 进行数据管理
 * - 响应式设计
 */
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVersionStore } from '@/stores/version'
import CurrentVersionCard from '@/components/version/CurrentVersionCard.vue'
import VersionHistoryList from '@/components/version/VersionHistoryList.vue'
import VersionTimeline from '@/components/version/VersionTimeline.vue'
import VersionFilterBar from '@/components/version/VersionFilterBar.vue'

// Router and store
const router = useRouter()
const versionStore = useVersionStore()

// Computed properties
const currentVersion = computed(() => versionStore.getCurrentVersion)
const isLoading = computed(() => versionStore.isLoading)
const error = computed(() => versionStore.error)
const hasVersions = computed(() => versionStore.getVersionCount > 0)

/**
 * Load versions on component mount
 * Requirements: 1.1, 2.1, 4.1 - Load versions from store on mount
 */
onMounted(() => {
  versionStore.loadVersions()
})

/**
 * Handle version selection from child components
 * Requirements: 7.1, 7.2, 7.3 - Handle navigation to version details page
 * @param versionId - The ID of the selected version
 */
const handleVersionSelected = (versionId: string): void => {
  router.push({
    name: 'version-detail',
    params: { id: versionId }
  })
}

/**
 * Handle filter application
 * Requirements: 6.1 - Manage filter state across all child components
 */
const handleFilterApplied = (): void => {
  // Filter is already applied through the store in VersionFilterBar
  // This handler can be used for additional logic if needed
}

/**
 * Handle filter clearing
 * Requirements: 6.1 - Manage filter state across all child components
 */
const handleFilterCleared = (): void => {
  // Filter is already cleared through the store in VersionFilterBar
  // This handler can be used for additional logic if needed
}

/**
 * Handle error dismissal
 */
const handleDismissError = (): void => {
  versionStore.clearError()
}
</script>

<template>
  <div class="version-hub-view">
    <!-- Page header -->
    <div class="version-hub-view__header">
      <h1 class="version-hub-view__title">版本中心</h1>
      <p class="version-hub-view__subtitle">
        了解游戏版本信息、更新内容和发布历史
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="version-hub-view__loading">
      <div class="version-hub-view__spinner"></div>
      <p class="version-hub-view__loading-text">加载版本数据中...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="version-hub-view__error">
      <div class="version-hub-view__error-content">
        <p class="version-hub-view__error-text">{{ error }}</p>
        <button 
          class="version-hub-view__error-btn"
          @click="handleDismissError"
          aria-label="关闭错误提示"
        >
          关闭
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div v-else-if="hasVersions" class="version-hub-view__content">
      <!-- Filter bar section -->
      <section class="version-hub-view__section version-hub-view__section--filter">
        <VersionFilterBar
          @filter-applied="handleFilterApplied"
          @filter-cleared="handleFilterCleared"
        />
      </section>

      <!-- Current version section -->
      <section 
        v-if="currentVersion"
        class="version-hub-view__section version-hub-view__section--current"
      >
        <CurrentVersionCard
          :version="currentVersion"
          @view-details="handleVersionSelected"
        />
      </section>

      <!-- Timeline section -->
      <section class="version-hub-view__section version-hub-view__section--timeline">
        <VersionTimeline
          @version-selected="handleVersionSelected"
        />
      </section>

      <!-- Version history section -->
      <section class="version-hub-view__section version-hub-view__section--history">
        <VersionHistoryList
          @version-selected="handleVersionSelected"
        />
      </section>
    </div>

    <!-- Empty state -->
    <div v-else class="version-hub-view__empty">
      <div class="version-hub-view__empty-content">
        <p class="version-hub-view__empty-text">暂无版本数据</p>
        <p class="version-hub-view__empty-hint">请稍后重试或联系管理员</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.version-hub-view {
  @include flex-column;
  gap: $spacing-xl;
  padding: $spacing-xl;
  min-height: 100vh;
  background-color: $color-bg-dark;
}

.version-hub-view__header {
  @include flex-column;
  gap: $spacing-md;
  text-align: center;
  padding-bottom: $spacing-lg;
  border-bottom: 2px solid $color-border-light;
}

.version-hub-view__title {
  margin: 0;
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.version-hub-view__subtitle {
  margin: 0;
  font-size: $font-size-lg;
  color: $color-text-secondary;
}

.version-hub-view__content {
  @include flex-column;
  gap: $spacing-xl;
  width: 100%;
}

.version-hub-view__section {
  @include flex-column;
  gap: $spacing-lg;
  width: 100%;
}

.version-hub-view__section--filter {
  // Filter bar at the top
}

.version-hub-view__section--current {
  // Current version card section
}

.version-hub-view__section--timeline {
  // Timeline section
}

.version-hub-view__section--history {
  // Version history section
}

// Loading state
.version-hub-view__loading {
  @include flex-column;
  @include flex-center;
  gap: $spacing-lg;
  padding: $spacing-xl;
  min-height: 400px;
}

.version-hub-view__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid $color-border-light;
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.version-hub-view__loading-text {
  margin: 0;
  font-size: $font-size-lg;
  color: $color-text-secondary;
}

// Error state
.version-hub-view__error {
  @include flex-center;
  padding: $spacing-xl;
  background-color: rgba($color-error, 0.1);
  border: 2px solid $color-error;
  border-radius: $border-radius-md;
  min-height: 200px;
}

.version-hub-view__error-content {
  @include flex-column;
  @include flex-center;
  gap: $spacing-md;
  text-align: center;
}

.version-hub-view__error-text {
  margin: 0;
  font-size: $font-size-lg;
  color: $color-error;
  font-weight: $font-weight-medium;
}

.version-hub-view__error-btn {
  padding: $spacing-sm $spacing-md;
  background-color: $color-error;
  color: white;
  border: none;
  border-radius: $border-radius-sm;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-normal;
  @include focus-ring;

  &:hover {
    background-color: darken($color-error, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Empty state
.version-hub-view__empty {
  @include flex-center;
  padding: $spacing-xl;
  min-height: 400px;
  background-color: $color-bg-card;
  border: 2px dashed $color-border;
  border-radius: $border-radius-md;
}

.version-hub-view__empty-content {
  @include flex-column;
  @include flex-center;
  gap: $spacing-md;
  text-align: center;
}

.version-hub-view__empty-text {
  margin: 0;
  font-size: $font-size-xl;
  color: $color-text-primary;
  font-weight: $font-weight-medium;
}

.version-hub-view__empty-hint {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
}

// Responsive design
@media (max-width: $breakpoint-md) {
  .version-hub-view {
    gap: $spacing-lg;
    padding: $spacing-lg;
  }

  .version-hub-view__header {
    gap: $spacing-md;
    padding-bottom: $spacing-md;
  }

  .version-hub-view__title {
    font-size: $font-size-xl;
  }

  .version-hub-view__subtitle {
    font-size: $font-size-md;
  }

  .version-hub-view__content {
    gap: $spacing-lg;
  }

  .version-hub-view__section {
    gap: $spacing-md;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-hub-view {
    gap: $spacing-md;
    padding: $spacing-md;
    min-height: auto;
  }

  .version-hub-view__header {
    gap: $spacing-sm;
    padding-bottom: $spacing-md;
  }

  .version-hub-view__title {
    font-size: $font-size-lg;
  }

  .version-hub-view__subtitle {
    font-size: $font-size-sm;
  }

  .version-hub-view__content {
    gap: $spacing-md;
  }

  .version-hub-view__section {
    gap: $spacing-md;
  }

  .version-hub-view__loading {
    min-height: 300px;
  }

  .version-hub-view__error {
    min-height: 150px;
    padding: $spacing-md;
  }

  .version-hub-view__empty {
    min-height: 300px;
    padding: $spacing-md;
  }
}
</style>
