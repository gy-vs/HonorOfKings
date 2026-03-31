/**
 * App Store - 应用全局状态管理
 * 
 * 管理应用级别的全局状态，包括加载状态、主题、错误处理等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Theme types
export type ThemeMode = 'dark' | 'light'

// Toast message types
export interface ToastMessage {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  duration?: number
}

// Error state
export interface AppError {
  code: string
  message: string
  timestamp: number
}

// LocalStorage key for theme
const THEME_STORAGE_KEY = 'hok_app_theme'

/**
 * Load theme from localStorage
 */
function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored === 'light' || stored === 'dark') ? stored : 'dark'
  } catch {
    return 'dark'
  }
}

export const useAppStore = defineStore('app', () => {
  // ==================== State ====================
  
  // 全局加载状态
  const isLoading = ref(false)
  
  // 当前主题模式
  const currentTheme = ref<ThemeMode>(loadTheme())
  
  // 页面标题
  const pageTitle = ref('王者荣耀')
  
  // 全局错误状态
  const error = ref<AppError | null>(null)
  
  // Toast 消息队列
  const toastMessages = ref<ToastMessage[]>([])
  
  // Toast ID 计数器
  let toastIdCounter = 0
  
  // 侧边栏状态（移动端）
  const isSidebarOpen = ref(false)
  
  // 网络状态
  const isOnline = ref(navigator.onLine)

  // ==================== Getters ====================
  
  /**
   * 是否为暗色主题
   */
  const isDarkTheme = computed(() => currentTheme.value === 'dark')
  
  /**
   * 是否有错误
   */
  const hasError = computed(() => error.value !== null)
  
  /**
   * 当前 Toast 消息数量
   */
  const toastCount = computed(() => toastMessages.value.length)

  // ==================== Actions ====================
  
  /**
   * 设置加载状态
   * @param loading - 是否加载中
   */
  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  /**
   * 开始加载
   */
  function startLoading(): void {
    isLoading.value = true
  }

  /**
   * 结束加载
   */
  function stopLoading(): void {
    isLoading.value = false
  }

  /**
   * 切换主题
   */
  function toggleTheme(): void {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    saveTheme()
  }

  /**
   * 设置主题
   * @param theme - 主题模式
   */
  function setTheme(theme: ThemeMode): void {
    currentTheme.value = theme
    saveTheme()
  }

  /**
   * 保存主题到 localStorage
   */
  function saveTheme(): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme.value)
    } catch (e) {
      console.warn('Failed to save theme:', e)
    }
  }

  /**
   * 设置页面标题
   * @param title - 页面标题
   */
  function setPageTitle(title: string): void {
    pageTitle.value = title
    document.title = `${title} - 王者荣耀`
  }

  /**
   * 设置错误状态
   * @param err - 错误信息
   */
  function setError(err: { code: string; message: string } | null): void {
    if (err) {
      error.value = {
        ...err,
        timestamp: Date.now()
      }
    } else {
      error.value = null
    }
  }

  /**
   * 清除错误状态
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * 显示 Toast 消息
   * @param type - 消息类型
   * @param message - 消息内容
   * @param duration - 显示时长（毫秒），默认 3000
   * @returns Toast ID
   */
  function showToast(
    type: ToastMessage['type'], 
    message: string, 
    duration: number = 3000
  ): number {
    const id = ++toastIdCounter
    const toast: ToastMessage = {
      id,
      type,
      message,
      duration
    }
    
    toastMessages.value.push(toast)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  /**
   * 显示成功消息
   */
  function showSuccess(message: string, duration?: number): number {
    return showToast('success', message, duration)
  }

  /**
   * 显示警告消息
   */
  function showWarning(message: string, duration?: number): number {
    return showToast('warning', message, duration)
  }

  /**
   * 显示错误消息
   */
  function showError(message: string, duration?: number): number {
    return showToast('error', message, duration)
  }

  /**
   * 显示信息消息
   */
  function showInfo(message: string, duration?: number): number {
    return showToast('info', message, duration)
  }

  /**
   * 移除 Toast 消息
   * @param id - Toast ID
   */
  function removeToast(id: number): void {
    const index = toastMessages.value.findIndex(t => t.id === id)
    if (index > -1) {
      toastMessages.value.splice(index, 1)
    }
  }

  /**
   * 清除所有 Toast 消息
   */
  function clearAllToasts(): void {
    toastMessages.value = []
  }

  /**
   * 切换侧边栏状态
   */
  function toggleSidebar(): void {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  /**
   * 设置侧边栏状态
   * @param open - 是否打开
   */
  function setSidebarOpen(open: boolean): void {
    isSidebarOpen.value = open
  }

  /**
   * 设置网络状态
   * @param online - 是否在线
   */
  function setOnlineStatus(online: boolean): void {
    isOnline.value = online
  }

  // ==================== Initialize ====================
  
  // Listen for online/offline events
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => setOnlineStatus(true))
    window.addEventListener('offline', () => setOnlineStatus(false))
  }

  // ==================== Return ====================
  
  return {
    // State
    isLoading,
    currentTheme,
    pageTitle,
    error,
    toastMessages,
    isSidebarOpen,
    isOnline,
    
    // Getters
    isDarkTheme,
    hasError,
    toastCount,
    
    // Actions
    setLoading,
    startLoading,
    stopLoading,
    toggleTheme,
    setTheme,
    setPageTitle,
    setError,
    clearError,
    showToast,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    removeToast,
    clearAllToasts,
    toggleSidebar,
    setSidebarOpen,
    setOnlineStatus
  }
})
