/**
 * HeroDetailView Property-Based Tests
 * 
 * Task 8.2: 编写路由参数映射属性测试
 * Feature: honor-of-kings-vue-app, Property 4: Hero Detail Route Parameter Mapping
 * 
 * **Validates: Requirements 3.1, 3.2**
 * 
 * Property Description:
 * For any valid hero ID in the route parameter, the hero detail page SHALL display 
 * the hero whose `id` matches the route parameter. The displayed data SHALL include 
 * name, role, difficulty, skills array, and skins array.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as fc from 'fast-check'
import HeroDetailView from '../HeroDetailView.vue'
import { heroes } from '@/data/heroes'
import type { Hero } from '@/types'

// Mock Element Plus message
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}))

// Role mapping for display
const roleMap: Record<string, string> = {
  warrior: '战士',
  mage: '法师',
  assassin: '刺客',
  marksman: '射手',
  support: '辅助',
  tank: '坦克'
}

/**
 * Helper function to mount HeroDetailView with a specific hero ID
 */
async function mountWithHeroId(heroId: number) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/heroes/:id', name: 'hero-detail', component: HeroDetailView },
      { path: '/heroes', name: 'heroes', component: { template: '<div/>' } }
    ]
  })
  
  await router.push(`/heroes/${heroId}`)
  await router.isReady()
  
  const wrapper = mount(HeroDetailView, {
    global: {
      plugins: [createPinia(), router],
      stubs: { Transition: false }
    }
  })
  
  // Wait for simulated async loading (300ms in component + buffer)
  vi.advanceTimersByTime(350)
  await flushPromises()
  
  return { wrapper, router }
}

describe('HeroDetailView Property-Based Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Feature: honor-of-kings-vue-app, Property 4: Hero Detail Route Parameter Mapping', () => {
    /**
     * **Validates: Requirements 3.1, 3.2**
     * 
     * Property: For any valid hero ID in the route parameter, the hero detail page 
     * SHALL display the hero whose `id` matches the route parameter. The displayed 
     * data SHALL include name, role, difficulty, skills array, and skins array.
     */
    it('should display correct hero data for any valid hero ID', async () => {
      // Create an arbitrary that selects from all valid heroes
      const heroArb = fc.constantFrom(...heroes)
      
      await fc.assert(
        fc.asyncProperty(heroArb, async (hero: Hero) => {
          const { wrapper, router } = await mountWithHeroId(hero.id)
          
          try {
            // 1. Verify route parameter matches hero ID
            expect(router.currentRoute.value.params.id).toBe(String(hero.id))
            
            // 2. Verify hero name is displayed correctly
            const heroName = wrapper.find('.hero-name')
            expect(heroName.exists()).toBe(true)
            expect(heroName.text()).toBe(hero.name)
            
            // 3. Verify hero role is displayed correctly
            const roleBadge = wrapper.find('.hero-role-badge')
            expect(roleBadge.exists()).toBe(true)
            expect(roleBadge.text()).toBe(roleMap[hero.role])
            
            // 4. Verify hero difficulty is displayed correctly
            const expectedStars = '★'.repeat(hero.difficulty) + '☆'.repeat(3 - hero.difficulty)
            const difficultyValue = wrapper.find('.meta-value.difficulty')
            expect(difficultyValue.exists()).toBe(true)
            expect(difficultyValue.text()).toBe(expectedStars)
            
            // 5. Verify skills array is displayed (count matches)
            const skillButtons = wrapper.findAll('.skill-icon-btn')
            expect(skillButtons.length).toBe(hero.skills.length)
            
            // 6. Verify skins array is displayed (count matches)
            const skinCards = wrapper.findAll('.skin-card')
            expect(skinCards.length).toBe(hero.skins.length)
          } finally {
            wrapper.unmount()
          }
        }),
        { numRuns: 5 } // Run 5 times to cover different heroes
      )
    }, 30000) // 30 second timeout for property test
  })
})
