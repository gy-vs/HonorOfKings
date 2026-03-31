/**
 * HeroCard Unit Tests
 * Task 3.3: 实现 HeroCard 组件
 * 
 * **Validates: Requirements 1.3, 2.4, 8.4**
 * 
 * Tests for:
 * - Hero data display (avatar, name, title, role, difficulty)
 * - Click event emission
 * - Favorite event emission
 * - Slot functionality
 * - Hover effects
 */
import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HeroCard from '../HeroCard.vue'
import type { Hero } from '@/types'

// Mock hero data for testing
const createMockHero = (overrides: Partial<Hero> = {}): Hero => ({
  id: 1,
  name: '亚瑟',
  title: '永恒之王',
  avatar: '/images/heroes/arthur.jpg',
  role: 'warrior',
  difficulty: 2,
  skills: [],
  skins: [],
  story: '亚瑟是一位勇敢的战士',
  ...overrides
})

/**
 * Mount HeroCard with default configuration
 */
function mountHeroCard(props: Partial<{
  hero: Hero
  showFavorite: boolean
  isFavorite: boolean
}> = {}, slots: Record<string, string> = {}): VueWrapper {
  return mount(HeroCard, {
    props: {
      hero: createMockHero(),
      ...props
    },
    slots,
    global: {
      stubs: {
        'el-icon': true
      }
    }
  })
}

describe('HeroCard Component', () => {
  describe('Hero Data Display', () => {
    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Hero avatar is displayed correctly
     */
    it('should display hero avatar with correct src and alt', () => {
      const hero = createMockHero({ avatar: '/test-avatar.jpg', name: '测试英雄' })
      const wrapper = mountHeroCard({ hero })
      
      const avatar = wrapper.find('.hero-card__avatar')
      expect(avatar.exists()).toBe(true)
      expect(avatar.attributes('src')).toBe('/test-avatar.jpg')
      expect(avatar.attributes('alt')).toBe('测试英雄')
    })

    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Hero name is displayed correctly
     */
    it('should display hero name', () => {
      const hero = createMockHero({ name: '李白' })
      const wrapper = mountHeroCard({ hero })
      
      const name = wrapper.find('.hero-card__name')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe('李白')
    })

    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Hero title is displayed correctly
     */
    it('should display hero title', () => {
      const hero = createMockHero({ title: '青莲剑仙' })
      const wrapper = mountHeroCard({ hero })
      
      const title = wrapper.find('.hero-card__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('青莲剑仙')
    })

    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Hero role badge is displayed with correct Chinese text
     */
    it('should display hero role badge with Chinese text', () => {
      const roleTests: Array<{ role: Hero['role']; expected: string }> = [
        { role: 'warrior', expected: '战士' },
        { role: 'mage', expected: '法师' },
        { role: 'assassin', expected: '刺客' },
        { role: 'marksman', expected: '射手' },
        { role: 'support', expected: '辅助' },
        { role: 'tank', expected: '坦克' }
      ]

      roleTests.forEach(({ role, expected }) => {
        const hero = createMockHero({ role })
        const wrapper = mountHeroCard({ hero })
        
        const roleBadge = wrapper.find('.hero-card__role-badge')
        expect(roleBadge.exists()).toBe(true)
        expect(roleBadge.text()).toBe(expected)
        
        wrapper.unmount()
      })
    })

    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Difficulty indicator shows correct number of filled stars
     */
    it('should display correct difficulty stars', () => {
      const difficultyTests: Array<{ difficulty: 1 | 2 | 3; filledCount: number }> = [
        { difficulty: 1, filledCount: 1 },
        { difficulty: 2, filledCount: 2 },
        { difficulty: 3, filledCount: 3 }
      ]

      difficultyTests.forEach(({ difficulty, filledCount }) => {
        const hero = createMockHero({ difficulty })
        const wrapper = mountHeroCard({ hero })
        
        const stars = wrapper.findAll('.hero-card__star')
        expect(stars.length).toBe(3)
        
        const filledStars = wrapper.findAll('.hero-card__star.is-filled')
        expect(filledStars.length).toBe(filledCount)
        
        wrapper.unmount()
      })
    })
  })

  describe('Click Event Emission', () => {
    /**
     * **Validates: Requirements 1.3, 2.4**
     * Property 1: Hero Card Navigation Consistency
     * 
     * Test: Clicking card emits 'click' event with hero data
     */
    it('should emit click event with hero data when card is clicked', async () => {
      const hero = createMockHero({ id: 42, name: '韩信' })
      const wrapper = mountHeroCard({ hero })
      
      await wrapper.find('.hero-card').trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual([hero])
    })

    /**
     * **Validates: Requirements 1.3, 2.4**
     * 
     * Test: Pressing Enter on card emits 'click' event (keyboard accessibility)
     */
    it('should emit click event when Enter key is pressed', async () => {
      const hero = createMockHero({ id: 10 })
      const wrapper = mountHeroCard({ hero })
      
      await wrapper.find('.hero-card').trigger('keydown.enter')
      
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual([hero])
    })
  })

  describe('Favorite Button', () => {
    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Favorite button is hidden by default
     */
    it('should not show favorite button when showFavorite is false', () => {
      const wrapper = mountHeroCard({ showFavorite: false })
      
      const favoriteBtn = wrapper.find('.hero-card__favorite-btn')
      expect(favoriteBtn.exists()).toBe(false)
    })

    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Favorite button is shown when showFavorite is true
     */
    it('should show favorite button when showFavorite is true', () => {
      const wrapper = mountHeroCard({ showFavorite: true })
      
      const favoriteBtn = wrapper.find('.hero-card__favorite-btn')
      expect(favoriteBtn.exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 3.5**
     * Property 5: Favorite Toggle Round-Trip
     * 
     * Test: Clicking favorite button emits 'favorite' event with hero data
     */
    it('should emit favorite event when favorite button is clicked', async () => {
      const hero = createMockHero({ id: 5 })
      const wrapper = mountHeroCard({ hero, showFavorite: true })
      
      await wrapper.find('.hero-card__favorite-btn').trigger('click')
      
      expect(wrapper.emitted('favorite')).toBeTruthy()
      expect(wrapper.emitted('favorite')![0]).toEqual([hero])
    })

    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Clicking favorite button does not trigger card click
     */
    it('should not emit click event when favorite button is clicked', async () => {
      const wrapper = mountHeroCard({ showFavorite: true })
      
      await wrapper.find('.hero-card__favorite-btn').trigger('click')
      
      expect(wrapper.emitted('favorite')).toBeTruthy()
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Favorite button shows correct state based on isFavorite prop
     */
    it('should apply is-favorite class when isFavorite is true', () => {
      const wrapper = mountHeroCard({ showFavorite: true, isFavorite: true })
      
      const favoriteBtn = wrapper.find('.hero-card__favorite-btn')
      expect(favoriteBtn.classes()).toContain('is-favorite')
    })

    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Favorite button does not have is-favorite class when isFavorite is false
     */
    it('should not apply is-favorite class when isFavorite is false', () => {
      const wrapper = mountHeroCard({ showFavorite: true, isFavorite: false })
      
      const favoriteBtn = wrapper.find('.hero-card__favorite-btn')
      expect(favoriteBtn.classes()).not.toContain('is-favorite')
    })

    /**
     * **Validates: Requirements 3.5**
     * 
     * Test: Favorite button has correct aria-label based on state
     */
    it('should have correct aria-label based on favorite state', () => {
      const wrapperNotFavorite = mountHeroCard({ showFavorite: true, isFavorite: false })
      expect(wrapperNotFavorite.find('.hero-card__favorite-btn').attributes('aria-label')).toBe('添加收藏')
      wrapperNotFavorite.unmount()

      const wrapperFavorite = mountHeroCard({ showFavorite: true, isFavorite: true })
      expect(wrapperFavorite.find('.hero-card__favorite-btn').attributes('aria-label')).toBe('取消收藏')
      wrapperFavorite.unmount()
    })
  })

  describe('Slots', () => {
    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Header slot renders custom content
     */
    it('should render header slot content', () => {
      const wrapper = mountHeroCard({}, {
        header: '<div class="custom-header">Custom Header</div>'
      })
      
      const headerSlot = wrapper.find('.hero-card__header-slot')
      expect(headerSlot.exists()).toBe(true)
      expect(headerSlot.find('.custom-header').exists()).toBe(true)
      expect(headerSlot.text()).toContain('Custom Header')
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Default slot renders custom content at bottom
     */
    it('should render default slot content at bottom', () => {
      const wrapper = mountHeroCard({}, {
        default: '<div class="custom-footer">Custom Footer</div>'
      })
      
      const footerSlot = wrapper.find('.hero-card__footer-slot')
      expect(footerSlot.exists()).toBe(true)
      expect(footerSlot.find('.custom-footer').exists()).toBe(true)
      expect(footerSlot.text()).toContain('Custom Footer')
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Header slot is not rendered when not provided
     */
    it('should not render header slot wrapper when slot is not provided', () => {
      const wrapper = mountHeroCard()
      
      const headerSlot = wrapper.find('.hero-card__header-slot')
      expect(headerSlot.exists()).toBe(false)
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Default slot is not rendered when not provided
     */
    it('should not render footer slot wrapper when slot is not provided', () => {
      const wrapper = mountHeroCard()
      
      const footerSlot = wrapper.find('.hero-card__footer-slot')
      expect(footerSlot.exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Card has correct role and tabindex for keyboard navigation
     */
    it('should have correct accessibility attributes', () => {
      const wrapper = mountHeroCard()
      
      const card = wrapper.find('.hero-card')
      expect(card.attributes('role')).toBe('button')
      expect(card.attributes('tabindex')).toBe('0')
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Difficulty indicator has aria-label
     */
    it('should have aria-label on difficulty indicator', () => {
      const hero = createMockHero({ difficulty: 2 })
      const wrapper = mountHeroCard({ hero })
      
      const difficulty = wrapper.find('.hero-card__difficulty')
      expect(difficulty.attributes('aria-label')).toBe('难度: 2星')
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Avatar has lazy loading attribute
     */
    it('should have lazy loading on avatar image', () => {
      const wrapper = mountHeroCard()
      
      const avatar = wrapper.find('.hero-card__avatar')
      expect(avatar.attributes('loading')).toBe('lazy')
    })
  })

  describe('CSS Classes and Styling', () => {
    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: Card has correct base class
     */
    it('should have hero-card class', () => {
      const wrapper = mountHeroCard()
      
      expect(wrapper.find('.hero-card').exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 8.4**
     * 
     * Test: All required structural elements exist
     */
    it('should have all required structural elements', () => {
      const wrapper = mountHeroCard()
      
      expect(wrapper.find('.hero-card__avatar-wrapper').exists()).toBe(true)
      expect(wrapper.find('.hero-card__avatar').exists()).toBe(true)
      expect(wrapper.find('.hero-card__role-badge').exists()).toBe(true)
      expect(wrapper.find('.hero-card__info').exists()).toBe(true)
      expect(wrapper.find('.hero-card__name').exists()).toBe(true)
      expect(wrapper.find('.hero-card__title').exists()).toBe(true)
      expect(wrapper.find('.hero-card__difficulty').exists()).toBe(true)
      expect(wrapper.find('.hero-card__difficulty-stars').exists()).toBe(true)
    })
  })
})


/**
 * HeroCard Property-Based Tests
 * Task 3.4: 编写 HeroCard 属性测试
 * 
 * **Validates: Requirements 1.3, 2.4, 6.3**
 * 
 * Property 1: Hero Card Navigation Consistency
 * "For any hero card component in the application (on homepage, hero list, or profile page), 
 * clicking the card SHALL navigate to /heroes/{heroId} where heroId matches the hero's ID."
 */
import * as fc from 'fast-check'

/**
 * Arbitrary for generating valid Hero IDs
 * Hero IDs are positive integers
 */
const heroIdArbitrary = fc.integer({ min: 1, max: 99999 })

/**
 * Arbitrary for generating valid Hero roles
 */
const heroRoleArbitrary = fc.constantFrom<Hero['role']>(
  'warrior', 'mage', 'assassin', 'marksman', 'support', 'tank'
)

/**
 * Arbitrary for generating valid difficulty levels
 */
const difficultyArbitrary = fc.constantFrom<1 | 2 | 3>(1, 2, 3)

/**
 * Arbitrary for generating valid hero names (Chinese characters)
 */
const heroNameArbitrary = fc.constantFrom(
  '亚瑟', '李白', '韩信', '貂蝉', '妲己', '鲁班七号',
  '后羿', '孙悟空', '赵云', '诸葛亮', '王昭君', '甄姬',
  '吕布', '关羽', '张飞', '刘备', '曹操', '孙尚香'
)

/**
 * Arbitrary for generating valid hero titles
 */
const heroTitleArbitrary = fc.constantFrom(
  '永恒之王', '青莲剑仙', '国士无双', '乱世舞姬', '灵狐仙子',
  '机关造物', '黄金射手', '齐天大圣', '常山赵子龙', '卧龙先生'
)

/**
 * Arbitrary for generating a complete Hero object
 */
const heroArbitrary: fc.Arbitrary<Hero> = fc.record({
  id: heroIdArbitrary,
  name: heroNameArbitrary,
  title: heroTitleArbitrary,
  avatar: fc.constant('/images/heroes/default.jpg'),
  role: heroRoleArbitrary,
  difficulty: difficultyArbitrary,
  skills: fc.constant([]),
  skins: fc.constant([]),
  story: fc.constant('英雄故事')
})

describe('HeroCard Property-Based Tests', () => {
  describe('Property 1: Hero Card Navigation Consistency', () => {
    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: For any hero with any valid ID, clicking the card emits 'click' event 
     * with the hero object containing the correct ID that can be used for navigation.
     */
    it('should emit click event with hero object for any valid hero ID', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroArbitrary,
          async (hero: Hero) => {
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            // Click the card
            await wrapper.find('.hero-card').trigger('click')
            
            // Property: Click event should be emitted
            expect(wrapper.emitted('click')).toBeTruthy()
            
            // Property: Emitted event should contain the hero object
            const emittedEvents = wrapper.emitted('click')!
            expect(emittedEvents.length).toBe(1)
            
            // Property: The emitted hero object should have the correct ID
            const emittedHero = emittedEvents[0][0] as Hero
            expect(emittedHero.id).toBe(hero.id)
            
            // Property: The emitted hero object should be the same as the input hero
            expect(emittedHero).toEqual(hero)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: The emitted hero ID can be used to construct the navigation path /heroes/{heroId}
     */
    it('should emit hero with ID that can construct valid navigation path', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroIdArbitrary,
          async (heroId: number) => {
            const hero = createMockHero({ id: heroId })
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            await wrapper.find('.hero-card').trigger('click')
            
            const emittedHero = wrapper.emitted('click')![0][0] as Hero
            
            // Property: The navigation path can be constructed from the emitted hero ID
            const navigationPath = `/heroes/${emittedHero.id}`
            expect(navigationPath).toBe(`/heroes/${heroId}`)
            
            // Property: The path should be a valid URL path
            expect(navigationPath).toMatch(/^\/heroes\/\d+$/)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: Click event is consistently emitted for heroes with various IDs (1, 100, 999, etc.)
     */
    it('should consistently emit click event for heroes with various IDs', async () => {
      // Test specific ID ranges: small, medium, large
      const specificIdArbitrary = fc.oneof(
        fc.integer({ min: 1, max: 10 }),      // Small IDs
        fc.integer({ min: 100, max: 200 }),   // Medium IDs
        fc.integer({ min: 900, max: 999 }),   // Large IDs
        fc.constant(1),                        // Edge case: minimum ID
        fc.constant(99999)                     // Edge case: large ID
      )

      await fc.assert(
        fc.asyncProperty(
          specificIdArbitrary,
          async (heroId: number) => {
            const hero = createMockHero({ id: heroId })
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            await wrapper.find('.hero-card').trigger('click')
            
            // Property: Click event is always emitted regardless of ID value
            expect(wrapper.emitted('click')).toBeTruthy()
            
            // Property: Emitted hero ID always matches input ID
            const emittedHero = wrapper.emitted('click')![0][0] as Hero
            expect(emittedHero.id).toBe(heroId)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: Keyboard navigation (Enter key) also emits click event with correct hero
     */
    it('should emit click event with correct hero on keyboard Enter for any hero', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroArbitrary,
          async (hero: Hero) => {
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            // Trigger Enter key press
            await wrapper.find('.hero-card').trigger('keydown.enter')
            
            // Property: Click event should be emitted on Enter key
            expect(wrapper.emitted('click')).toBeTruthy()
            
            // Property: Emitted hero should match input hero
            const emittedHero = wrapper.emitted('click')![0][0] as Hero
            expect(emittedHero.id).toBe(hero.id)
            expect(emittedHero).toEqual(hero)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: Multiple clicks on the same card emit multiple events with consistent hero data
     */
    it('should emit consistent hero data on multiple clicks', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroArbitrary,
          fc.integer({ min: 1, max: 5 }),
          async (hero: Hero, clickCount: number) => {
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            // Click multiple times
            for (let i = 0; i < clickCount; i++) {
              await wrapper.find('.hero-card').trigger('click')
            }
            
            // Property: Number of emitted events should match click count
            const emittedEvents = wrapper.emitted('click')!
            expect(emittedEvents.length).toBe(clickCount)
            
            // Property: All emitted events should contain the same hero data
            for (const event of emittedEvents) {
              const emittedHero = event[0] as Hero
              expect(emittedHero.id).toBe(hero.id)
              expect(emittedHero).toEqual(hero)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: Hero card displays correct hero and emits correct hero regardless of role
     */
    it('should emit correct hero for any hero role', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroRoleArbitrary,
          heroIdArbitrary,
          async (role: Hero['role'], heroId: number) => {
            const hero = createMockHero({ id: heroId, role })
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            await wrapper.find('.hero-card').trigger('click')
            
            // Property: Click event emits hero with correct ID regardless of role
            const emittedHero = wrapper.emitted('click')![0][0] as Hero
            expect(emittedHero.id).toBe(heroId)
            expect(emittedHero.role).toBe(role)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 1.3, 2.4, 6.3**
     * 
     * Property: Hero card emits correct hero regardless of difficulty level
     */
    it('should emit correct hero for any difficulty level', async () => {
      await fc.assert(
        fc.asyncProperty(
          difficultyArbitrary,
          heroIdArbitrary,
          async (difficulty: 1 | 2 | 3, heroId: number) => {
            const hero = createMockHero({ id: heroId, difficulty })
            const wrapper = mount(HeroCard, {
              props: { hero },
              global: {
                stubs: {
                  'el-icon': true
                }
              }
            })
            
            await wrapper.find('.hero-card').trigger('click')
            
            // Property: Click event emits hero with correct ID regardless of difficulty
            const emittedHero = wrapper.emitted('click')![0][0] as Hero
            expect(emittedHero.id).toBe(heroId)
            expect(emittedHero.difficulty).toBe(difficulty)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
