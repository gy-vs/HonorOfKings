/**
 * Pinia Stores Index
 * 
 * 导出所有 Pinia stores 以便统一导入
 */

export { useUserStore } from './user'
export { useAppStore } from './app'

// Re-export types
export type { ThemeMode, ToastMessage, AppError } from './app'
