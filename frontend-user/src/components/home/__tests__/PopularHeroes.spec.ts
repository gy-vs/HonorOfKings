/**
 * PopularHeroes Unit Tests
 * Task 6.2: 实现 PopularHeroes 热门英雄区块
 * 
 * **Validates: Requirements 1.2, 1.3**
 * 
 * Tests for:
 * - Section title display
 * - Popular heroes display using HeroCard component
 * - Click event emission for navigation
 * - Responsive grid layout
 * - Computed property for hero filtering
 */
import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PopularHeroes from '../PopularHeroes.vue'
import HeroCard from '@/components/common/HeroCard.vue'
import type { Hero } from '@/types'

// Mock the heroes data module
vi.mock('@/data/heroes', () => ({
  popularHeroes: [
    {
      id: 1,
      name: '亚瑟',
      title: '永恒之誓',
      avatar: '/images/heroes/arthur.jpg',
      role: 'warrior',
      difficulty: 1,
      skills: [],
      skins: [],
      story: '亚瑟是古代王国的守护骑士'
    },
    {
      id: 2,
      name: '妲己',
      title: '魅惑之狐',
      avatar: '/images/heroes/daji.jpg',
      role: 'mage',
      difficulty: 1,
      skills: [],
      skins: [],
      story: '妲己是一只修炼千年的九尾狐'
    },
    {
      id: 3,
      name: '李白',
      title: '青莲剑仙',
      avatar: '/images/heroes/libai.jpg',
      role: 'assassin',
      difficulty: 3,
      skills: [],
      skins: [],
      story: '李白是一位传奇的剑客诗人'
    },
    {
      id: 4,
      name: '后羿',
      title: '射日神弓',
      avatar: '/images/heroes/houyi.jpg',
      role: 'marksman',
      difficulty: 1,
      skills: [],
      skins: [],
      story: '后羿是上古时代的神射手'
    },
    {
      id: 5,
      name: '蔡文姬',
      title: '乱世才女',
      avatar: '/images/heroes/caiwenji.jpg',
      role: 'support',
      difficulty: 2,
      skills: [],
      skins: [],
      story: '蔡文姬是东汉末年的才女'
    },
    {
      id: 6,
      name: '项羽',
      title: '霸王',
      avatar: '/images/heroes/xiangyu.jpg',
      role: 'tank',
      difficulty: 2,
      skills: [],
      skins: [],
      story: '项羽是秦末的霸王'
    },
    {
      id: 7,
      name: '貂蝉',
      title: '绝世舞姬',
      avatar: '/images/heroes/diaochan.jpg',
      role: 'mage',
      difficulty: 2,
      skills: [],
      skins: [],
      story: '貂蝉是东汉末年的绝世美人'
    },
    {
      id: 8,
      name: '韩信',
      title: '国士无双',
      avatar: '/images/heroes/hanxin.jpg',
      role: 'assassin',
      difficulty: 3,
      skills: [],
      skins: [],
      story: '韩信是西汉开国功臣'
    }
  ]
}))

/**
 * Mount PopularHeroes with default configuration
 */
function mountPopularHeroes(props: Partial<{
  maxHeroes: number
}> = {}): VueWrapper {
  return mount(PopularHeroes, {
    props,
    global: {
      stubs: {
        'el-icon': true
      }
    }
  })
}

describe('PopularHeroes Component', () => {
  describe('Section Display', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Section title "热门英雄" is displayed
     */
    it('should display section title "热门英雄"', () => {
      const wrapper = mountPopularHeroes()
      
      const title = wrapper.find('.popular-heroes__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('热门英雄')
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Section subtitle is displayed
     */
    it('should display section subtitle', () => {
      const wrapper = mountPopularHeroes()
      
      const subtitle = wrapper.find('.popular-heroes__subtitle')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('最受玩家喜爱的英雄')
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Section has proper accessibility attributes
     */
    it('should have proper accessibility attributes', () => {
      const wrapper = mountPopularHeroes()
      
      const section = wrapper.find('.popular-heroes')
      expect(section.attributes('aria-labelledby')).toBe('popular-heroes-title')
      
      const title = wrapper.find('#popular-heroes-title')
      expect(title.exists()).toBe(true)
    })
  })

  describe('Heroes Display', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Default displays 6 heroes
     */
    it('should display 6 heroes by default', () => {
      const wrapper = mountPopularHeroes()
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      expect(heroCards.length).toBe(6)
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Respects maxHeroes prop
     */
    it('should respect maxHeroes prop', () => {
      const wrapper = mountPopularHeroes({ maxHeroes: 4 })
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      expect(heroCards.length).toBe(4)
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Displays correct heroes from popularHeroes data
     */
    it('should display heroes from popularHeroes data', () => {
      const wrapper = mountPopularHeroes({ maxHeroes: 3 })
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      
      // Check first hero
      expect(heroCards[0].props('hero').name).toBe('亚瑟')
      expect(heroCards[0].props('hero').id).toBe(1)
      
      // Check second hero
      expect(heroCards[1].props('hero').name).toBe('妲己')
      expect(heroCards[1].props('hero').id).toBe(2)
      
      // Check third hero
      expect(heroCards[2].props('hero').name).toBe('李白')
      expect(heroCards[2].props('hero').id).toBe(3)
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Uses HeroCard component for each hero
     */
    it('should use HeroCard component for each hero', () => {
      const wrapper = mountPopularHeroes()
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      expect(heroCards.length).toBeGreaterThan(0)
      
      // Each HeroCard should receive a hero prop
      heroCards.forEach(card => {
        expect(card.props('hero')).toBeDefined()
        expect(card.props('hero').id).toBeDefined()
        expect(card.props('hero').name).toBeDefined()
      })
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Heroes grid container exists
     */
    it('should have heroes grid container', () => {
      const wrapper = mountPopularHeroes()
      
      const grid = wrapper.find('.popular-heroes__grid')
      expect(grid.exists()).toBe(true)
    })
  })

  describe('Click Event Emission', () => {
    /**
     * **Validates: Requirements 1.3**
     * 
     * Test: Emits hero-click event when HeroCard is clicked
     */
    it('should emit hero-click event when a hero card is clicked', async () => {
      const wrapper = mountPopularHeroes()
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      const firstCard = heroCards[0]
      
      // Simulate click on HeroCard
      await firstCard.vm.$emit('click', firstCard.props('hero'))
      
      expect(wrapper.emitted('hero-click')).toBeTruthy()
      expect(wrapper.emitted('hero-click')![0]).toEqual([firstCard.props('hero')])
    })

    /**
     * **Validates: Requirements 1.3**
     * 
     * Test: Emitted hero has correct ID for navigation
     */
    it('should emit hero with correct ID for navigation', async () => {
      const wrapper = mountPopularHeroes()
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      const secondCard = heroCards[1]
      
      await secondCard.vm.$emit('click', secondCard.props('hero'))
      
      const emittedHero = wrapper.emitted('hero-click')![0][0] as Hero
      expect(emittedHero.id).toBe(2)
      expect(emittedHero.name).toBe('妲己')
    })

    /**
     * **Validates: Requirements 1.3**
     * 
     * Test: Each hero card click emits the correct hero
     */
    it('should emit correct hero for each card click', async () => {
      const wrapper = mountPopularHeroes({ maxHeroes: 3 })
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      
      // Click each card and verify emitted hero
      for (let i = 0; i < heroCards.length; i++) {
        const card = heroCards[i]
        const hero = card.props('hero')
        
        await card.vm.$emit('click', hero)
        
        const emittedEvents = wrapper.emitted('hero-click')!
        const lastEmittedHero = emittedEvents[emittedEvents.length - 1][0] as Hero
        
        expect(lastEmittedHero.id).toBe(hero.id)
        expect(lastEmittedHero.name).toBe(hero.name)
      }
    })
  })

  describe('Computed Property', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: displayedHeroes computed property limits heroes correctly
     */
    it('should limit displayed heroes based on maxHeroes prop', () => {
      // Test with different maxHeroes values
      const testCases = [
        { maxHeroes: 2, expected: 2 },
        { maxHeroes: 4, expected: 4 },
        { maxHeroes: 6, expected: 6 },
        { maxHeroes: 10, expected: 8 } // Only 8 heroes in mock data
      ]
      
      testCases.forEach(({ maxHeroes, expected }) => {
        const wrapper = mountPopularHeroes({ maxHeroes })
        const heroCards = wrapper.findAllComponents(HeroCard)
        expect(heroCards.length).toBe(expected)
        wrapper.unmount()
      })
    })
  })

  describe('CSS Structure', () => {
    /**
     * **Validates: Requirements 1.2, 8.1**
     * 
     * Test: Component has correct CSS class structure
     */
    it('should have correct CSS class structure', () => {
      const wrapper = mountPopularHeroes()
      
      expect(wrapper.find('.popular-heroes').exists()).toBe(true)
      expect(wrapper.find('.popular-heroes__header').exists()).toBe(true)
      expect(wrapper.find('.popular-heroes__title').exists()).toBe(true)
      expect(wrapper.find('.popular-heroes__subtitle').exists()).toBe(true)
      expect(wrapper.find('.popular-heroes__grid').exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Hero cards have the correct class
     */
    it('should apply popular-heroes__card class to hero cards', () => {
      const wrapper = mountPopularHeroes()
      
      const cards = wrapper.findAll('.popular-heroes__card')
      expect(cards.length).toBe(6)
    })
  })

  describe('Edge Cases', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Handles maxHeroes of 0
     */
    it('should display no heroes when maxHeroes is 0', () => {
      const wrapper = mountPopularHeroes({ maxHeroes: 0 })
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      expect(heroCards.length).toBe(0)
    })

    /**
     * **Validates: Requirements 1.2**
     * 
     * Test: Handles maxHeroes of 1
     */
    it('should display single hero when maxHeroes is 1', () => {
      const wrapper = mountPopularHeroes({ maxHeroes: 1 })
      
      const heroCards = wrapper.findAllComponents(HeroCard)
      expect(heroCards.length).toBe(1)
      expect(heroCards[0].props('hero').name).toBe('亚瑟')
    })
  })
})
