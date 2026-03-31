<script setup lang="ts">
/**
 * HeroDetailView - 英雄详情页
 * Task 8.1: 实现动态路由数据获取
 * Task 8.3: 实现技能展示区块
 * Task 8.4: 实现皮肤展示区块
 * Task 8.5: 实现收藏功能
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.5
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getHeroById } from '@/data/heroes'
import { useUserStore } from '@/stores/user'
import type { Hero, Skill, Skin } from '@/types'

// Route and router
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// State
const hero = ref<Hero | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedSkill = ref<Skill | null>(null)
const selectedSkin = ref<Skin | null>(null)
const showSkinModal = ref(false)

// Computed
const isFavorite = computed(() => {
  return hero.value ? userStore.isFavorite(hero.value.id) : false
})

const difficultyStars = computed(() => {
  return hero.value ? '★'.repeat(hero.value.difficulty) + '☆'.repeat(3 - hero.value.difficulty) : ''
})

const roleLabel = computed(() => {
  const roleMap: Record<string, string> = {
    warrior: '战士',
    mage: '法师',
    assassin: '刺客',
    marksman: '射手',
    support: '辅助',
    tank: '坦克'
  }
  return hero.value ? roleMap[hero.value.role] || hero.value.role : ''
})

// Methods
const loadHero = () => {
  isLoading.value = true
  error.value = null
  
  const heroId = Number(route.params.id)
  
  if (isNaN(heroId)) {
    error.value = '无效的英雄ID'
    isLoading.value = false
    return
  }
  
  // Simulate async loading
  setTimeout(() => {
    const foundHero = getHeroById(heroId)
    
    if (foundHero) {
      hero.value = foundHero
      selectedSkill.value = foundHero.skills[0] || null
      selectedSkin.value = foundHero.skins[0] || null
      // Add to browsing history
      userStore.addHistory(heroId)
    } else {
      error.value = '未找到该英雄'
    }
    
    isLoading.value = false
  }, 300)
}

const toggleFavorite = () => {
  if (!hero.value) return
  
  const isNowFavorite = userStore.toggleFavorite(hero.value.id)
  
  if (isNowFavorite) {
    ElMessage.success(`已将 ${hero.value.name} 添加到收藏`)
  } else {
    ElMessage.info(`已将 ${hero.value.name} 从收藏移除`)
  }
}
// Suppress unused variable warning
void toggleFavorite

const selectSkill = (skill: Skill) => {
  selectedSkill.value = skill
}

const openSkinPreview = (skin: Skin) => {
  selectedSkin.value = skin
  showSkinModal.value = true
}

const closeSkinModal = () => {
  showSkinModal.value = false
}

const goBack = () => {
  router.push('/heroes')
}

// Lifecycle
onMounted(() => {
  loadHero()
})

// Watch for route changes
watch(() => route.params.id, () => {
  loadHero()
})
</script>

<template>
  <div class="hero-detail-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>{{ error }}</h2>
      <button class="back-button" @click="goBack">返回英雄列表</button>
    </div>

    <!-- Hero Content -->
    <div v-else-if="hero" class="hero-content">
      <!-- Header with back button and favorite button -->
      <div class="hero-header">
        <button class="back-btn" @click="goBack" aria-label="返回">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </button>
        <button 
          class="favorite-btn" 
          :class="{ 'is-favorite': isFavorite }" 
          @click="toggleFavorite"
          aria-label="收藏"
        >
          <svg v-if="isFavorite" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          {{ isFavorite ? '已收藏' : '收藏' }}
        </button>
      </div>

      <!-- Hero Info Section -->
      <section class="hero-info">
        <div class="hero-avatar-wrapper">
          <img :src="hero.avatar" :alt="hero.name" class="hero-avatar" />
          <span class="hero-role-badge">{{ roleLabel }}</span>
        </div>
        <div class="hero-details">
          <h1 class="hero-name">{{ hero.name }}</h1>
          <p class="hero-title">{{ hero.title }}</p>
          <div class="hero-meta">
            <span class="meta-item">
              <span class="meta-label">定位</span>
              <span class="meta-value">{{ roleLabel }}</span>
            </span>
            <span class="meta-item">
              <span class="meta-label">难度</span>
              <span class="meta-value difficulty">{{ difficultyStars }}</span>
            </span>
          </div>
          <p class="hero-story">{{ hero.story }}</p>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="skills-section">
        <h2 class="section-title">
          <span class="title-icon">⚔️</span>
          技能介绍
        </h2>
        <div class="skills-container">
          <div class="skill-icons">
            <button
              v-for="skill in hero.skills"
              :key="skill.id"
              class="skill-icon-btn"
              :class="{ active: selectedSkill?.id === skill.id }"
              @click="selectSkill(skill)"
            >
              <img :src="skill.icon" :alt="skill.name" class="skill-icon" />
            </button>
          </div>
          <Transition name="skill-fade" mode="out-in">
            <div v-if="selectedSkill" :key="selectedSkill.id" class="skill-detail">
              <h3 class="skill-name">{{ selectedSkill.name }}</h3>
              <p v-if="selectedSkill.cooldown > 0" class="skill-cooldown">
                冷却时间: {{ selectedSkill.cooldown }}秒
              </p>
              <p v-else class="skill-cooldown passive">被动技能</p>
              <p class="skill-description">{{ selectedSkill.description }}</p>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Skins Section -->
      <section class="skins-section">
        <h2 class="section-title">
          <span class="title-icon">👗</span>
          皮肤展示
        </h2>
        <div class="skins-grid">
          <div
            v-for="skin in hero.skins"
            :key="skin.id"
            class="skin-card"
            @click="openSkinPreview(skin)"
          >
            <img :src="skin.image" :alt="skin.name" class="skin-image" loading="lazy" />
            <div class="skin-info">
              <span class="skin-name">{{ skin.name }}</span>
              <span v-if="skin.price" class="skin-price">{{ skin.price }} 点券</span>
              <span v-else class="skin-price free">免费</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Skin Preview Modal -->
    <Transition name="modal-fade">
      <div v-if="showSkinModal && selectedSkin" class="skin-modal" @click.self="closeSkinModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeSkinModal" aria-label="关闭">×</button>
          <img :src="selectedSkin.image" :alt="selectedSkin.name" class="modal-image" />
          <div class="modal-info">
            <h3>{{ selectedSkin.name }}</h3>
            <p v-if="selectedSkin.price">{{ selectedSkin.price }} 点券</p>
            <p v-else>免费获取</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/mixins.scss";

.hero-detail-view {
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
  margin-bottom: $spacing-md;
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
  }
}

// Header
.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.back-btn, .favorite-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  background: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  color: $color-text-primary;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}

.favorite-btn.is-favorite {
  background: rgba($color-primary, 0.2);
  border-color: $color-primary;
  color: $color-primary;
}

// Hero Info Section
.hero-info {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.hero-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.hero-avatar {
  width: 200px;
  height: 200px;
  border-radius: $border-radius-lg;
  object-fit: cover;
  border: 3px solid $color-primary;

  @media (max-width: $breakpoint-md) {
    width: 150px;
    height: 150px;
  }
}

.hero-role-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px $spacing-sm;
  background: $color-primary;
  color: $color-bg-dark;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  border-radius: $border-radius-sm;
}

.hero-details {
  flex: 1;
}

.hero-name {
  margin: 0 0 $spacing-xs;
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.hero-title {
  margin: 0 0 $spacing-md;
  font-size: $font-size-lg;
  color: $color-text-secondary;
}

.hero-meta {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-md;

  @media (max-width: $breakpoint-md) {
    justify-content: center;
  }
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.meta-value {
  font-size: $font-size-md;
  color: $color-text-primary;
  font-weight: $font-weight-medium;

  &.difficulty {
    color: $color-primary;
    letter-spacing: 2px;
  }
}

.hero-story {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

// Section Title
.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin: 0 0 $spacing-md;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.title-icon {
  font-size: $font-size-lg;
}

// Skills Section
.skills-section {
  margin-bottom: $spacing-xl;
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;
}

.skills-container {
  display: flex;
  gap: $spacing-lg;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.skill-icons {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @media (max-width: $breakpoint-md) {
    flex-direction: row;
    justify-content: center;
  }
}

.skill-icon-btn {
  width: 64px;
  height: 64px;
  padding: 4px;
  background: $color-bg-dark;
  border: 2px solid $color-border;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-primary;
  }

  &.active {
    border-color: $color-primary;
    box-shadow: 0 0 12px rgba($color-primary, 0.4);
  }
}

.skill-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $border-radius-sm;
}

.skill-detail {
  flex: 1;
  padding: $spacing-md;
  background: $color-bg-dark;
  border-radius: $border-radius-md;
}

.skill-name {
  margin: 0 0 $spacing-xs;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.skill-cooldown {
  margin: 0 0 $spacing-sm;
  font-size: $font-size-sm;
  color: $color-text-muted;

  &.passive {
    color: $color-primary;
  }
}

.skill-description {
  margin: 0;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

// Skill Transition
.skill-fade-enter-active,
.skill-fade-leave-active {
  transition: all 0.2s ease;
}

.skill-fade-enter-from,
.skill-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

// Skins Section
.skins-section {
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border;
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
}

.skin-card {
  position: relative;
  border-radius: $border-radius-md;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    border-color: $color-primary;
    box-shadow: 0 8px 24px rgba($color-primary, 0.2);

    .skin-image {
      transform: scale(1.05);
    }
  }
}

.skin-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform $transition-normal;
}

.skin-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-sm;
  background: linear-gradient(transparent, rgba($color-bg-dark, 0.9));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skin-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.skin-price {
  font-size: $font-size-xs;
  color: $color-primary;

  &.free {
    color: $color-text-muted;
  }
}

// Modal
.skin-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: $color-bg-card;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 40px;
  height: 40px;
  background: rgba($color-bg-dark, 0.8);
  border: none;
  border-radius: 50%;
  color: $color-text-primary;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
  transition: all $transition-fast;

  &:hover {
    background: $color-primary;
    color: $color-bg-dark;
  }
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-info {
  padding: $spacing-md;
  text-align: center;

  h3 {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-lg;
    color: $color-text-primary;
  }

  p {
    margin: 0;
    color: $color-primary;
  }
}

// Modal Transition
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
