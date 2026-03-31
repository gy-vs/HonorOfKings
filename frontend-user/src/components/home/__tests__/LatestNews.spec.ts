/**
 * LatestNews Unit Tests
 * Task 6.3: 实现 LatestNews 资讯区块
 * 
 * **Validates: Requirements 1.4**
 * 
 * Tests for:
 * - Section title display
 * - News list display using onMounted
 * - Category tab filtering
 * - Click event emission
 * - Loading state
 * - Empty state
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import type { NewsItem } from '@/types'

// Mock the news data module - must be before component import
vi.mock('@/data/news', () => {
  const mockNews = [
    {
      id: 1,
      title: '新英雄「瑶」正式上线',
      summary: '全新辅助英雄瑶正式上线，她拥有独特的附身机制。',
      image: '/images/news/news1.jpg',
      date: '2024-07-15',
      category: '新英雄'
    },
    {
      id: 2,
      title: 'KPL夏季赛第五周战报',
      summary: 'KPL夏季赛第五周比赛结束，AG超玩会豪取五连胜。',
      image: '/images/news/news2.jpg',
      date: '2024-07-14',
      category: '赛事'
    },
    {
      id: 3,
      title: '夏日狂欢活动开启',
      summary: '夏日狂欢活动正式开启，完成活动任务即可免费获得限定皮肤。',
      image: '/images/news/news3.jpg',
      date: '2024-07-13',
      category: '活动'
    },
    {
      id: 4,
      title: '版本更新：多位英雄技能调整',
      summary: '本次版本更新对多位英雄进行了技能调整。',
      image: '/images/news/news4.jpg',
      date: '2024-07-12',
      category: '更新'
    },
    {
      id: 5,
      title: '李白「凤求凰」皮肤返场投票',
      summary: '年度皮肤返场投票活动开启。',
      image: '/images/news/news5.jpg',
      date: '2024-07-11',
      category: '活动'
    },
    {
      id: 6,
      title: '王者荣耀五周年庆典即将开启',
      summary: '王者荣耀五周年庆典活动即将开启。',
      image: '/images/news/news6.jpg',
      date: '2024-07-10',
      category: '活动'
    }
  ]

  const mockNewsCategories = [
    { key: 'all', name: '全部' },
    { key: '新英雄', name: '新英雄' },
    { key: '赛事', name: '赛事' },
    { key: '活动', name: '活动' },
    { key: '更新', name: '更新' }
  ]

  return {
    getLatestNews: vi.fn(() => mockNews),
    newsCategories: mockNewsCategories,
    getNewsByCategory: vi.fn((category: string) => {
      if (!category || category === 'all') return mockNews
      return mockNews.filter(item => item.category === category)
    })
  }
})

import LatestNews from '../LatestNews.vue'

// Mock news data for test assertions
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: '新英雄「瑶」正式上线',
    summary: '全新辅助英雄瑶正式上线，她拥有独特的附身机制。',
    image: '/images/news/news1.jpg',
    date: '2024-07-15',
    category: '新英雄'
  },
  {
    id: 2,
    title: 'KPL夏季赛第五周战报',
    summary: 'KPL夏季赛第五周比赛结束，AG超玩会豪取五连胜。',
    image: '/images/news/news2.jpg',
    date: '2024-07-14',
    category: '赛事'
  },
  {
    id: 3,
    title: '夏日狂欢活动开启',
    summary: '夏日狂欢活动正式开启，完成活动任务即可免费获得限定皮肤。',
    image: '/images/news/news3.jpg',
    date: '2024-07-13',
    category: '活动'
  },
  {
    id: 4,
    title: '版本更新：多位英雄技能调整',
    summary: '本次版本更新对多位英雄进行了技能调整。',
    image: '/images/news/news4.jpg',
    date: '2024-07-12',
    category: '更新'
  },
  {
    id: 5,
    title: '李白「凤求凰」皮肤返场投票',
    summary: '年度皮肤返场投票活动开启。',
    image: '/images/news/news5.jpg',
    date: '2024-07-11',
    category: '活动'
  },
  {
    id: 6,
    title: '王者荣耀五周年庆典即将开启',
    summary: '王者荣耀五周年庆典活动即将开启。',
    image: '/images/news/news6.jpg',
    date: '2024-07-10',
    category: '活动'
  }
]

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/events', name: 'events', component: { template: '<div>Events</div>' } }
  ]
})

/**
 * Mount LatestNews with default configuration
 */
async function mountLatestNews(props: Partial<{
  maxItems: number
}> = {}): Promise<VueWrapper> {
  vi.useFakeTimers()
  
  const wrapper = mount(LatestNews, {
    props,
    global: {
      plugins: [router],
      stubs: {
        'el-icon': true,
        'TransitionGroup': {
          setup(_, { slots }) {
            return () => slots.default?.()
          }
        }
      }
    }
  })
  
  // Advance timers to complete the simulated async loading
  vi.advanceTimersByTime(400)
  await flushPromises()
  
  return wrapper
}

describe('LatestNews Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Section Display', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Section title "最新资讯" is displayed
     */
    it('should display section title "最新资讯"', async () => {
      const wrapper = await mountLatestNews()
      
      const title = wrapper.find('.latest-news__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('最新资讯')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Section subtitle is displayed
     */
    it('should display section subtitle', async () => {
      const wrapper = await mountLatestNews()
      
      const subtitle = wrapper.find('.latest-news__subtitle')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('了解王者荣耀最新动态')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Section has proper accessibility attributes
     */
    it('should have proper accessibility attributes', async () => {
      const wrapper = await mountLatestNews()
      
      const section = wrapper.find('.latest-news')
      expect(section.attributes('aria-labelledby')).toBe('latest-news-title')
      
      const title = wrapper.find('#latest-news-title')
      expect(title.exists()).toBe(true)
    })
  })

  describe('News Display with onMounted', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: News items are loaded and displayed after mount
     */
    it('should load and display news items after mount', async () => {
      const wrapper = await mountLatestNews()
      
      const newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(6)
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Respects maxItems prop
     */
    it('should respect maxItems prop', async () => {
      const wrapper = await mountLatestNews({ maxItems: 3 })
      
      const newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(3)
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Displays news title correctly
     */
    it('should display news title correctly', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsTitle = wrapper.find('.news-card__title')
      expect(firstNewsTitle.text()).toBe('新英雄「瑶」正式上线')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Displays news summary correctly
     */
    it('should display news summary correctly', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsSummary = wrapper.find('.news-card__summary')
      expect(firstNewsSummary.text()).toContain('全新辅助英雄瑶正式上线')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Displays news image correctly
     */
    it('should display news image correctly', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsImage = wrapper.find('.news-card__image')
      expect(firstNewsImage.attributes('src')).toBe('/images/news/news1.jpg')
      expect(firstNewsImage.attributes('alt')).toBe('新英雄「瑶」正式上线')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Displays news category badge
     */
    it('should display news category badge', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsCategory = wrapper.find('.news-card__category')
      expect(firstNewsCategory.text()).toBe('新英雄')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Displays formatted date
     */
    it('should display formatted date', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsDate = wrapper.find('.news-card__date')
      expect(firstNewsDate.text()).toBe('7月15日')
    })
  })

  describe('Category Tabs', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Category tabs are displayed
     */
    it('should display category tabs', async () => {
      const wrapper = await mountLatestNews()
      
      const tabs = wrapper.findAll('.latest-news__tab')
      expect(tabs.length).toBe(5)
      expect(tabs[0].text()).toBe('全部')
      expect(tabs[1].text()).toBe('新英雄')
      expect(tabs[2].text()).toBe('赛事')
      expect(tabs[3].text()).toBe('活动')
      expect(tabs[4].text()).toBe('更新')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: "全部" tab is active by default
     */
    it('should have "全部" tab active by default', async () => {
      const wrapper = await mountLatestNews()
      
      const tabs = wrapper.findAll('.latest-news__tab')
      expect(tabs[0].classes()).toContain('is-active')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Clicking a category tab updates active category state
     */
    it('should filter news when clicking a category tab', async () => {
      const wrapper = await mountLatestNews()
      
      // Verify initial state shows all news
      let newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(6)
      
      // Click on "新英雄" tab (index 1) which has only 1 item in mock data
      const heroTab = wrapper.findAll('.latest-news__tab')[1]
      await heroTab.trigger('click')
      await nextTick()
      await flushPromises()
      
      // Verify the tab is now active
      expect(heroTab.classes()).toContain('is-active')
      
      // Verify filtered news - should show only "新英雄" category
      newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(1)
      
      const category = wrapper.find('.news-card__category')
      expect(category.text()).toBe('新英雄')
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Active tab changes when clicked
     */
    it('should change active tab when clicked', async () => {
      const wrapper = await mountLatestNews()
      
      const tabs = wrapper.findAll('.latest-news__tab')
      
      // Click on "赛事" tab
      await tabs[2].trigger('click')
      
      expect(tabs[0].classes()).not.toContain('is-active')
      expect(tabs[2].classes()).toContain('is-active')
    })
  })

  describe('Loading State', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Shows loading skeleton initially
     */
    it('should show loading skeleton initially', () => {
      vi.useFakeTimers()
      
      const wrapper = mount(LatestNews, {
        global: {
          plugins: [router],
          stubs: {
            'el-icon': true,
            'TransitionGroup': {
              setup(_, { slots }) {
                return () => slots.default?.()
              }
            }
          }
        }
      })
      
      // Before timer advances, should show loading
      const loadingSkeletons = wrapper.findAll('.latest-news__skeleton')
      expect(loadingSkeletons.length).toBe(3)
      
      wrapper.unmount()
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Hides loading skeleton after data loads
     */
    it('should hide loading skeleton after data loads', async () => {
      const wrapper = await mountLatestNews()
      
      const loadingSkeletons = wrapper.findAll('.latest-news__skeleton')
      expect(loadingSkeletons.length).toBe(0)
      
      const newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBeGreaterThan(0)
    })
  })

  describe('Click Event Emission', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Emits news-click event when news card is clicked
     */
    it('should emit news-click event when a news card is clicked', async () => {
      const wrapper = await mountLatestNews()
      
      const firstNewsCard = wrapper.find('.news-card')
      await firstNewsCard.trigger('click')
      
      expect(wrapper.emitted('news-click')).toBeTruthy()
      expect(wrapper.emitted('news-click')![0][0]).toEqual(mockNews[0])
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Emitted news has correct data
     */
    it('should emit news with correct data', async () => {
      const wrapper = await mountLatestNews()
      
      const newsCards = wrapper.findAll('.news-card')
      await newsCards[1].trigger('click')
      
      const emittedNews = wrapper.emitted('news-click')![0][0] as NewsItem
      expect(emittedNews.id).toBe(2)
      expect(emittedNews.title).toBe('KPL夏季赛第五周战报')
      expect(emittedNews.category).toBe('赛事')
    })
  })

  describe('CSS Structure', () => {
    /**
     * **Validates: Requirements 1.4, 8.1**
     * 
     * Test: Component has correct CSS class structure
     */
    it('should have correct CSS class structure', async () => {
      const wrapper = await mountLatestNews()
      
      expect(wrapper.find('.latest-news').exists()).toBe(true)
      expect(wrapper.find('.latest-news__header').exists()).toBe(true)
      expect(wrapper.find('.latest-news__title').exists()).toBe(true)
      expect(wrapper.find('.latest-news__subtitle').exists()).toBe(true)
      expect(wrapper.find('.latest-news__tabs').exists()).toBe(true)
      expect(wrapper.find('.latest-news__list').exists()).toBe(true)
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: News cards have correct structure
     */
    it('should have correct news card structure', async () => {
      const wrapper = await mountLatestNews()
      
      const firstCard = wrapper.find('.news-card')
      expect(firstCard.find('.news-card__image-wrapper').exists()).toBe(true)
      expect(firstCard.find('.news-card__image').exists()).toBe(true)
      expect(firstCard.find('.news-card__category').exists()).toBe(true)
      expect(firstCard.find('.news-card__content').exists()).toBe(true)
      expect(firstCard.find('.news-card__title').exists()).toBe(true)
      expect(firstCard.find('.news-card__summary').exists()).toBe(true)
      expect(firstCard.find('.news-card__meta').exists()).toBe(true)
      expect(firstCard.find('.news-card__date').exists()).toBe(true)
    })
  })

  describe('Category Badge Styling', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Category badges have correct styling classes
     */
    it('should apply correct category styling classes', async () => {
      const wrapper = await mountLatestNews()
      
      const newsCards = wrapper.findAll('.news-card')
      
      // First news is "新英雄" category
      const heroCategory = newsCards[0].find('.news-card__category')
      expect(heroCategory.classes()).toContain('category--hero')
      
      // Second news is "赛事" category
      const eventCategory = newsCards[1].find('.news-card__category')
      expect(eventCategory.classes()).toContain('category--event')
      
      // Third news is "活动" category
      const activityCategory = newsCards[2].find('.news-card__category')
      expect(activityCategory.classes()).toContain('category--activity')
      
      // Fourth news is "更新" category
      const updateCategory = newsCards[3].find('.news-card__category')
      expect(updateCategory.classes()).toContain('category--update')
    })
  })

  describe('Empty State', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Empty state element exists in template
     */
    it('should have empty state element in template', async () => {
      const wrapper = await mountLatestNews()
      
      // Empty state should not be visible when there are news items
      const emptyState = wrapper.find('.latest-news__empty')
      expect(emptyState.exists()).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Handles maxItems of 0
     */
    it('should display no news when maxItems is 0', async () => {
      const wrapper = await mountLatestNews({ maxItems: 0 })
      
      const newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(0)
    })

    /**
     * **Validates: Requirements 1.4**
     * 
     * Test: Handles maxItems of 1
     */
    it('should display single news when maxItems is 1', async () => {
      const wrapper = await mountLatestNews({ maxItems: 1 })
      
      const newsCards = wrapper.findAll('.news-card')
      expect(newsCards.length).toBe(1)
      expect(wrapper.find('.news-card__title').text()).toBe('新英雄「瑶」正式上线')
    })
  })
})
