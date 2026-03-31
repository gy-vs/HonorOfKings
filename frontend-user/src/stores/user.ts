/**
 * User Store - 用户状态管理
 * 
 * 管理用户收藏的英雄和浏览历史
 * 
 * Requirements:
 * - 6.2: Retrieve favorite heroes from Pinia store
 * - 6.5: Show recently viewed heroes with timestamps
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { HistoryItem } from '@/types'

// LocalStorage keys
const STORAGE_KEYS = {
  FAVORITES: 'hok_user_favorites',
  HISTORY: 'hok_user_history',
  USERNAME: 'hok_user_username'
}

// Maximum history items to keep
const MAX_HISTORY_ITEMS = 20

/**
 * Load data from localStorage with fallback
 */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

/**
 * Save data to localStorage
 */
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  
  // 收藏的英雄 ID 列表
  const favorites = ref<number[]>(
    loadFromStorage(STORAGE_KEYS.FAVORITES, [])
  )
  
  // 浏览历史记录
  const history = ref<HistoryItem[]>(
    loadFromStorage(STORAGE_KEYS.HISTORY, [])
  )
  
  // 用户名
  const username = ref<string>(
    loadFromStorage(STORAGE_KEYS.USERNAME, '召唤师')
  )

  // ==================== Getters ====================
  
  /**
   * 检查英雄是否已收藏
   * Returns a function that checks if a hero is in favorites
   */
  const isFavorite = computed(() => (heroId: number) => 
    favorites.value.includes(heroId)
  )

  /**
   * 收藏数量
   */
  const favoriteCount = computed(() => favorites.value.length)
  
  /**
   * 历史记录数量
   */
  const historyCount = computed(() => history.value.length)

  /**
   * 获取按时间排序的历史记录（最新在前）
   */
  const sortedHistory = computed(() => 
    [...history.value].sort((a, b) => b.timestamp - a.timestamp)
  )

  // ==================== Actions ====================
  
  /**
   * 切换英雄收藏状态
   * @param heroId - 英雄 ID
   * @returns boolean - 操作后是否为收藏状态
   */
  function toggleFavorite(heroId: number): boolean {
    const index = favorites.value.indexOf(heroId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      return false
    } else {
      favorites.value.push(heroId)
      return true
    }
  }

  /**
   * 添加英雄到收藏
   * @param heroId - 英雄 ID
   */
  function addFavorite(heroId: number): void {
    if (!favorites.value.includes(heroId)) {
      favorites.value.push(heroId)
    }
  }

  /**
   * 从收藏中移除英雄
   * @param heroId - 英雄 ID
   */
  function removeFavorite(heroId: number): void {
    const index = favorites.value.indexOf(heroId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  /**
   * 清空所有收藏
   */
  function clearFavorites(): void {
    favorites.value = []
  }

  /**
   * 添加浏览历史
   * 如果英雄已在历史中，更新其时间戳并移到最前
   * 保留最近 20 条记录
   * @param heroId - 英雄 ID
   */
  function addHistory(heroId: number): void {
    // Remove existing entry for this hero (if any)
    const existingIndex = history.value.findIndex(item => item.heroId === heroId)
    if (existingIndex > -1) {
      history.value.splice(existingIndex, 1)
    }
    
    // Add to beginning with current timestamp
    history.value.unshift({ 
      heroId, 
      timestamp: Date.now() 
    })
    
    // Keep only last MAX_HISTORY_ITEMS items
    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value.pop()
    }
  }

  /**
   * 清空浏览历史
   * Property 10: Clear History Idempotence - 多次调用效果相同
   */
  function clearHistory(): void {
    history.value = []
  }

  /**
   * 从历史记录中移除特定英雄
   * @param heroId - 英雄 ID
   */
  function removeFromHistory(heroId: number): void {
    const index = history.value.findIndex(item => item.heroId === heroId)
    if (index > -1) {
      history.value.splice(index, 1)
    }
  }

  /**
   * 设置用户名
   * @param name - 新用户名
   */
  function setUsername(name: string): void {
    username.value = name
  }

  // ==================== Persistence ====================
  
  // Watch for changes and persist to localStorage
  watch(favorites, (newValue) => {
    saveToStorage(STORAGE_KEYS.FAVORITES, newValue)
  }, { deep: true })

  watch(history, (newValue) => {
    saveToStorage(STORAGE_KEYS.HISTORY, newValue)
  }, { deep: true })

  watch(username, (newValue) => {
    saveToStorage(STORAGE_KEYS.USERNAME, newValue)
  })

  // ==================== Return ====================
  
  return {
    // State
    favorites,
    history,
    username,
    
    // Getters
    isFavorite,
    favoriteCount,
    historyCount,
    sortedHistory,
    
    // Actions
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    addHistory,
    clearHistory,
    removeFromHistory,
    setUsername
  }
})
