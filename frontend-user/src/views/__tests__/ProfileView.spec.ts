/**
 * ProfileView Tests
 * 
 * Task 12.2: 实现收藏英雄展示
 * Feature: honor-of-kings-vue-app, Property 8: Favorites Display Store Consistency
 * 
 * **Validates: Requirements 6.2, 6.3, 6.4**
 * 
 * Property Description:
 * For any state of the user store, the profile page favorites section SHALL display 
 * exactly the heroes whose IDs are in the `favorites` array of the store.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as fc from 'fast-check'
import ProfileView from '../ProfileView.vue'
import { useUserStore } from '@/stores/user'
import { heroes } from '@/data/heroes'

// Mock Element Plus message
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn().mockResolvedValue(true)
  }
}))

// Import the mocked module to access the mock functions
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * Helper function to mount ProfileView with router
 */
async function mountProfileView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/profile', name: 'profile', component: ProfileView },
      { path: '/heroes', name: 'heroes', component: { template: '<div/>' } },
      { path: '/heroes/:id', name: 'hero-detail', component: { template: '<div/>' } }
    ]
  })
  
  await router.push('/profile')
  await router.isReady()
  
  const wrapper = mount(ProfileView, {
    global: {
      plugins: [router],
      stubs: { Transition: false, TransitionGroup: false }
    }
  })
  
  // Wait for page load animation
  vi.advanceTimersByTime(150)
  await flushPromises()
  
  return { wrapper, router }
}

describe('ProfileView Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.clearAllMocks()
    // Clear localStorage to ensure clean state
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Feature: honor-of-kings-vue-app, Property 8: Favorites Display Store Consistency', () => {
    /**
     * **Validates: Requirements 6.2**
     * 
     * Property: For any state of the user store, the profile page favorites section 
     * SHALL display exactly the heroes whose IDs are in the `favorites` array of the store.
     */
    it('should display exactly the heroes whose IDs are in the favorites array', async () => {
      // Create an arbitrary for a subset of hero IDs
      const heroIdsArb = fc.uniqueArray(
        fc.constantFrom(...heroes.map(h => h.id)),
        { minLength: 0, maxLength: heroes.length }
      )
      
      await fc.assert(
        fc.asyncProperty(heroIdsArb, async (favoriteIds: number[]) => {
          // Reset pinia for each test run
          setActivePinia(createPinia())
          localStorage.clear()
          
          // Set up the store with the generated favorite IDs
          const userStore = useUserStore()
          favoriteIds.forEach(id => userStore.addFavorite(id))
          
          const { wrapper } = await mountProfileView()
          
          try {
            // Get displayed hero cards
            const heroCards = wrapper.findAllComponents({ name: 'HeroCard' })
            
            // Verify the count matches
            expect(heroCards.length).toBe(favoriteIds.length)
            
            // Verify each displayed hero is in the favorites
            const displayedHeroIds = heroCards.map(card => card.props('hero').id)
            
            // All displayed heroes should be in favorites
            displayedHeroIds.forEach(id => {
              expect(favoriteIds).toContain(id)
            })
            
            // All favorites should be displayed
            favoriteIds.forEach(id => {
              expect(displayedHeroIds).toContain(id)
            })
          } finally {
            wrapper.unmount()
          }
        }),
        { numRuns: 10 }
      )
    }, 30000)

    /**
     * **Validates: Requirements 6.2**
     * 
     * Unit test: Empty favorites should show empty state
     */
    it('should show empty state when no favorites', async () => {
      const { wrapper } = await mountProfileView()
      
      const emptyState = wrapper.find('.favorites-section__empty')
      expect(emptyState.exists()).toBe(true)
      
      const emptyTitle = wrapper.find('.empty-state__title')
      expect(emptyTitle.text()).toBe('暂无收藏英雄')
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.2**
     * 
     * Unit test: Should display correct count in header
     */
    it('should display correct favorite count in section header', async () => {
      const userStore = useUserStore()
      userStore.addFavorite(1)
      userStore.addFavorite(2)
      userStore.addFavorite(3)
      
      const { wrapper } = await mountProfileView()
      
      const countText = wrapper.find('.section-header__count')
      expect(countText.text()).toBe('3 位英雄')
      
      wrapper.unmount()
    })
  })

  describe('Requirement 6.3: Navigate to hero detail page', () => {
    /**
     * **Validates: Requirements 6.3**
     * 
     * Unit test: Clicking on a favorite hero should navigate to detail page
     */
    it('should navigate to hero detail page when clicking on a favorite hero', async () => {
      const userStore = useUserStore()
      userStore.addFavorite(1) // Add hero with ID 1
      
      const { wrapper, router } = await mountProfileView()
      
      // Find and click the hero card
      const heroCard = wrapper.findComponent({ name: 'HeroCard' })
      expect(heroCard.exists()).toBe(true)
      
      await heroCard.trigger('click')
      await flushPromises()
      
      // Verify navigation
      expect(router.currentRoute.value.name).toBe('hero-detail')
      expect(router.currentRoute.value.params.id).toBe('1')
      
      wrapper.unmount()
    })
  })

  describe('Requirement 6.4: Remove hero from favorites with toast', () => {
    /**
     * **Validates: Requirements 6.4**
     * 
     * Unit test: Removing a hero from favorites should update store and show toast
     */
    it('should remove hero from favorites and display success toast', async () => {
      const userStore = useUserStore()
      const heroToRemove = heroes[0]
      userStore.addFavorite(heroToRemove.id)
      
      expect(userStore.favorites).toContain(heroToRemove.id)
      
      const { wrapper } = await mountProfileView()
      
      // Find the hero card and trigger favorite toggle
      const heroCard = wrapper.findComponent({ name: 'HeroCard' })
      expect(heroCard.exists()).toBe(true)
      
      // Emit the favorite event
      await heroCard.vm.$emit('favorite', heroToRemove)
      await flushPromises()
      
      // Verify hero was removed from favorites
      expect(userStore.favorites).not.toContain(heroToRemove.id)
      
      // Verify success toast was shown
      expect(ElMessage.success).toHaveBeenCalledWith(`已将 ${heroToRemove.name} 从收藏移除`)
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.4**
     * 
     * Property test: Removing any favorite hero should update store and show toast
     */
    it('should correctly remove any favorite hero and show toast', async () => {
      const heroArb = fc.constantFrom(...heroes)
      
      await fc.assert(
        fc.asyncProperty(heroArb, async (hero) => {
          // Reset for each test
          setActivePinia(createPinia())
          localStorage.clear()
          vi.clearAllMocks()
          
          const userStore = useUserStore()
          userStore.addFavorite(hero.id)
          
          const { wrapper } = await mountProfileView()
          
          try {
            const heroCard = wrapper.findComponent({ name: 'HeroCard' })
            await heroCard.vm.$emit('favorite', hero)
            await flushPromises()
            
            // Verify removal
            expect(userStore.favorites).not.toContain(hero.id)
            
            // Verify toast
            expect(ElMessage.success).toHaveBeenCalledWith(`已将 ${hero.name} 从收藏移除`)
          } finally {
            wrapper.unmount()
          }
        }),
        { numRuns: 5 }
      )
    }, 30000)
  })

  describe('User Info Display (Requirement 6.1)', () => {
    /**
     * **Validates: Requirements 6.1**
     * 
     * Unit test: Should display user information and statistics
     */
    it('should display user information and statistics', async () => {
      const userStore = useUserStore()
      userStore.addFavorite(1)
      userStore.addFavorite(2)
      userStore.addHistory(3)
      
      const { wrapper } = await mountProfileView()
      
      // Verify username is displayed
      const userName = wrapper.find('.user-card__name')
      expect(userName.exists()).toBe(true)
      expect(userName.text()).toBe(userStore.username)
      
      // Verify favorite count
      const statValues = wrapper.findAll('.stat-item__value')
      expect(statValues.length).toBeGreaterThanOrEqual(2)
      expect(statValues[0].text()).toBe('2') // 2 favorites
      expect(statValues[1].text()).toBe('1') // 1 history item
      
      wrapper.unmount()
    })
  })

  describe('Feature: honor-of-kings-vue-app, Property 9: History Display Store Consistency', () => {
    /**
     * **Validates: Requirements 6.5**
     * 
     * Property: For any state of the user store, the profile page history section 
     * SHALL display heroes matching the `history` array, ordered by timestamp (most recent first).
     */
    it('should display heroes matching the history array ordered by timestamp', async () => {
      // Create an arbitrary for a subset of hero IDs
      const heroIdsArb = fc.uniqueArray(
        fc.constantFrom(...heroes.map(h => h.id)),
        { minLength: 1, maxLength: 5 }
      )
      
      await fc.assert(
        fc.asyncProperty(heroIdsArb, async (historyIds: number[]) => {
          // Reset pinia for each test run
          setActivePinia(createPinia())
          localStorage.clear()
          
          // Set up the store with the generated history IDs
          const userStore = useUserStore()
          
          // Add history items with small delays to ensure different timestamps
          for (const id of historyIds) {
            userStore.addHistory(id)
            // Advance time slightly to ensure different timestamps
            vi.advanceTimersByTime(100)
          }
          
          const { wrapper } = await mountProfileView()
          
          try {
            // Get displayed history items
            const historyItems = wrapper.findAll('.history-item')
            
            // Verify the count matches
            expect(historyItems.length).toBe(historyIds.length)
            
            // Verify order is most recent first (reverse of insertion order)
            const displayedNames = historyItems.map(item => 
              item.find('.history-item__name').text()
            )
            
            // The last added should be first in display
            const expectedOrder = [...historyIds].reverse().map(id => {
              const hero = heroes.find(h => h.id === id)
              return hero?.name
            })
            
            expect(displayedNames).toEqual(expectedOrder)
          } finally {
            wrapper.unmount()
          }
        }),
        { numRuns: 10 }
      )
    }, 30000)

    /**
     * **Validates: Requirements 6.5**
     * 
     * Unit test: Empty history should show empty state
     */
    it('should show empty state when no history', async () => {
      const { wrapper } = await mountProfileView()
      
      const emptyState = wrapper.find('.history-section__empty')
      expect(emptyState.exists()).toBe(true)
      
      const emptyTitles = wrapper.findAll('.empty-state__title')
      const emptyTitle = emptyTitles.length > 1 ? emptyTitles[1] : undefined // Second empty state (history)
      expect(emptyTitle?.text()).toBe('暂无浏览历史')
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.5**
     * 
     * Unit test: Should display correct count in header
     */
    it('should display correct history count in section header', async () => {
      const userStore = useUserStore()
      userStore.addHistory(1)
      userStore.addHistory(2)
      userStore.addHistory(3)
      
      const { wrapper } = await mountProfileView()
      
      const historySection = wrapper.find('.history-section')
      const countText = historySection.find('.section-header__count')
      expect(countText.text()).toBe('3 条记录')
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.5**
     * 
     * Unit test: Should display timestamps for history items
     */
    it('should display timestamps for history items', async () => {
      const userStore = useUserStore()
      userStore.addHistory(1)
      
      const { wrapper } = await mountProfileView()
      
      const timestampElement = wrapper.find('.history-item__timestamp')
      expect(timestampElement.exists()).toBe(true)
      // Should show "刚刚" since we just added it
      expect(timestampElement.text()).toBe('刚刚')
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.5**
     * 
     * Unit test: Clicking on a history item should navigate to hero detail page
     */
    it('should navigate to hero detail page when clicking on a history item', async () => {
      const userStore = useUserStore()
      userStore.addHistory(1) // Add hero with ID 1
      
      const { wrapper, router } = await mountProfileView()
      
      // Find and click the history item
      const historyItem = wrapper.find('.history-item')
      expect(historyItem.exists()).toBe(true)
      
      await historyItem.trigger('click')
      await flushPromises()
      
      // Verify navigation
      expect(router.currentRoute.value.name).toBe('hero-detail')
      expect(router.currentRoute.value.params.id).toBe('1')
      
      wrapper.unmount()
    })
  })

  describe('Feature: honor-of-kings-vue-app, Property 10: Clear History Idempotence', () => {
    /**
     * **Validates: Requirements 6.6**
     * 
     * Property: For any user store state, calling `clearHistory()` SHALL result in an empty history array.
     * Calling `clearHistory()` multiple times SHALL have the same effect as calling it once.
     */
    it('should clear all history items when clear button is clicked', async () => {
      const userStore = useUserStore()
      userStore.addHistory(1)
      userStore.addHistory(2)
      userStore.addHistory(3)
      
      expect(userStore.history.length).toBe(3)
      
      const { wrapper } = await mountProfileView()
      
      // Find and click the clear history button
      const clearButton = wrapper.find('.clear-history-btn')
      expect(clearButton.exists()).toBe(true)
      
      await clearButton.trigger('click')
      await flushPromises()
      
      // Verify history was cleared
      expect(userStore.history.length).toBe(0)
      
      // Verify confirmation toast was shown
      expect(ElMessage.success).toHaveBeenCalledWith('浏览历史已清除')
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.6**
     * 
     * Property test: Clearing history should result in empty array regardless of initial state
     */
    it('should result in empty history array for any initial state', async () => {
      const heroIdsArb = fc.uniqueArray(
        fc.constantFrom(...heroes.map(h => h.id)),
        { minLength: 1, maxLength: 10 }
      )
      
      await fc.assert(
        fc.asyncProperty(heroIdsArb, async (historyIds: number[]) => {
          // Reset for each test
          setActivePinia(createPinia())
          localStorage.clear()
          vi.clearAllMocks()
          
          const userStore = useUserStore()
          
          // Add history items
          historyIds.forEach(id => userStore.addHistory(id))
          expect(userStore.history.length).toBe(historyIds.length)
          
          const { wrapper } = await mountProfileView()
          
          try {
            const clearButton = wrapper.find('.clear-history-btn')
            await clearButton.trigger('click')
            await flushPromises()
            
            // Verify history is empty
            expect(userStore.history.length).toBe(0)
            
            // Verify toast was shown
            expect(ElMessage.success).toHaveBeenCalledWith('浏览历史已清除')
          } finally {
            wrapper.unmount()
          }
        }),
        { numRuns: 5 }
      )
    }, 30000)

    /**
     * **Validates: Requirements 6.6**
     * 
     * Unit test: Clear button should not be visible when history is empty
     */
    it('should not show clear button when history is empty', async () => {
      const { wrapper } = await mountProfileView()
      
      const clearButton = wrapper.find('.clear-history-btn')
      expect(clearButton.exists()).toBe(false)
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.6**
     * 
     * Unit test: Should show confirmation dialog before clearing
     */
    it('should show confirmation dialog before clearing history', async () => {
      const userStore = useUserStore()
      userStore.addHistory(1)
      
      const { wrapper } = await mountProfileView()
      
      const clearButton = wrapper.find('.clear-history-btn')
      await clearButton.trigger('click')
      await flushPromises()
      
      // Verify confirmation dialog was shown
      expect(ElMessageBox.confirm).toHaveBeenCalledWith(
        '确定要清除所有浏览历史吗？此操作不可恢复。',
        '清除浏览历史',
        expect.objectContaining({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      )
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 6.6**
     * 
     * Unit test: Should not clear history if user cancels confirmation
     */
    it('should not clear history if user cancels confirmation', async () => {
      // Mock the confirm to reject (user cancelled)
      vi.mocked(ElMessageBox.confirm).mockRejectedValueOnce('cancel')
      
      const userStore = useUserStore()
      userStore.addHistory(1)
      userStore.addHistory(2)
      
      const { wrapper } = await mountProfileView()
      
      const clearButton = wrapper.find('.clear-history-btn')
      await clearButton.trigger('click')
      await flushPromises()
      
      // Verify history was NOT cleared
      expect(userStore.history.length).toBe(2)
      
      // Verify success toast was NOT shown
      expect(ElMessage.success).not.toHaveBeenCalledWith('浏览历史已清除')
      
      wrapper.unmount()
    })
  })
})
