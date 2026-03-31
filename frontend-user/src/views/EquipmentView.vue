<script setup lang="ts">
/**
 * EquipmentView - 装备列表页
 * Task 10.1: 实现装备分类筛选
 * - 分类标签切换
 * - 使用 computed 过滤装备
 * Requirements: 4.2
 * Property 6: Equipment Category Filter Correctness
 * 
 * Task 10.3: 实现装备详情弹窗
 * - Element Plus Dialog 组件
 * - 显示完整装备信息
 * Requirements: 4.4
 */
import { ref, computed } from 'vue'
import { equipment, equipmentCategories } from '@/data/equipment'
import type { Equipment, EquipmentCategory } from '@/types'
import EquipmentCard from '@/components/common/EquipmentCard.vue'
import { Coin, InfoFilled, Close } from '@element-plus/icons-vue'

// 当前选中的分类
const selectedCategory = ref<EquipmentCategory | 'all'>('all')

// Task 10.3: 装备详情弹窗状态
const dialogVisible = ref(false)
const selectedEquipment = ref<Equipment | null>(null)

/**
 * 使用 computed 过滤装备
 * Property 6: For any equipment category filter selection, 
 * all displayed equipment items SHALL have a category property matching the selected category.
 */
const filteredEquipment = computed(() => {
  if (selectedCategory.value === 'all') {
    return equipment
  }
  return equipment.filter(item => item.category === selectedCategory.value)
})

/**
 * 选择分类
 * @param category - 要选择的分类
 */
const selectCategory = (category: EquipmentCategory | 'all') => {
  selectedCategory.value = category
}

/**
 * 判断分类是否被选中
 * @param category - 要检查的分类
 */
const isCategoryActive = (category: EquipmentCategory | 'all') => {
  return selectedCategory.value === category
}

/**
 * Task 10.3: 处理装备卡片点击 - 显示装备详情弹窗
 * Requirements: 4.4 - When a user clicks on an equipment item, 
 * THE System SHALL display a modal with full equipment information
 * @param item - 被点击的装备
 */
const handleEquipmentClick = (item: Equipment) => {
  selectedEquipment.value = item
  dialogVisible.value = true
}

/**
 * 关闭装备详情弹窗
 */
const closeDialog = () => {
  dialogVisible.value = false
}

/**
 * 获取分类显示名称
 */
const categoryDisplayMap: Record<EquipmentCategory, string> = {
  attack: '攻击',
  magic: '法术',
  defense: '防御',
  movement: '移动',
  jungle: '打野'
}

/**
 * 获取分类颜色
 */
const categoryColorMap: Record<EquipmentCategory, string> = {
  attack: '#E84057',
  magic: '#9B59B6',
  defense: '#3498DB',
  movement: '#2ECC71',
  jungle: '#F39C12'
}

/**
 * 获取选中装备的分类显示名称
 */
const selectedCategoryDisplay = computed(() => {
  if (!selectedEquipment.value) return ''
  return categoryDisplayMap[selectedEquipment.value.category] || selectedEquipment.value.category
})

/**
 * 获取选中装备的分类颜色
 */
const selectedCategoryColor = computed(() => {
  if (!selectedEquipment.value) return '#C8AA6E'
  return categoryColorMap[selectedEquipment.value.category] || '#C8AA6E'
})

/**
 * 格式化价格显示
 */
const formattedPrice = computed(() => {
  if (!selectedEquipment.value) return '0'
  return selectedEquipment.value.price.toLocaleString()
})
</script>

<template>
  <div class="equipment-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">装备列表</h1>
      <p class="page-subtitle">浏览所有装备，了解装备属性与效果</p>
    </div>

    <!-- 分类筛选标签 -->
    <div class="filter-section">
      <div class="category-tabs">
        <button
          v-for="category in equipmentCategories"
          :key="category.key"
          class="category-tab"
          :class="{ active: isCategoryActive(category.key as EquipmentCategory | 'all') }"
          @click="selectCategory(category.key as EquipmentCategory | 'all')"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 装备数量统计 -->
    <div class="equipment-count">
      共 <span class="count-number">{{ filteredEquipment.length }}</span> 件装备
    </div>

    <!-- 装备列表展示 -->
    <div class="equipment-grid-container">
      <!-- Empty State -->
      <div v-if="filteredEquipment.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h3 class="empty-state__title">暂无装备</h3>
        <p class="empty-state__description">当前分类下没有装备</p>
        <button class="empty-state__action" @click="selectCategory('all')">
          查看全部装备
        </button>
      </div>

      <!-- Equipment Grid with TransitionGroup -->
      <TransitionGroup 
        v-else
        name="equipment-list" 
        tag="div" 
        class="equipment-grid"
      >
        <EquipmentCard
          v-for="item in filteredEquipment"
          :key="item.id"
          :equipment="item"
          class="equipment-grid__item"
          @click="handleEquipmentClick"
        />
      </TransitionGroup>
    </div>

    <!-- Task 10.3: 装备详情弹窗 -->
    <!-- Requirements: 4.4 - Display a modal with full equipment information -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedEquipment?.name || '装备详情'"
      width="500px"
      class="equipment-detail-dialog"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="false"
      align-center
      destroy-on-close
    >
      <template #header="{ close, titleId }">
        <div class="dialog-header">
          <h3 :id="titleId" class="dialog-title">{{ selectedEquipment?.name }}</h3>
          <button class="dialog-close-btn" @click="close" aria-label="关闭">
            <el-icon :size="20"><Close /></el-icon>
          </button>
        </div>
      </template>

      <div v-if="selectedEquipment" class="equipment-detail">
        <!-- 装备图标和基本信息 -->
        <div class="equipment-detail__header">
          <div class="equipment-detail__icon-wrapper">
            <img 
              :src="selectedEquipment.icon" 
              :alt="selectedEquipment.name"
              class="equipment-detail__icon"
            />
            <span 
              class="equipment-detail__category-badge"
              :style="{ backgroundColor: selectedCategoryColor, borderColor: selectedCategoryColor }"
            >
              {{ selectedCategoryDisplay }}
            </span>
          </div>
          <div class="equipment-detail__basic-info">
            <h2 class="equipment-detail__name">{{ selectedEquipment.name }}</h2>
            <div class="equipment-detail__price">
              <el-icon :size="18" class="equipment-detail__price-icon">
                <Coin />
              </el-icon>
              <span class="equipment-detail__price-value">{{ formattedPrice }}</span>
              <span class="equipment-detail__price-label">金币</span>
            </div>
          </div>
        </div>

        <!-- 装备描述 -->
        <div class="equipment-detail__section">
          <h4 class="equipment-detail__section-title">装备描述</h4>
          <p class="equipment-detail__description">{{ selectedEquipment.description }}</p>
        </div>

        <!-- 装备属性 -->
        <div class="equipment-detail__section">
          <h4 class="equipment-detail__section-title">装备属性</h4>
          <div class="equipment-detail__attributes">
            <div 
              v-for="(attr, index) in selectedEquipment.attributes" 
              :key="index"
              class="equipment-detail__attribute"
            >
              <span class="equipment-detail__attr-name">{{ attr.name }}</span>
              <span class="equipment-detail__attr-value">{{ attr.value }}</span>
            </div>
          </div>
        </div>

        <!-- 被动效果 (如果存在) -->
        <div v-if="selectedEquipment.passive" class="equipment-detail__section equipment-detail__passive-section">
          <h4 class="equipment-detail__section-title">
            <el-icon :size="16" class="equipment-detail__passive-icon">
              <InfoFilled />
            </el-icon>
            被动效果
          </h4>
          <p class="equipment-detail__passive">{{ selectedEquipment.passive }}</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="closeDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.equipment-view {
  min-height: 100vh;
  padding: $spacing-md;
  background-color: $color-bg-dark;
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-lg;
  padding: $spacing-md 0;
}

.page-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin: 0 0 $spacing-xs 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: $font-size-md;
  color: $color-text-secondary;
  margin: 0;
}

.filter-section {
  margin-bottom: $spacing-md;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
}

.category-tab {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  min-width: 60px;

  &:hover {
    color: $color-primary;
    background-color: $color-bg-hover;
    border-color: $color-border-light;
  }

  &.active {
    color: $color-bg-dark;
    background-color: $color-primary;
    border-color: $color-primary;
    font-weight: $font-weight-bold;

    &:hover {
      background-color: $color-primary-light;
      border-color: $color-primary-light;
    }
  }
}

.equipment-count {
  text-align: center;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-bottom: $spacing-md;

  .count-number {
    color: $color-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
  }
}

.equipment-grid-container {
  transition: opacity $transition-normal;
}

// Equipment Grid - Responsive layout with auto-fill for horizontal cards
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $spacing-md;
  
  @media (max-width: $breakpoint-xl) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-sm;
  }
  
  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-sm;
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }
}

.equipment-grid__item {
  width: 100%;
}

// TransitionGroup Animations
.equipment-list-move,
.equipment-list-enter-active,
.equipment-list-leave-active {
  transition: all 0.3s ease;
}

.equipment-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.equipment-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.equipment-list-leave-active {
  position: absolute;
}

// Empty State Styles
.empty-state {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xl * 2;
  text-align: center;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
}

.empty-state__icon {
  color: $color-text-muted;
  margin-bottom: $spacing-md;
  opacity: 0.6;
}

.empty-state__title {
  margin: 0 0 $spacing-xs 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.empty-state__description {
  margin: 0 0 $spacing-md 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
  max-width: 400px;
}

.empty-state__action {
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-bg-dark;
  background-color: $color-primary;
  border: none;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background-color: $color-primary-light;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-primary, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: $breakpoint-md) {
  .equipment-view {
    padding: $spacing-sm;
  }

  .page-title {
    font-size: $font-size-xl;
  }

  .category-tabs {
    gap: 4px;
    padding: $spacing-xs;
  }

  .category-tab {
    padding: 6px $spacing-xs;
    font-size: $font-size-xs;
    min-width: 50px;
  }
}
</style>

<!-- Task 10.3: 装备详情弹窗样式 (全局样式) -->
<style lang="scss">
// 装备详情弹窗 - 王者荣耀主题样式
.equipment-detail-dialog {
  .el-dialog {
    background-color: $color-bg-card;
    border: 1px solid $color-border;
    border-radius: $border-radius-lg;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .el-dialog__header {
    padding: 0;
    margin: 0;
  }

  .el-dialog__body {
    padding: $spacing-md;
    color: $color-text-primary;
  }

  .el-dialog__footer {
    padding: $spacing-sm $spacing-md $spacing-md;
    border-top: 1px solid $color-border-light;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(135deg, rgba($color-primary, 0.2) 0%, rgba($color-bg-dark, 0.8) 100%);
  border-bottom: 1px solid $color-border;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
}

.dialog-title {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-primary;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dialog-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius-sm;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $color-primary;
    background-color: rgba($color-primary, 0.1);
    border-color: $color-primary;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;

  .el-button--primary {
    min-width: 120px;
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-bg-dark;
    font-weight: $font-weight-bold;

    &:hover {
      background-color: $color-primary-light;
      border-color: $color-primary-light;
    }
  }
}

// 装备详情内容样式
.equipment-detail {
  @include flex-column;
  gap: $spacing-md;
}

.equipment-detail__header {
  display: flex;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $color-border-light;
}

.equipment-detail__icon-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-md;
  overflow: hidden;
  border: 2px solid $color-border;
}

.equipment-detail__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: $spacing-xs;
}

.equipment-detail__category-badge {
  position: absolute;
  top: $spacing-xs;
  left: $spacing-xs;
  padding: 2px $spacing-xs;
  background: rgba($color-bg-dark, 0.9);
  border: 1px solid $color-primary;
  border-radius: $border-radius-sm;
  color: $color-text-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

.equipment-detail__basic-info {
  @include flex-column;
  justify-content: center;
  gap: $spacing-xs;
}

.equipment-detail__name {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.equipment-detail__price {
  display: flex;
  align-items: center;
  gap: 6px;
}

.equipment-detail__price-icon {
  color: $color-warning;
}

.equipment-detail__price-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-warning;
}

.equipment-detail__price-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.equipment-detail__section {
  @include flex-column;
  gap: $spacing-xs;
}

.equipment-detail__section-title {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-primary;
  padding-bottom: $spacing-xs;
  border-bottom: 1px solid rgba($color-primary, 0.3);
}

.equipment-detail__description {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.equipment-detail__attributes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xs $spacing-md;
}

.equipment-detail__attribute {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-xs;
  background-color: rgba($color-bg-dark, 0.5);
  border-radius: $border-radius-sm;
  border: 1px solid $color-border-light;
}

.equipment-detail__attr-name {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.equipment-detail__attr-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-success;
}

.equipment-detail__passive-section {
  background: linear-gradient(135deg, rgba($color-primary, 0.1) 0%, rgba($color-bg-dark, 0.3) 100%);
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  border: 1px solid rgba($color-primary, 0.3);
}

.equipment-detail__passive-icon {
  color: $color-primary;
}

.equipment-detail__passive {
  margin: 0;
  font-size: $font-size-md;
  color: $color-primary;
  line-height: 1.6;
  font-style: italic;
}

// 响应式设计 - 弹窗
@media (max-width: $breakpoint-sm) {
  .equipment-detail-dialog {
    .el-dialog {
      width: 95% !important;
      margin: 0 auto;
    }
  }

  .equipment-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .equipment-detail__attributes {
    grid-template-columns: 1fr;
  }
}
</style>
