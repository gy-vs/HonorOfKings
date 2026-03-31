<script setup lang="ts">
/**
 * EventsView - 赛事资讯页
 * Task 11.1: 实现赛事状态筛选
 * - upcoming/ongoing/completed 筛选
 * - 使用 ref 管理选中状态
 * - 使用 computed 过滤赛事
 * Requirements: 5.3, 5.4
 * Property 7: Event Status Filter Correctness
 * 
 * Task 11.2: 实现赛事列表展示
 * - 赛事卡片组件
 * - 点击展开详情
 * - Skeleton 加载状态
 * Requirements: 5.1, 5.2, 5.5
 */
import { ref, computed, onMounted } from 'vue'
import { events, eventStatuses } from '@/data/events'
import type { EventStatus } from '@/types'

// Task 11.1: 当前选中的状态筛选
// 使用 ref 管理选中状态
const selectedStatus = ref<EventStatus | 'all'>('all')

// Task 11.2: 加载状态和展开状态
const isLoading = ref(true)
const expandedEventId = ref<number | null>(null)

/**
 * Task 11.1: 使用 computed 过滤赛事
 * Property 7: For any event status filter selection, 
 * all displayed events SHALL have a status property matching the selected filter value.
 * Validates: Requirements 5.3, 5.4
 */
const filteredEvents = computed(() => {
  if (selectedStatus.value === 'all') {
    return events
  }
  return events.filter(event => event.status === selectedStatus.value)
})

/**
 * 选择状态筛选
 * @param status - 要选择的状态
 */
const selectStatus = (status: EventStatus | 'all') => {
  selectedStatus.value = status
}

/**
 * 判断状态是否被选中
 * @param status - 要检查的状态
 */
const isStatusActive = (status: EventStatus | 'all') => {
  return selectedStatus.value === status
}

/**
 * 获取状态显示样式类
 * @param status - 赛事状态
 */
const getStatusClass = (status: EventStatus) => {
  return `status-${status}`
}

/**
 * 获取状态显示文本
 * @param status - 赛事状态
 */
const getStatusText = (status: EventStatus) => {
  const statusMap: Record<EventStatus, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已结束'
  }
  return statusMap[status]
}

/**
 * Task 11.2: 切换赛事展开状态
 * Requirements: 5.2 - When a user clicks on an event card, THE System SHALL expand to show event details
 * @param eventId - 赛事ID
 */
const toggleEventExpand = (eventId: number) => {
  if (expandedEventId.value === eventId) {
    expandedEventId.value = null
  } else {
    expandedEventId.value = eventId
  }
}

/**
 * 判断赛事是否展开
 * @param eventId - 赛事ID
 */
const isEventExpanded = (eventId: number) => {
  return expandedEventId.value === eventId
}

/**
 * Task 11.2: 模拟数据加载
 * Requirements: 5.5 - When event data is loading, THE System SHALL display a skeleton loading state
 */
onMounted(() => {
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<template>
  <div class="events-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">赛事资讯</h1>
      <p class="page-subtitle">查看最新赛事信息，关注精彩对决</p>
    </div>

    <!-- Task 11.1: 状态筛选标签 -->
    <!-- Requirements: 5.3, 5.4 - 按状态分类显示赛事，筛选更新列表 -->
    <div class="filter-section">
      <div class="status-tabs">
        <button
          v-for="status in eventStatuses"
          :key="status.key"
          class="status-tab"
          :class="{ active: isStatusActive(status.key as EventStatus | 'all') }"
          @click="selectStatus(status.key as EventStatus | 'all')"
        >
          {{ status.name }}
        </button>
      </div>
    </div>

    <!-- 赛事数量统计 -->
    <div class="events-count">
      共 <span class="count-number">{{ filteredEvents.length }}</span> 场赛事
    </div>

    <!-- 赛事列表展示 -->
    <div class="events-list-container">
      <!-- Task 11.2: Skeleton 加载状态 -->
      <!-- Requirements: 5.5 - Display a skeleton loading state -->
      <div v-if="isLoading" class="events-list skeleton-list">
        <div v-for="i in 3" :key="i" class="event-card event-card--skeleton">
          <div class="skeleton-header">
            <div class="skeleton-badge"></div>
            <div class="skeleton-date"></div>
          </div>
          <div class="skeleton-title"></div>
          <div class="skeleton-teams">
            <div class="skeleton-team">
              <div class="skeleton-logo"></div>
              <div class="skeleton-name"></div>
            </div>
            <div class="skeleton-vs"></div>
            <div class="skeleton-team">
              <div class="skeleton-logo"></div>
              <div class="skeleton-name"></div>
            </div>
          </div>
          <div class="skeleton-description"></div>
          <div class="skeleton-description skeleton-description--short"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3 class="empty-state__title">暂无赛事</h3>
        <p class="empty-state__description">当前状态下没有赛事</p>
        <button class="empty-state__action" @click="selectStatus('all')">
          查看全部赛事
        </button>
      </div>

      <!-- Events List with TransitionGroup -->
      <TransitionGroup 
        v-else
        name="events-list" 
        tag="div" 
        class="events-list"
      >
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
          :class="{ 'event-card--expanded': isEventExpanded(event.id) }"
          @click="toggleEventExpand(event.id)"
        >
          <div class="event-card__header">
            <span class="event-card__status" :class="getStatusClass(event.status)">
              {{ getStatusText(event.status) }}
            </span>
            <span class="event-card__date">{{ event.date }}</span>
          </div>
          <h3 class="event-card__title">{{ event.title }}</h3>
          <div class="event-card__teams">
            <div class="team">
              <img :src="event.teams[0].logo" :alt="event.teams[0].name" class="team__logo" />
              <span class="team__name">{{ event.teams[0].name }}</span>
            </div>
            <span class="vs">VS</span>
            <div class="team">
              <img :src="event.teams[1].logo" :alt="event.teams[1].name" class="team__logo" />
              <span class="team__name">{{ event.teams[1].name }}</span>
            </div>
          </div>
          
          <!-- Task 11.2: 点击展开详情 -->
          <!-- Requirements: 5.2 - Click to expand event details -->
          <Transition name="expand">
            <div v-if="isEventExpanded(event.id)" class="event-card__details">
              <p class="event-card__description">{{ event.description }}</p>
              <div v-if="event.prize" class="event-card__prize">
                <span class="prize-label">奖金池：</span>
                <span class="prize-value">{{ event.prize }}</span>
              </div>
            </div>
          </Transition>
          
          <!-- 展开/收起提示 -->
          <div class="event-card__expand-hint">
            <span v-if="isEventExpanded(event.id)">点击收起</span>
            <span v-else>点击查看详情</span>
            <svg 
              class="expand-icon" 
              :class="{ 'expand-icon--rotated': isEventExpanded(event.id) }"
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.events-view {
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

// Task 11.1: 状态筛选标签样式
.filter-section {
  margin-bottom: $spacing-md;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
}

.status-tab {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  min-width: 80px;

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

.events-count {
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

.events-list-container {
  transition: opacity $transition-normal;
}

// 赛事列表
.events-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  max-width: 800px;
  margin: 0 auto;
}

// 赛事卡片
.event-card {
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
  padding: $spacing-md;
  transition: all $transition-normal;
  cursor: pointer;

  &:hover {
    border-color: $color-primary;
    box-shadow: $shadow-hover;
    transform: translateY(-2px);
  }
  
  &--expanded {
    border-color: $color-primary;
    box-shadow: $shadow-hover;
  }
}

.event-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.event-card__status {
  padding: 4px $spacing-xs;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  border-radius: $border-radius-sm;
  text-transform: uppercase;

  &.status-upcoming {
    background-color: rgba($color-info, 0.2);
    color: $color-info;
    border: 1px solid $color-info;
  }

  &.status-ongoing {
    background-color: rgba($color-success, 0.2);
    color: $color-success;
    border: 1px solid $color-success;
  }

  &.status-completed {
    background-color: rgba($color-text-muted, 0.2);
    color: $color-text-secondary;
    border: 1px solid $color-text-muted;
  }
}

.event-card__date {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.event-card__title {
  margin: 0 0 $spacing-sm 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.event-card__teams {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;
  margin-bottom: $spacing-sm;
  background-color: rgba($color-bg-dark, 0.5);
  border-radius: $border-radius-md;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  min-width: 100px;
}

.team__logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: $color-bg-card;
  object-fit: contain;
  border: 2px solid $color-border;
}

.team__name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  text-align: center;
}

.vs {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-primary;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.event-card__description {
  margin: 0 0 $spacing-sm 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.event-card__prize {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-border-light;
}

.prize-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.prize-value {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-warning;
}

// Task 11.2: 展开详情区域
.event-card__details {
  padding-top: $spacing-sm;
  border-top: 1px solid $color-border-light;
  margin-top: $spacing-sm;
}

.event-card__expand-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-border-light;
  font-size: $font-size-xs;
  color: $color-text-muted;
  transition: color $transition-fast;
  
  .event-card:hover & {
    color: $color-primary;
  }
}

.expand-icon {
  transition: transform $transition-fast;
  
  &--rotated {
    transform: rotate(180deg);
  }
}

// 展开动画
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

// Task 11.2: Skeleton 加载样式
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  max-width: 800px;
  margin: 0 auto;
}

.event-card--skeleton {
  cursor: default;
  
  &:hover {
    transform: none;
    box-shadow: none;
    border-color: $color-border-light;
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.skeleton-badge {
  width: 70px;
  height: 24px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-date {
  width: 80px;
  height: 16px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
  width: 60%;
  height: 24px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  margin-bottom: $spacing-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-teams {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;
  margin-bottom: $spacing-sm;
  background-color: rgba($color-bg-dark, 0.5);
  border-radius: $border-radius-md;
}

.skeleton-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.skeleton-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: $color-bg-dark;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-name {
  width: 60px;
  height: 14px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-vs {
  width: 30px;
  height: 24px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-description {
  width: 100%;
  height: 14px;
  background-color: $color-bg-dark;
  border-radius: $border-radius-sm;
  margin-bottom: $spacing-xs;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  
  &--short {
    width: 70%;
  }
}

// TransitionGroup Animations
.events-list-move,
.events-list-enter-active,
.events-list-leave-active {
  transition: all 0.3s ease;
}

.events-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.events-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.events-list-leave-active {
  position: absolute;
}

// Empty State Styles
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl * 2;
  text-align: center;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
  max-width: 800px;
  margin: 0 auto;
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
  .events-view {
    padding: $spacing-sm;
  }

  .page-title {
    font-size: $font-size-xl;
  }

  .status-tabs {
    gap: 4px;
    padding: $spacing-xs;
  }

  .status-tab {
    padding: 6px $spacing-xs;
    font-size: $font-size-xs;
    min-width: 60px;
  }

  .event-card__teams {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .team {
    flex-direction: row;
    min-width: auto;
  }

  .team__logo {
    width: 36px;
    height: 36px;
  }

  .vs {
    font-size: $font-size-lg;
  }
}
</style>
