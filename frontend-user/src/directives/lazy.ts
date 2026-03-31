/**
 * v-lazy 图片懒加载指令
 * Task 4.2: 实现 v-lazy 图片懒加载指令
 * Requirements: 1.2
 * 
 * Features:
 * - Use IntersectionObserver to detect when image enters viewport
 * - Load the actual image source when visible
 * - Support placeholder image while loading
 * - Add fade-in animation when image loads
 * - Handle loading errors gracefully
 */
import type { Directive, DirectiveBinding } from 'vue'

// Lazy loading data key
const LAZY_KEY = Symbol('lazy')

// Interface for lazy loading options
interface LazyOptions {
  src: string
  placeholder?: string
  error?: string
}

// Interface for lazy element data
interface LazyData {
  observer: IntersectionObserver | null
  loaded: boolean
}

// Extend HTMLImageElement to include lazy data
interface LazyHTMLImageElement extends HTMLImageElement {
  [LAZY_KEY]?: LazyData
}

// Default placeholder - a simple gray gradient SVG
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxQTI3NDQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwQTE0MjgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=='

// Default error image - a simple error indicator SVG
const DEFAULT_ERROR_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFBMjc0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjQzhhYTZlIiBmb250LXNpemU9IjE0Ij7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+'

/**
 * Parse binding value to get lazy options
 */
function parseOptions(binding: DirectiveBinding<string | LazyOptions>): LazyOptions {
  if (typeof binding.value === 'string') {
    return {
      src: binding.value,
      placeholder: DEFAULT_PLACEHOLDER,
      error: DEFAULT_ERROR_IMAGE
    }
  }
  return {
    src: binding.value.src,
    placeholder: binding.value.placeholder || DEFAULT_PLACEHOLDER,
    error: binding.value.error || DEFAULT_ERROR_IMAGE
  }
}

/**
 * Add fade-in animation styles to the image
 */
function addFadeInStyles(el: HTMLImageElement): void {
  el.style.opacity = '0'
  el.style.transition = 'opacity 0.3s ease-in-out'
}

/**
 * Trigger fade-in animation
 */
function triggerFadeIn(el: HTMLImageElement): void {
  // Use requestAnimationFrame to ensure the transition works
  requestAnimationFrame(() => {
    el.style.opacity = '1'
  })
}

/**
 * Load the actual image
 */
function loadImage(el: LazyHTMLImageElement, options: LazyOptions): void {
  const data = el[LAZY_KEY]
  if (!data || data.loaded) return

  // Create a temporary image to preload
  const tempImage = new Image()
  
  tempImage.onload = () => {
    // Set the actual source
    el.src = options.src
    data.loaded = true
    
    // Trigger fade-in animation
    triggerFadeIn(el)
    
    // Add loaded class for additional styling if needed
    el.classList.add('hok-lazy-loaded')
    el.classList.remove('hok-lazy-loading')
  }
  
  tempImage.onerror = () => {
    // Set error image
    el.src = options.error || DEFAULT_ERROR_IMAGE
    data.loaded = true
    
    // Trigger fade-in animation even for error state
    triggerFadeIn(el)
    
    // Add error class for styling
    el.classList.add('hok-lazy-error')
    el.classList.remove('hok-lazy-loading')
  }
  
  // Add loading class
  el.classList.add('hok-lazy-loading')
  
  // Start loading the image
  tempImage.src = options.src
}

/**
 * Create IntersectionObserver for lazy loading
 */
function createObserver(el: LazyHTMLImageElement, options: LazyOptions): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        // Image is in viewport, load it
        loadImage(el, options)
        // Disconnect observer after loading
        observer.disconnect()
      }
    },
    {
      // Start loading when image is 100px from viewport
      rootMargin: '100px',
      threshold: 0
    }
  )
  
  return observer
}

/**
 * v-lazy directive
 * 
 * Usage:
 * - v-lazy="imageUrl" - Basic lazy loading with default placeholder
 * - v-lazy="{ src: imageUrl, placeholder: placeholderUrl }" - With custom placeholder
 * - v-lazy="{ src: imageUrl, error: errorUrl }" - With custom error image
 * - v-lazy="{ src: imageUrl, placeholder: placeholderUrl, error: errorUrl }" - Full options
 */
const vLazy: Directive<LazyHTMLImageElement, string | LazyOptions> = {
  // Called when directive is first bound to element
  mounted(el: LazyHTMLImageElement, binding: DirectiveBinding<string | LazyOptions>) {
    const options = parseOptions(binding)
    
    // Initialize lazy data
    el[LAZY_KEY] = {
      observer: null,
      loaded: false
    }
    
    // Add lazy class
    el.classList.add('hok-lazy')
    
    // Set placeholder image
    el.src = options.placeholder || DEFAULT_PLACEHOLDER
    
    // Add fade-in styles
    addFadeInStyles(el)
    
    // Create and start observer
    const observer = createObserver(el, options)
    el[LAZY_KEY].observer = observer
    observer.observe(el)
  },
  
  // Called when binding value changes
  updated(el: LazyHTMLImageElement, binding: DirectiveBinding<string | LazyOptions>) {
    const data = el[LAZY_KEY]
    if (!data) return
    
    const oldOptions = parseOptions({ ...binding, value: binding.oldValue } as DirectiveBinding<string | LazyOptions>)
    const newOptions = parseOptions(binding)
    
    // If source changed, reset and reload
    if (oldOptions.src !== newOptions.src) {
      // Disconnect old observer
      if (data.observer) {
        data.observer.disconnect()
      }
      
      // Reset state
      data.loaded = false
      el.classList.remove('hok-lazy-loaded', 'hok-lazy-error', 'hok-lazy-loading')
      
      // Set new placeholder
      el.src = newOptions.placeholder || DEFAULT_PLACEHOLDER
      el.style.opacity = '0'
      
      // Create new observer
      const observer = createObserver(el, newOptions)
      data.observer = observer
      observer.observe(el)
    }
  },
  
  // Called when directive is unbound from element
  unmounted(el: LazyHTMLImageElement) {
    const data = el[LAZY_KEY]
    if (data?.observer) {
      data.observer.disconnect()
    }
    delete el[LAZY_KEY]
  }
}

export default vLazy
