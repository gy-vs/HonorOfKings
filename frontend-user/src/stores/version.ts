/**
 * Version Store - 版本中心状态管理
 * 
 * 管理游戏版本信息、版本历史、过滤状态等
 * 
 * Requirements:
 * - 1.5: Fetch and display latest version information from backend
 * - 6.2: Filter versions by version number
 * - 6.3: Filter versions by date range
 * - 6.4: Update version list and timeline when filter is applied
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Version, VersionFilter } from '@/types'
import { versions as mockVersions } from '@/data/versions'

export const useVersionStore = defineStore('version', () => {
  // ==================== State ====================
  
  /**
   * 所有版本列表
   */
  const versions = ref<Version[]>([])
  
  /**
   * 当前版本
   */
  const currentVersion = ref<Version | null>(null)
  
  /**
   * 过滤后的版本列表
   */
  const filteredVersions = ref<Version[]>([])
  
  /**
   * 当前过滤状态
   */
  const filterState = ref<VersionFilter>({})
  
  /**
   * 加载状态
   */
  const isLoading = ref(false)
  
  /**
   * 错误状态
   */
  const error = ref<string | null>(null)
  
  /**
   * 缓存状态 - 上次数据获取的时间戳
   */
  const cacheTimestamp = ref<number | null>(null)
  
  /**
   * 缓存过期时间（毫秒）- 默认 1 小时
   */
  const CACHE_EXPIRATION_TIME = 60 * 60 * 1000
  
  /**
   * 缓存统计信息
   */
  const cacheStats = ref({
    hits: 0,
    misses: 0,
    invalidations: 0
  })

  // ==================== Cache Helper Functions ====================
  
  /**
   * 检查缓存是否有效
   * @returns 如果缓存未过期且存在数据，返回 true
   */
  function isCacheValid(): boolean {
    if (cacheTimestamp.value === null || versions.value.length === 0) {
      return false
    }
    
    const now = Date.now()
    const cacheAge = now - cacheTimestamp.value
    return cacheAge < CACHE_EXPIRATION_TIME
  }
  
  /**
   * 记录缓存命中
   */
  function recordCacheHit(): void {
    cacheStats.value.hits++
    console.debug(`[VersionStore] Cache hit. Total hits: ${cacheStats.value.hits}`)
  }
  
  /**
   * 记录缓存未命中
   */
  function recordCacheMiss(): void {
    cacheStats.value.misses++
    console.debug(`[VersionStore] Cache miss. Total misses: ${cacheStats.value.misses}`)
  }
  
  /**
   * 获取缓存统计信息
   * @returns 缓存统计对象
   */
  function getCacheStats() {
    const hitRate = cacheStats.value.hits + cacheStats.value.misses > 0
      ? ((cacheStats.value.hits / (cacheStats.value.hits + cacheStats.value.misses)) * 100).toFixed(2)
      : 'N/A'
    
    return {
      ...cacheStats.value,
      hitRate: `${hitRate}%`,
      cacheValid: isCacheValid(),
      cacheAge: cacheTimestamp.value ? Date.now() - cacheTimestamp.value : null
    }
  }

  // ==================== Getters ====================
  
  /**
   * 获取当前版本
   * 返回状态为 'active' 的版本
   */
  const getCurrentVersion = computed(() => currentVersion.value)
  
  /**
   * 获取过滤后的版本列表
   * 按发布日期倒序排列
   */
  const getFilteredVersions = computed(() => 
    [...filteredVersions.value].sort((a: Version, b: Version) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    )
  )
  
  /**
   * 获取版本总数
   */
  const getVersionCount = computed(() => versions.value.length)
  
  /**
   * 获取过滤后的版本数量
   */
  const getFilteredVersionCount = computed(() => filteredVersions.value.length)
  
  /**
   * 检查是否有活跃的过滤条件
   */
  const hasActiveFilter = computed(() => 
    Object.keys(filterState.value).length > 0 && 
    Object.values(filterState.value).some((v: any) => v !== undefined && v !== null && v !== '')
  )

  // ==================== Actions ====================
  
  /**
   * 加载所有版本
   * 从数据源加载版本数据并设置当前版本
   * 包含缓存机制、重试机制和错误处理
   * Requirements: 1.5
   */
  function loadVersions(retryCount: number = 0, maxRetries: number = 3): void {
    // 检查缓存是否有效
    if (isCacheValid()) {
      recordCacheHit()
      console.debug('[VersionStore] Using cached version data')
      return
    }
    
    recordCacheMiss()
    isLoading.value = true
    error.value = null
    
    try {
      // 验证数据源
      if (!mockVersions || mockVersions.length === 0) {
        throw new Error('版本数据不可用。请稍后重试。')
      }
      
      // 模拟从后端加载数据
      versions.value = mockVersions
      
      // 设置当前版本（状态为 'active' 的版本）
      const active = versions.value.find((v: Version) => v.status === 'active')
      if (!active) {
        console.warn('未找到活跃版本，使用最新版本作为当前版本')
        if (versions.value.length > 0) {
          currentVersion.value = versions.value[0]
        }
      } else {
        currentVersion.value = active
      }
      
      // 初始化过滤版本列表为所有版本
      filteredVersions.value = [...versions.value]
      
      // 更新缓存时间戳
      cacheTimestamp.value = Date.now()
      
      // 清除错误状态
      error.value = null
      
      console.debug('[VersionStore] Version data loaded and cached successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载版本数据失败'
      
      // 记录错误
      console.error('[VersionStore] Error loading versions:', errorMessage, err)
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        console.warn(`[VersionStore] Retrying... (${retryCount + 1}/${maxRetries})`)
        error.value = `加载失败，正在重试... (${retryCount + 1}/${maxRetries})`
        
        // 延迟后重试
        setTimeout(() => {
          loadVersions(retryCount + 1, maxRetries)
        }, 1000 * (retryCount + 1))
      } else {
        // 重试次数已用尽
        error.value = errorMessage
        console.error('[VersionStore] Failed to load versions after retries')
      }
    } finally {
      // 只在最后一次尝试时设置 isLoading 为 false
      if (retryCount === 0 || error.value !== null) {
        isLoading.value = false
      }
    }
  }
  
  /**
   * 设置当前版本
   * @param versionId - 版本 ID
   */
  function setCurrentVersion(versionId: string): void {
    const version = versions.value.find(v => v.id === versionId)
    if (version) {
      currentVersion.value = version
    }
  }
  
  /**
   * 应用过滤条件
   * 根据版本号和日期范围过滤版本列表
   * Requirements: 6.2, 6.3, 6.4
   * @param filter - 过滤条件
   */
  function applyFilter(filter: VersionFilter): void {
    filterState.value = filter
    
    filteredVersions.value = versions.value.filter((version: Version) => {
      // 按版本号过滤
      if (filter.versionNumber && filter.versionNumber.trim() !== '') {
        const searchTerm = filter.versionNumber.toLowerCase()
        if (!version.versionNumber.toLowerCase().includes(searchTerm)) {
          return false
        }
      }
      
      // 按开始日期过滤
      if (filter.startDate) {
        const versionDate = new Date(version.releaseDate)
        const startDate = new Date(filter.startDate)
        if (versionDate < startDate) {
          return false
        }
      }
      
      // 按结束日期过滤
      if (filter.endDate) {
        const versionDate = new Date(version.releaseDate)
        const endDate = new Date(filter.endDate)
        if (versionDate > endDate) {
          return false
        }
      }
      
      return true
    })
  }
  
  /**
   * 清除所有过滤条件
   * 重置过滤状态，显示所有版本
   */
  function clearFilter(): void {
    filterState.value = {}
    filteredVersions.value = [...versions.value]
  }
  
  /**
   * 获取指定版本的详细信息
   * @param versionId - 版本 ID
   * @returns 版本对象或 undefined
   */
  function getVersionById(versionId: string): Version | undefined {
    return versions.value.find((v: Version) => v.id === versionId)
  }
  
  /**
   * 获取指定状态的所有版本
   * @param status - 版本状态
   * @returns 版本数组
   */
  function getVersionsByStatus(status: string): Version[] {
    return versions.value.filter((v: Version) => v.status === status)
  }
  
  /**
   * 清除错误状态
   */
  function clearError(): void {
    error.value = null
  }
  
  /**
   * 重试加载版本数据
   * 用户可以手动触发重试
   * Requirements: 1.5
   */
  function retryLoadVersions(): void {
    loadVersions()
  }
  
  /**
   * 手动清除缓存
   * 强制下次加载时重新获取数据
   */
  function invalidateCache(): void {
    cacheTimestamp.value = null
    cacheStats.value.invalidations++
    console.debug(`[VersionStore] Cache invalidated manually. Total invalidations: ${cacheStats.value.invalidations}`)
  }

  // ==================== Return ====================
  
  return {
    // State
    versions,
    currentVersion,
    filteredVersions,
    filterState,
    isLoading,
    error,
    cacheTimestamp,
    cacheStats,
    
    // Getters
    getCurrentVersion,
    getFilteredVersions,
    getVersionCount,
    getFilteredVersionCount,
    hasActiveFilter,
    
    // Actions
    loadVersions,
    setCurrentVersion,
    applyFilter,
    clearFilter,
    getVersionById,
    getVersionsByStatus,
    clearError,
    retryLoadVersions,
    invalidateCache,
    getCacheStats,
    isCacheValid
  }
})
