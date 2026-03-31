<template>
  <el-tooltip
    :content="tooltipContent"
    placement="top"
    :show-after="300"
    :hide-after="0"
    effect="dark"
    raw-content
    popper-class="equipment-card-tooltip"
  >
    <div 
      class="equipment-card"
      role="button"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter="handleCardClick"
    >
      <!-- Equipment Icon -->
      <div class="equipment-card__icon-wrapper">
        <img 
          :src="equipment.icon" 
          :alt="equipment.name"
          class="equipment-card__icon"
          loading="lazy"
        />
        <!-- Category Badge -->
        <span 
          class="equipment-card__category-badge"
          :style="{ backgroundColor: categoryColor, borderColor: categoryColor }"
        >
          {{ categoryDisplay }}
        </span>
      </div>

      <!-- Equipment Info -->
      <div class="equipment-card__info">
        <h3 class="equipment-card__name">{{ equipment.name }}</h3>
        
        <!-- Price -->
        <div class="equipment-card__price">
          <el-icon :size="14" class="equipment-card__price-icon">
            <Coin />
          </el-icon>
          <span>{{ formattedPrice }}</span>
        </div>

        <!-- Attributes List -->
        <div class="equipment-card__attributes">
          <div 
            v-for="(attr, index) in equipment.attributes" 
            :key="index"
            class="equipment-card__attribute"
          >
            <span class="equipment-card__attr-name">{{ attr.name }}</span>
            <span class="equipment-card__attr-value">{{ attr.value }}</span>
          </div>
        </div>

        <!-- Passive Ability (if exists) -->
        <div v-if="equipment.passive" class="equipment-card__passive">
          <el-icon :size="12" class="equipment-card__passive-icon">
            <InfoFilled />
          </el-icon>
          <span class="equipment-card__passive-text">{{ equipment.passive }}</span>
        </div>
      </div>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
/**
 * EquipmentCard - 装备卡片组件
 * Task 3.5: 实现 EquipmentCard 组件
 * Requirements: 4.3
 */
import { computed } from 'vue'
import { Coin, InfoFilled } from '@element-plus/icons-vue'
import type { Equipment, EquipmentCategory } from '@/types'

interface EquipmentCardProps {
  equipment: Equipment
}

const props = defineProps<EquipmentCardProps>()

const emit = defineEmits<{
  (e: 'click', equipment: Equipment): void
}>()

const categoryDisplayMap: Record<EquipmentCategory, string> = {
  attack: '攻击',
  magic: '法术',
  defense: '防御',
  movement: '移动',
  jungle: '打野'
}

const categoryColorMap: Record<EquipmentCategory, string> = {
  attack: '#E84057',
  magic: '#9B59B6',
  defense: '#3498DB',
  movement: '#2ECC71',
  jungle: '#F39C12'
}

const categoryDisplay = computed(() => categoryDisplayMap[props.equipment.category] || props.equipment.category)
const categoryColor = computed(() => categoryColorMap[props.equipment.category] || '#C8AA6E')
const formattedPrice = computed(() => props.equipment.price.toLocaleString())

const tooltipContent = computed(() => {
  let content = `<div class="equipment-tooltip">`
  content += `<div class="equipment-tooltip__header">`
  content += `<strong>${props.equipment.name}</strong>`
  content += `<span class="equipment-tooltip__price">${formattedPrice.value} 金币</span>`
  content += `</div>`
  content += `<div class="equipment-tooltip__desc">${props.equipment.description}</div>`
  content += `<div class="equipment-tooltip__attrs">`
  props.equipment.attributes.forEach(attr => {
    content += `<div class="equipment-tooltip__attr">${attr.name}: <span class="equipment-tooltip__value">${attr.value}</span></div>`
  })
  content += `</div>`
  if (props.equipment.passive) {
    content += `<div class="equipment-tooltip__passive">`
    content += `<span class="equipment-tooltip__passive-label">被动: </span>`
    content += `${props.equipment.passive}`
    content += `</div>`
  }
  content += `</div>`
  return content
})

const handleCardClick = (): void => {
  emit('click', props.equipment)
}
</script>

<style lang="scss" scoped>
.equipment-card {
  @include card-style;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  @include focus-ring;
  gap: $spacing-md;

  &:hover {
    .equipment-card__icon {
      transform: scale(1.08);
    }
    .equipment-card__name {
      color: $color-primary;
    }
  }
}

.equipment-card__icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: $color-bg-dark;
  @include flex-center;
  padding: $spacing-sm;
  margin-left:5px;
}

.equipment-card__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform $transition-normal;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.equipment-card__category-badge {
  position: absolute;
  top: $spacing-xs;
  left: $spacing-xs;
  padding: 2px $spacing-xs;
  background: rgba($color-bg-dark, 0.8);
  border: 1px solid $color-primary;
  border-radius: $border-radius-sm;
  color: $color-text-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

.equipment-card__info {
  @include flex-column;
  gap: calc($spacing-xs / 2);
  padding: $spacing-sm;
  flex: 1;
  min-width: 0;
}

.equipment-card__name {
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  transition: color $transition-fast;
  @include text-truncate;
}

.equipment-card__price {
  @include flex-center;
  justify-content: flex-start;
  gap: 4px;
  color: $color-warning;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
}

.equipment-card__price-icon {
  color: $color-warning;
}

.equipment-card__attributes {
  @include flex-column;
  gap: 2px;
  margin-top: calc($spacing-xs / 2);
  padding-top: calc($spacing-xs / 2);
  border-top: 1px solid $color-border-light;
}

.equipment-card__attribute {
  @include flex-between;
  font-size: $font-size-xs;
}

.equipment-card__attr-name {
  color: $color-text-secondary;
}

.equipment-card__attr-value {
  color: $color-success;
  font-weight: $font-weight-medium;
}

.equipment-card__passive {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: calc($spacing-xs / 2);
  padding-top: calc($spacing-xs / 2);
  border-top: 1px solid $color-border-light;
}

.equipment-card__passive-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: $color-primary;
}

.equipment-card__passive-text {
  font-size: $font-size-xs;
  color: $color-primary;
  line-height: 1.4;
  @include text-truncate-lines(2);
}
</style>

<style lang="scss">
.equipment-card-tooltip {
  .el-tooltip__trigger {
    display: block;
  }
}

.equipment-tooltip {
  max-width: 280px;
  padding: $spacing-xs;

  &__header {
    @include flex-between;
    margin-bottom: $spacing-xs;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid rgba($color-primary, 0.3);

    strong {
      color: $color-primary;
      font-size: $font-size-md;
    }
  }

  &__price {
    color: $color-warning;
    font-size: $font-size-sm;
  }

  &__desc {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    line-height: 1.5;
    margin-bottom: $spacing-xs;
  }

  &__attrs {
    margin-bottom: $spacing-xs;
  }

  &__attr {
    font-size: $font-size-sm;
    color: $color-text-primary;
    line-height: 1.6;
  }

  &__value {
    color: $color-success;
    font-weight: $font-weight-medium;
  }

  &__passive {
    padding-top: $spacing-xs;
    border-top: 1px solid rgba($color-primary, 0.3);
    font-size: $font-size-sm;
    color: $color-primary;
    line-height: 1.5;
  }

  &__passive-label {
    font-weight: $font-weight-bold;
  }
}
</style>
