/**
 * LoadingSpinner Unit Tests
 * Task 3.6: 实现 LoadingSpinner 组件
 * 
 * **Validates: Requirements 2.5, 5.5**
 * 
 * Tests for:
 * - Spinner rendering with different sizes
 * - Loading text display
 * - Overlay mode functionality
 * - Accessibility attributes
 * - CSS classes and styling
 */
import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

/**
 * Mount LoadingSpinner with default configuration
 */
function mountLoadingSpinner(props: Partial<{
  size: 'small' | 'medium' | 'large'
  text: string
  overlay: boolean
}> = {}): VueWrapper {
  return mount(LoadingSpinner, {
    props
  })
}

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner renders with default props
     */
    it('should render spinner with default props', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__spinner').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__inner').exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner has correct default size class (medium)
     */
    it('should have medium size class by default', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').classes()).toContain('loading-spinner--medium')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner does not show text by default
     */
    it('should not show text by default', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner__text').exists()).toBe(false)
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner is not in overlay mode by default
     */
    it('should not be in overlay mode by default', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').classes()).not.toContain('loading-spinner--overlay')
    })
  })

  describe('Size Prop', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner renders with small size
     */
    it('should render with small size class', () => {
      const wrapper = mountLoadingSpinner({ size: 'small' })
      
      expect(wrapper.find('.loading-spinner').classes()).toContain('loading-spinner--small')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner renders with medium size
     */
    it('should render with medium size class', () => {
      const wrapper = mountLoadingSpinner({ size: 'medium' })
      
      expect(wrapper.find('.loading-spinner').classes()).toContain('loading-spinner--medium')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner renders with large size
     */
    it('should render with large size class', () => {
      const wrapper = mountLoadingSpinner({ size: 'large' })
      
      expect(wrapper.find('.loading-spinner').classes()).toContain('loading-spinner--large')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Small spinner has correct dimensions
     */
    it('should have correct dimensions for small size', () => {
      const wrapper = mountLoadingSpinner({ size: 'small' })
      
      const spinner = wrapper.find('.loading-spinner__spinner')
      const style = spinner.attributes('style')
      
      expect(style).toContain('width: 24px')
      expect(style).toContain('height: 24px')
      expect(style).toContain('border-width: 2px')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Medium spinner has correct dimensions
     */
    it('should have correct dimensions for medium size', () => {
      const wrapper = mountLoadingSpinner({ size: 'medium' })
      
      const spinner = wrapper.find('.loading-spinner__spinner')
      const style = spinner.attributes('style')
      
      expect(style).toContain('width: 40px')
      expect(style).toContain('height: 40px')
      expect(style).toContain('border-width: 3px')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Large spinner has correct dimensions
     */
    it('should have correct dimensions for large size', () => {
      const wrapper = mountLoadingSpinner({ size: 'large' })
      
      const spinner = wrapper.find('.loading-spinner__spinner')
      const style = spinner.attributes('style')
      
      expect(style).toContain('width: 56px')
      expect(style).toContain('height: 56px')
      expect(style).toContain('border-width: 4px')
    })
  })

  describe('Text Prop', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner displays loading text when provided
     */
    it('should display loading text when text prop is provided', () => {
      const wrapper = mountLoadingSpinner({ text: '加载中...' })
      
      const textElement = wrapper.find('.loading-spinner__text')
      expect(textElement.exists()).toBe(true)
      expect(textElement.text()).toBe('加载中...')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner displays custom loading text
     */
    it('should display custom loading text', () => {
      const wrapper = mountLoadingSpinner({ text: '正在获取英雄数据...' })
      
      const textElement = wrapper.find('.loading-spinner__text')
      expect(textElement.text()).toBe('正在获取英雄数据...')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Text element has correct font size for small spinner
     */
    it('should have correct font size for small spinner text', () => {
      const wrapper = mountLoadingSpinner({ size: 'small', text: '加载中' })
      
      const textElement = wrapper.find('.loading-spinner__text')
      const style = textElement.attributes('style')
      
      expect(style).toContain('font-size: 12px')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Text element has correct font size for medium spinner
     */
    it('should have correct font size for medium spinner text', () => {
      const wrapper = mountLoadingSpinner({ size: 'medium', text: '加载中' })
      
      const textElement = wrapper.find('.loading-spinner__text')
      const style = textElement.attributes('style')
      
      expect(style).toContain('font-size: 14px')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Text element has correct font size for large spinner
     */
    it('should have correct font size for large spinner text', () => {
      const wrapper = mountLoadingSpinner({ size: 'large', text: '加载中' })
      
      const textElement = wrapper.find('.loading-spinner__text')
      const style = textElement.attributes('style')
      
      expect(style).toContain('font-size: 16px')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Empty text string does not render text element
     */
    it('should not render text element when text is empty string', () => {
      const wrapper = mountLoadingSpinner({ text: '' })
      
      expect(wrapper.find('.loading-spinner__text').exists()).toBe(false)
    })
  })

  describe('Overlay Mode', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner renders in overlay mode when overlay prop is true
     */
    it('should render in overlay mode when overlay is true', () => {
      const wrapper = mountLoadingSpinner({ overlay: true })
      
      expect(wrapper.find('.loading-spinner').classes()).toContain('loading-spinner--overlay')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner is not in overlay mode when overlay prop is false
     */
    it('should not be in overlay mode when overlay is false', () => {
      const wrapper = mountLoadingSpinner({ overlay: false })
      
      expect(wrapper.find('.loading-spinner').classes()).not.toContain('loading-spinner--overlay')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Overlay mode works with all sizes
     */
    it('should work with all sizes in overlay mode', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
      
      sizes.forEach(size => {
        const wrapper = mountLoadingSpinner({ size, overlay: true })
        
        const spinnerClasses = wrapper.find('.loading-spinner').classes()
        expect(spinnerClasses).toContain('loading-spinner--overlay')
        expect(spinnerClasses).toContain(`loading-spinner--${size}`)
        
        wrapper.unmount()
      })
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Overlay mode works with text
     */
    it('should display text in overlay mode', () => {
      const wrapper = mountLoadingSpinner({ overlay: true, text: '加载中...' })
      
      expect(wrapper.find('.loading-spinner--overlay').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__text').text()).toBe('加载中...')
    })
  })

  describe('Accessibility', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner has correct role attribute
     */
    it('should have role="status" for accessibility', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').attributes('role')).toBe('status')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner has aria-live attribute
     */
    it('should have aria-live="polite" for screen readers', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').attributes('aria-live')).toBe('polite')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner has default aria-label when no text provided
     */
    it('should have default aria-label when no text is provided', () => {
      const wrapper = mountLoadingSpinner()
      
      expect(wrapper.find('.loading-spinner').attributes('aria-label')).toBe('加载中')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner uses text prop as aria-label when provided
     */
    it('should use text prop as aria-label when provided', () => {
      const wrapper = mountLoadingSpinner({ text: '正在加载英雄数据' })
      
      expect(wrapper.find('.loading-spinner').attributes('aria-label')).toBe('正在加载英雄数据')
    })
  })

  describe('CSS Structure', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: All required structural elements exist
     */
    it('should have all required structural elements', () => {
      const wrapper = mountLoadingSpinner({ text: '加载中' })
      
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__content').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__spinner').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__inner').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner__text').exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Spinner element has inline styles for dimensions
     */
    it('should have inline styles on spinner element', () => {
      const wrapper = mountLoadingSpinner()
      
      const spinner = wrapper.find('.loading-spinner__spinner')
      expect(spinner.attributes('style')).toBeTruthy()
    })
  })

  describe('Combined Props', () => {
    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: All props work together correctly
     */
    it('should handle all props together', () => {
      const wrapper = mountLoadingSpinner({
        size: 'large',
        text: '正在加载...',
        overlay: true
      })
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('loading-spinner--large')
      expect(spinner.classes()).toContain('loading-spinner--overlay')
      expect(wrapper.find('.loading-spinner__text').text()).toBe('正在加载...')
      expect(spinner.attributes('aria-label')).toBe('正在加载...')
    })

    /**
     * **Validates: Requirements 2.5, 5.5**
     * 
     * Test: Small overlay spinner with text
     */
    it('should render small overlay spinner with text', () => {
      const wrapper = mountLoadingSpinner({
        size: 'small',
        text: '请稍候',
        overlay: true
      })
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('loading-spinner--small')
      expect(spinner.classes()).toContain('loading-spinner--overlay')
      
      const spinnerElement = wrapper.find('.loading-spinner__spinner')
      const style = spinnerElement.attributes('style')
      expect(style).toContain('width: 24px')
      
      const textElement = wrapper.find('.loading-spinner__text')
      expect(textElement.text()).toBe('请稍候')
      expect(textElement.attributes('style')).toContain('font-size: 12px')
    })
  })
})
