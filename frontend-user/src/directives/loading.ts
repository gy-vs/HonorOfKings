/**
 * v-loading 自定义指令
 * Task 4.1: 实现 v-loading 指令
 * Requirements: 2.5
 * 
 * Features:
 * - Show/hide loading overlay when binding value is true/false
 * - Apply Honor of Kings theme styling (gold spinner)
 * - Support modifiers:
 *   - v-loading.fullscreen: Show fullscreen loading overlay
 *   - v-loading.text="Loading...": Custom loading text
 * - Ensure parent element has position: relative when loading is shown
 */
import type { Directive, DirectiveBinding } from 'vue'

// Loading element data key
const LOADING_KEY = Symbol('loading')

// Interface for loading element data
interface LoadingData {
  overlay: HTMLElement | null
  originalPosition: string
}

// Extend HTMLElement to include loading data
interface LoadingHTMLElement extends HTMLElement {
  [LOADING_KEY]?: LoadingData
}

/**
 * Create the loading overlay element with Honor of Kings theme styling
 */
function createLoadingOverlay(isFullscreen: boolean, text?: string): HTMLElement {
  const overlay = document.createElement('div')
  overlay.className = `hok-loading-overlay${isFullscreen ? ' hok-loading-overlay--fullscreen' : ''}`
  
  // Create spinner container
  const spinnerContainer = document.createElement('div')
  spinnerContainer.className = 'hok-loading-spinner-container'
  
  // Create spinner
  const spinner = document.createElement('div')
  spinner.className = 'hok-loading-spinner'
  
  // Create inner glow
  const innerGlow = document.createElement('div')
  innerGlow.className = 'hok-loading-spinner-inner'
  spinner.appendChild(innerGlow)
  
  spinnerContainer.appendChild(spinner)
  
  // Add text if provided
  if (text) {
    const textElement = document.createElement('span')
    textElement.className = 'hok-loading-text'
    textElement.textContent = text
    spinnerContainer.appendChild(textElement)
  }
  
  overlay.appendChild(spinnerContainer)
  
  return overlay
}

/**
 * Show loading overlay
 */
function showLoading(el: LoadingHTMLElement, binding: DirectiveBinding<boolean>): void {
  const data = el[LOADING_KEY]
  if (!data || data.overlay) return
  
  const isFullscreen = binding.modifiers.fullscreen === true
  const text = typeof binding.arg === 'string' ? binding.arg : undefined
  
  // Create and append overlay
  const overlay = createLoadingOverlay(isFullscreen, text)
  data.overlay = overlay
  
  if (isFullscreen) {
    // Fullscreen mode: append to body
    document.body.appendChild(overlay)
    document.body.style.overflow = 'hidden'
  } else {
    // Normal mode: append to element
    // Ensure parent has position relative
    const computedStyle = window.getComputedStyle(el)
    if (computedStyle.position === 'static') {
      data.originalPosition = el.style.position
      el.style.position = 'relative'
    }
    el.appendChild(overlay)
  }
  
  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('hok-loading-overlay--visible')
  })
}

/**
 * Hide loading overlay
 */
function hideLoading(el: LoadingHTMLElement, binding: DirectiveBinding<boolean>): void {
  const data = el[LOADING_KEY]
  if (!data || !data.overlay) return
  
  const overlay = data.overlay
  const isFullscreen = binding.modifiers.fullscreen
  
  // Remove visible class for fade out animation
  overlay.classList.remove('hok-loading-overlay--visible')
  
  // Wait for animation to complete before removing
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay)
    }
    
    if (isFullscreen) {
      document.body.style.overflow = ''
    } else {
      // Restore original position
      if (data.originalPosition !== undefined) {
        el.style.position = data.originalPosition
      }
    }
    
    data.overlay = null
  }, 300) // Match transition duration
}

/**
 * v-loading directive
 * 
 * Usage:
 * - v-loading="isLoading" - Basic loading overlay
 * - v-loading.fullscreen="isLoading" - Fullscreen loading overlay
 * - v-loading:Loading...="isLoading" - Loading with custom text
 * - v-loading:加载中....fullscreen="isLoading" - Fullscreen with text
 */
const vLoading: Directive<LoadingHTMLElement, boolean> = {
  // Called when directive is first bound to element
  mounted(el: LoadingHTMLElement, binding: DirectiveBinding<boolean>) {
    // Initialize loading data
    el[LOADING_KEY] = {
      overlay: null,
      originalPosition: ''
    }
    
    // Show loading if initial value is true
    if (binding.value) {
      showLoading(el, binding)
    }
  },
  
  // Called when binding value changes
  updated(el: LoadingHTMLElement, binding: DirectiveBinding<boolean>) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        showLoading(el, binding)
      } else {
        hideLoading(el, binding)
      }
    }
  },
  
  // Called when directive is unbound from element
  unmounted(el: LoadingHTMLElement, binding: DirectiveBinding<boolean>) {
    // Clean up any existing overlay
    const data = el[LOADING_KEY]
    if (data?.overlay) {
      if (data.overlay.parentNode) {
        data.overlay.parentNode.removeChild(data.overlay)
      }
      if (binding.modifiers.fullscreen) {
        document.body.style.overflow = ''
      }
    }
    delete el[LOADING_KEY]
  }
}

export default vLoading
