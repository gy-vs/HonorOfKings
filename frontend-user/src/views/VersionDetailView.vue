<script setup lang="ts">
/**
 * VersionDetailView - 版本详情页
 * Task 7.1: 创建版本详情页组件
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * Features:
 * - 显示版本号和发布日期
 * - 按分类组织显示所有更新内容
 * - 显示相关图片和媒体
 * - 提供面包屑导航返回主页
 * - 链接到相关模块（英雄、装备、事件）
 * - 响应式设计
 */
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVersionStore } from '@/stores/version'
import UpdateContentSection from '@/components/version/UpdateContentSection.vue'
import type { Version } from '@/types'

// Route and router
const route = useRoute()
const router = useRouter()
const versionStore = useVersionStore()

// State
const version = ref<Version | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const errorCode = ref<number | null>(null)
const retryCount = ref(0)
const maxRetries = 3

// Methods
const loadVersion = () => {
  isLoading.value = true
  error.value = null
  errorCode.value = null
  
  const versionId = route.params.id as string
  
  // Validate version ID format
  if (!versionId || versionId.trim() === '') {
    error.value = '无效的版本ID'
    errorCode.value = 400
    isLoading.value = false
    return
  }
  
  // Simulate async loading
  setTimeout(() => {
    const foundVersion = versionStore.getVersionById(versionId)
    
    if (foundVersion) {
      version.value = foundVersion
      error.value = null
      errorCode.value = null
      retryCount.value = 0
    } else {
      error.value = '该版本不存在或已被删除'
      errorCode.value = 404
      console.warn(`[VersionDetailView] Version not found: ${versionId}`)
    }
    
    isLoading.value = false
  }, 300)
}

const handleRetry = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++
    loadVersion()
  } else {
    error.value = '重试次数已达上限，请返回版本中心重新选择'
  }
}

const formatDate = (date: Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/version-hub')
}

const navigateToHeroes = () => {
  router.push('/heroes')
}

const navigateToEquipment = () => {
  router.push('/equipment')
}

const navigateToEvents = () => {
  router.push('/events')
}

// Lifecycle
onMounted(() => {
  // Ensure versions are loaded
  if (versionStore.versions.length === 0) {
    versionStore.loadVersions()
  }
  loadVersion()
})

// Watch for route changes
watch(() => route.params.id, () => {
  loadVersion()
})
</script>

<template>
  <div class="version-detail-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- Error State (404) -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <span v-if="errorCode === 404">❌</span>
        <span v-else>⚠️</span>
      </div>
      <h2 class="error-title">
        <span v-if="errorCode === 404">404 - 版本未找到</span>
        <span v-else>加载失败</span>
      </h2>
      <p class="error-description">{{ error }}</p>
      <div class="error-actions">
        <button 
          v-if="retryCount < maxRetries"
          class="retry-button" 
          @click="handleRetry"
          :aria-label="`重试加载版本 (${retryCount}/${maxRetries})`"
        >
          重试 ({{ retryCount }}/{{ maxRetries }})
        </button>
        <button class="back-button" @click="goBack">返回版本中心</button>
      </div>
    </div>

    <!-- Version Content -->
    <div v-else-if="version" class="version-content">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb" aria-label="面包屑导航">
        <button class="breadcrumb-item" @click="goBack">版本中心</button>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{ version.versionNumber }}</span>
      </nav>

      <!-- Version Header -->
      <section class="version-header">
        <div class="version-header-content">
          <h1 class="version-number">版本 {{ version.versionNumber }}</h1>
          <p class="version-date">发布于 {{ formatDate(version.releaseDate) }}</p>
          <span class="version-status" :class="`status-${version.status}`">
            {{ version.status === 'active' ? '当前版本' : version.status === 'upcoming' ? '即将发布' : '已过期' }}
          </span>
        </div>
      </section>

      <!-- Version Summary -->
      <section class="version-summary">
        <h2 class="section-title">版本概览</h2>
        <p class="summary-text">{{ version.summary }}</p>
        
        <div v-if="version.majorChanges.length > 0" class="major-changes">
          <h3 class="subsection-title">主要变更</h3>
          <ul class="changes-list">
            <li v-for="(change, index) in version.majorChanges" :key="index" class="change-item">
              {{ change }}
            </li>
          </ul>
        </div>
      </section>

      <!-- Update Content Section -->
      <section v-if="version.updateContent.length > 0" class="update-content">
        <h2 class="section-title">更新内容</h2>
        <UpdateContentSection :update-content="version.updateContent" />
      </section>

      <!-- Related Modules Navigation -->
      <section class="related-modules">
        <h2 class="section-title">相关模块</h2>
        <div class="modules-grid">
          <button class="module-card" @click="navigateToHeroes">
            <span class="module-icon">⚔️</span>
            <span class="module-name">英雄</span>
            <span class="module-description">查看所有英雄信息</span>
          </button>
          <button class="module-card" @click="navigateToEquipment">
            <span class="module-icon">🛡️</span>
            <span class="module-name">装备</span>
            <span class="module-description">查看所有装备信息</span>
          </button>
          <button class="module-card" @click="navigateToEvents">
            <span class="module-icon">🏆</span>
            <span class="module-name">赛事</span>
            <span class="module-description">查看赛事信息</span>
          </button>
        </div>
      </section>

      <!-- Back to Hub Button -->
      <div class="footer-actions">
        <button class="back-button" @click="goBack">返回版本中心</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/mixins.scss";

.version-detail-view {
  min-height: 100vh;
  padding: $spacing-md;
  background-color: $color-bg-dark;
  max-width: 1200px;
  margin: 0 auto;
}

// Loading State
.loading-state {
  @include flex-center;
  @include flex-column;
  min-height: 60vh;
  color: $color-text-secondary;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid $color-border;
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: $spacing-md;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Error State
.error-state {
  @include flex-center;
  @include flex-column;
  min-height: 60vh;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: $spacing-md;
}

.error-state h2 {
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xl;
}

.error-description {
  color: $color-text-secondary;
  margin-bottom: $spacing-lg;
  font-size: $font-size-md;
}

.error-title {
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xl;
}

.error-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-button {
  padding: $spacing-sm $spacing-md;
  background: $color-warning;
  color: white;
  border: none;
  border-radius: $border-radius-md;
  font-size: $font-size-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: darken($color-warning, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.back-button {
  padding: $spacing-sm $spacing-md;
  background: $color-primary;
  color: $color-bg-dark;
  border: none;
  border-radius: $border-radius-md;
  font-size: $font-size-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $color-primary-light;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Breadcrumb Navigation
.breadcrumb {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
}

.breadcrumb-item {
  background: none;
  border: none;
  color: $color-primary;
  cursor: pointer;
  transition: all $transition-fast;
  padding: 0;
  font-size: inherit;

  &:hover {
    color: $color-primary-light;
    text-decoration: underline;
  }

  &.active {
    color: $color-text-secondary;
    cursor: default;

    &:hover {
      color: $color-text-secondary;
      text-decoration: none;
    }
  }
}

.breadcrumb-separator {
  color: $color-border;
}

// Version Header
.version-header {
  padding: $spacing-lg;
  background: #1A2744;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-xl;
  color: white;
  border:1px solid #785A28;
}

.version-header-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.version-number {
  margin: 0;
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
}

.version-date {
  margin: 0;
  font-size: $font-size-lg;
  opacity: 0.9;
}

.version-status {
  display: inline-block;
  width: fit-content;
  padding: $spacing-xs $spacing-sm;
  background: rgba(white, 0.2);
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;

  &.status-active {
    background: rgba($color-success, 0.3);
    color: $color-success;
  }

  &.status-upcoming {
    background: rgba($color-warning, 0.3);
    color: $color-warning;
  }

  &.status-deprecated {
    background: rgba($color-info, 0.3);
    color: $color-info;
  }
}

// Section Title
.section-title {
  margin: 0 0 $spacing-md;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.subsection-title {
  margin: 0 0 $spacing-sm;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

// Version Summary
.version-summary {
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;
  margin-bottom: $spacing-xl;
}

.summary-text {
  margin: 0 0 $spacing-md;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.major-changes {
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $color-border-light;
}

.changes-list {
  margin: 0;
  padding-left: $spacing-lg;
  list-style: none;
}

.change-item {
  padding: $spacing-xs 0;
  color: $color-text-secondary;
  font-size: $font-size-md;
  line-height: 1.6;
  position: relative;
  padding-left: $spacing-md;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: $color-success;
    font-weight: bold;
  }
}

// Update Content Section
.update-content {
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;
  margin-bottom: $spacing-xl;
}

// Related Modules
.related-modules {
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;
  margin-bottom: $spacing-xl;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-lg;
  background: $color-bg-dark;
  border: 2px solid $color-border;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  text-align: center;

  &:hover {
    border-color: $color-primary;
    background: rgba($color-primary, 0.05);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba($color-primary, 0.1);
  }

  &:active {
    transform: translateY(-2px);
  }
}

.module-icon {
  font-size: $font-size-xxl;
  display: block;
}

.module-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.module-description {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// Footer Actions
.footer-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  padding: $spacing-lg 0;
}

// Responsive Design
@media (max-width: $breakpoint-md) {
  .version-detail-view {
    padding: $spacing-sm;
  }

  .version-header {
    padding: $spacing-md;
  }

  .version-number {
    font-size: $font-size-xl;
  }

  .version-date {
    font-size: $font-size-md;
  }

  .section-title {
    font-size: $font-size-lg;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $breakpoint-sm) {
  .version-detail-view {
    padding: $spacing-xs;
  }

  .version-header {
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  .version-number {
    font-size: $font-size-lg;
  }

  .version-date {
    font-size: $font-size-sm;
  }

  .version-status {
    font-size: $font-size-xs;
    padding: $spacing-xs $spacing-xs;
  }

  .section-title {
    font-size: $font-size-md;
  }

  .subsection-title {
    font-size: $font-size-md;
  }

  .summary-text {
    font-size: $font-size-sm;
  }

  .change-item {
    font-size: $font-size-sm;
  }

  .version-summary,
  .update-content,
  .related-modules {
    padding: $spacing-md;
    margin-bottom: $spacing-md;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }

  .module-card {
    padding: $spacing-md;
    gap: $spacing-xs;
  }

  .module-icon {
    font-size: $font-size-xl;
  }

  .module-name {
    font-size: $font-size-md;
  }

  .module-description {
    font-size: $font-size-xs;
  }

  .breadcrumb {
    font-size: $font-size-xs;
    margin-bottom: $spacing-md;
  }
}
</style>
