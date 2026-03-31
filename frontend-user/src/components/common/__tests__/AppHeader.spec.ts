/**
 * AppHeader Property-Based Tests
 * Task 3.2: 编写 AppHeader 属性测试
 * 
 * **Validates: Requirements 7.3**
 * 
 * Property 11: Navigation Active State Consistency
 * "For any current route path, the navigation header SHALL highlight exactly one 
 * navigation item whose path matches the current route."
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory, Router } from 'vue-router'
import * as fc from 'fast-check'
import AppHeader from '../AppHeader.vue'

// Navigation items as defined in AppHeader.vue
const NAV_ITEMS = [
  { path: '/', name: 'home', title: '首页' },
  { path: '/heroes', name: 'heroes', title: '英雄' },
  { path: '/equipment', name: 'equipment', title: '装备' },
  { path: '/events', name: 'events', title: '赛事' },
  { path: '/profile', name: 'profile', title: '个人中心' }
]

// All valid route paths to test
const VALID_ROUTES = [
  '/',                    // 首页
  '/heroes',              // 英雄列表
  '/heroes/1',            // 英雄详情 (example ID)
  '/heroes/123',          // 英雄详情 (another ID)
  '/equipment',           // 装备
  '/events',              // 赛事
  '/profile'              // 个人中心
]

/**
 * Create a test router with the given initial route
 */
function createTestRouter(_initialRoute: string): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/heroes', name: 'heroes', component: { template: '<div>Heroes</div>' } },
      { path: '/heroes/:id', name: 'hero-detail', component: { template: '<div>Hero Detail</div>' } },
      { path: '/equipment', name: 'equipment', component: { template: '<div>Equipment</div>' } },
      { path: '/events', name: 'events', component: { template: '<div>Events</div>' } },
      { path: '/profile', name: 'profile', component: { template: '<div>Profile</div>' } }
    ]
  })
}

/**
 * Mount AppHeader with a specific route
 */
async function mountWithRoute(routePath: string): Promise<{ wrapper: VueWrapper; router: Router }> {
  const router = createTestRouter(routePath)
  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(AppHeader, {
    global: {
      plugins: [router],
      stubs: {
        'el-icon': true,
        'el-button': true
      },
      provide: {
        theme: {
          primaryColor: '#C8AA6E',
          primaryDark: '#A08050',
          bgDark: '#0A1428',
          bgCard: '#1A2744',
          textPrimary: '#F0E6D2',
          textSecondary: '#A09B8C',
          borderColor: '#785A28'
        }
      }
    }
  })

  return { wrapper, router }
}

/**
 * Determine which nav item should be active for a given route path
 * - Home route (/) only matches exact path
 * - Other routes match by prefix
 */
function getExpectedActiveNavPath(routePath: string): string {
  if (routePath === '/') {
    return '/'
  }
  
  // Find the nav item whose path is a prefix of the current route
  for (const navItem of NAV_ITEMS) {
    if (navItem.path !== '/' && routePath.startsWith(navItem.path)) {
      return navItem.path
    }
  }
  
  // Default to home if no match (shouldn't happen with valid routes)
  return '/'
}

describe('AppHeader Property Tests', () => {
  beforeEach(() => {
    // Reset any mocks
    vi.clearAllMocks()
  })

  describe('Property 11: Navigation Active State Consistency', () => {
    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: For any valid route path, exactly one navigation item is highlighted
     */
    it('should highlight exactly one nav item for any valid route path', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...VALID_ROUTES),
          async (routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            // Find all active nav items in desktop navigation
            const desktopNav = wrapper.find('.desktop-nav')
            const activeItems = desktopNav.findAll('.nav-item.active')
            
            // Property: Exactly one nav item should be active
            expect(activeItems.length).toBe(1)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: The highlighted nav item's path matches the current route
     */
    it('should highlight the nav item whose path matches the current route', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...VALID_ROUTES),
          async (routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            const expectedActivePath = getExpectedActiveNavPath(routePath)
            
            // Find the active nav item
            const desktopNav = wrapper.find('.desktop-nav')
            const activeItem = desktopNav.find('.nav-item.active')
            
            expect(activeItem.exists()).toBe(true)
            
            // Get the nav item data by checking which item has the active class
            const allNavItems = desktopNav.findAll('.nav-item')
            let activeIndex = -1
            
            allNavItems.forEach((item, index) => {
              if (item.classes().includes('active')) {
                activeIndex = index
              }
            })
            
            // Verify the active item corresponds to the expected path
            expect(activeIndex).toBeGreaterThanOrEqual(0)
            expect(NAV_ITEMS[activeIndex].path).toBe(expectedActivePath)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: Home route (/) only matches exact path
     */
    it('should only highlight home nav item for exact "/" path', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...VALID_ROUTES),
          async (routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            const desktopNav = wrapper.find('.desktop-nav')
            const allNavItems = desktopNav.findAll('.nav-item')
            
            // Home is the first nav item (index 0)
            const homeNavItem = allNavItems[0]
            const isHomeActive = homeNavItem.classes().includes('active')
            
            // Home should only be active when route is exactly "/"
            if (routePath === '/') {
              expect(isHomeActive).toBe(true)
            } else {
              expect(isHomeActive).toBe(false)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: Other routes match by prefix (e.g., /heroes matches /heroes/:id)
     */
    it('should highlight heroes nav item for /heroes and /heroes/:id routes', async () => {
      // Generate hero detail routes with various IDs
      const heroRouteArbitrary = fc.oneof(
        fc.constant('/heroes'),
        fc.integer({ min: 1, max: 1000 }).map(id => `/heroes/${id}`)
      )

      await fc.assert(
        fc.asyncProperty(
          heroRouteArbitrary,
          async (routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            const desktopNav = wrapper.find('.desktop-nav')
            const allNavItems = desktopNav.findAll('.nav-item')
            
            // Heroes is the second nav item (index 1)
            const heroesNavItem = allNavItems[1]
            const isHeroesActive = heroesNavItem.classes().includes('active')
            
            // Heroes nav item should be active for both /heroes and /heroes/:id
            expect(isHeroesActive).toBe(true)
            
            // Verify only one item is active
            const activeItems = desktopNav.findAll('.nav-item.active')
            expect(activeItems.length).toBe(1)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: Each non-home route should only be active when current path starts with its path
     */
    it('should correctly apply prefix matching for all non-home routes', async () => {
      // Test all combinations of routes and nav items
      const nonHomeNavItems = NAV_ITEMS.filter(item => item.path !== '/')
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...nonHomeNavItems),
          fc.constantFrom(...VALID_ROUTES),
          async (navItem, routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            const desktopNav = wrapper.find('.desktop-nav')
            const allNavItems = desktopNav.findAll('.nav-item')
            
            // Find the index of this nav item
            const navIndex = NAV_ITEMS.findIndex(n => n.path === navItem.path)
            const navElement = allNavItems[navIndex]
            const isActive = navElement.classes().includes('active')
            
            // This nav item should be active if and only if the route starts with its path
            const shouldBeActive = routePath.startsWith(navItem.path)
            expect(isActive).toBe(shouldBeActive)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Additional Navigation State Properties', () => {
    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: Navigation state is consistent between desktop and mobile menus
     */
    it('should have consistent active state between desktop and mobile navigation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...VALID_ROUTES),
          async (routePath: string) => {
            const { wrapper } = await mountWithRoute(routePath)
            
            // Simulate opening mobile menu
            const mobileToggle = wrapper.find('.mobile-menu-toggle')
            if (mobileToggle.exists()) {
              await mobileToggle.trigger('click')
              await wrapper.vm.$nextTick()
            }
            
            const desktopNav = wrapper.find('.desktop-nav')
            const mobileNav = wrapper.find('.mobile-nav')
            
            // Get active items from desktop nav
            const desktopActiveItems = desktopNav.findAll('.nav-item.active')
            
            // If mobile nav is visible, check consistency
            if (mobileNav.exists()) {
              const mobileActiveItems = mobileNav.findAll('.nav-item.active')
              
              // Both should have exactly one active item
              expect(desktopActiveItems.length).toBe(1)
              expect(mobileActiveItems.length).toBe(1)
              
              // Find which nav item is active in each
              const desktopAllItems = desktopNav.findAll('.nav-item')
              const mobileAllItems = mobileNav.findAll('.nav-item')
              
              let desktopActiveIndex = -1
              let mobileActiveIndex = -1
              
              desktopAllItems.forEach((item, index) => {
                if (item.classes().includes('active')) {
                  desktopActiveIndex = index
                }
              })
              
              mobileAllItems.forEach((item, index) => {
                if (item.classes().includes('active')) {
                  mobileActiveIndex = index
                }
              })
              
              // Same nav item should be active in both
              expect(desktopActiveIndex).toBe(mobileActiveIndex)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: No nav item is active for invalid/unknown routes (they redirect to home)
     * Note: In the actual app, unknown routes redirect to home, so home should be active
     */
    it('should handle route changes correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...VALID_ROUTES),
          fc.constantFrom(...VALID_ROUTES),
          async (initialRoute: string, newRoute: string) => {
            const { wrapper, router } = await mountWithRoute(initialRoute)
            
            // Navigate to new route
            await router.push(newRoute)
            await router.isReady()
            await wrapper.vm.$nextTick()
            
            const desktopNav = wrapper.find('.desktop-nav')
            const activeItems = desktopNav.findAll('.nav-item.active')
            
            // Should still have exactly one active item after navigation
            expect(activeItems.length).toBe(1)
            
            // The active item should match the new route
            const expectedActivePath = getExpectedActiveNavPath(newRoute)
            const allNavItems = desktopNav.findAll('.nav-item')
            
            let activeIndex = -1
            allNavItems.forEach((item, index) => {
              if (item.classes().includes('active')) {
                activeIndex = index
              }
            })
            
            expect(NAV_ITEMS[activeIndex].path).toBe(expectedActivePath)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})
