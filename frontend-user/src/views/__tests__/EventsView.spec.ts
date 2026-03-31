/**
 * EventsView Property-Based Tests
 * 
 * Task 11.1: 实现赛事状态筛选
 * Task 11.2: 实现赛事列表展示
 * Feature: honor-of-kings-vue-app, Property 7: Event Status Filter Correctness
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
 * 
 * Property 7 Definition:
 * "For any event status filter selection, all displayed events SHALL have 
 * a `status` property matching the selected filter value."
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import * as fc from 'fast-check'
import EventsView from '../EventsView.vue'
import { events, eventStatuses } from '@/data/events'
import type { EventStatus } from '@/types'

/**
 * All valid event statuses for testing
 */
const ALL_EVENT_STATUSES: EventStatus[] = ['upcoming', 'ongoing', 'completed']

/**
 * Arbitrary for generating valid event statuses
 */
const eventStatusArbitrary = fc.constantFrom<EventStatus>(...ALL_EVENT_STATUSES)

/**
 * Arbitrary for generating status selections (including 'all')
 */
const statusSelectionArbitrary = fc.constantFrom<EventStatus | 'all'>(
  'all', 'upcoming', 'ongoing', 'completed'
)

/**
 * Mount EventsView with proper configuration
 */
function mountEventsView(): VueWrapper {
  return mount(EventsView, {
    global: {
      plugins: [createPinia()],
      stubs: {
        'el-icon': true,
        'el-skeleton': true,
        'router-link': true
      }
    }
  })
}

/**
 * Helper function to get the selected status from the component
 */
function getSelectedStatus(wrapper: VueWrapper): EventStatus | 'all' {
  const activeTab = wrapper.find('.status-tab.active')
  if (!activeTab.exists()) return 'all'
  
  const text = activeTab.text()
  const statusMap: Record<string, EventStatus | 'all'> = {
    '全部': 'all',
    '即将开始': 'upcoming',
    '进行中': 'ongoing',
    '已结束': 'completed'
  }
  return statusMap[text] || 'all'
}

/**
 * Helper function to click a status tab by status key
 */
async function selectStatus(wrapper: VueWrapper, status: EventStatus | 'all'): Promise<void> {
  const statusLabels: Record<EventStatus | 'all', string> = {
    'all': '全部',
    'upcoming': '即将开始',
    'ongoing': '进行中',
    'completed': '已结束'
  }
  
  const tabs = wrapper.findAll('.status-tab')
  const targetTab = tabs.find(tab => tab.text() === statusLabels[status])
  
  if (targetTab) {
    await targetTab.trigger('click')
  }
}

/**
 * Helper function to get the displayed events count from the component
 */
function getDisplayedEventsCount(wrapper: VueWrapper): number {
  const countElement = wrapper.find('.count-number')
  if (!countElement.exists()) return 0
  return parseInt(countElement.text(), 10)
}

describe('EventsView Property-Based Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Feature: honor-of-kings-vue-app, Property 7: Event Status Filter Correctness', () => {
    /**
     * **Validates: Requirements 5.4**
     * 
     * Property: When 'all' status is selected, all events SHALL be displayed.
     */
    it('should display all events when "all" status is selected', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('all' as const),
          async () => {
            const wrapper = mountEventsView()
            
            await selectStatus(wrapper, 'all')
            
            const displayedCount = getDisplayedEventsCount(wrapper)
            expect(displayedCount).toBe(events.length)
            
            const selectedStatus = getSelectedStatus(wrapper)
            expect(selectedStatus).toBe('all')
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3, 5.4**
     * 
     * Property: For any status filter selection, all displayed events SHALL have 
     * a `status` property matching the selected status.
     */
    it('should filter events correctly for any selected status', async () => {
      await fc.assert(
        fc.asyncProperty(
          eventStatusArbitrary,
          async (selectedStatus: EventStatus) => {
            const wrapper = mountEventsView()
            
            await selectStatus(wrapper, selectedStatus)
            
            const expectedEvents = events.filter(event => event.status === selectedStatus)
            const expectedCount = expectedEvents.length
            
            const displayedCount = getDisplayedEventsCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            expectedEvents.forEach(event => {
              expect(event.status).toBe(selectedStatus)
            })
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3, 5.4**
     * 
     * Property: For any status selection (including 'all'), the filter behavior 
     * is consistent and correct.
     */
    it('should correctly filter events for any status selection including all', async () => {
      await fc.assert(
        fc.asyncProperty(
          statusSelectionArbitrary,
          async (status: EventStatus | 'all') => {
            const wrapper = mountEventsView()
            
            await selectStatus(wrapper, status)
            
            let expectedCount: number
            if (status === 'all') {
              expectedCount = events.length
            } else {
              expectedCount = events.filter(event => event.status === status).length
            }
            
            const displayedCount = getDisplayedEventsCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.4**
     * 
     * Property: Switching between statuses should always result in correct filtering.
     */
    it('should correctly filter events when switching between statuses', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(statusSelectionArbitrary, { minLength: 2, maxLength: 5 }),
          async (statusSequence: Array<EventStatus | 'all'>) => {
            const wrapper = mountEventsView()
            
            for (const status of statusSequence) {
              await selectStatus(wrapper, status)
              
              let expectedCount: number
              if (status === 'all') {
                expectedCount = events.length
              } else {
                expectedCount = events.filter(event => event.status === status).length
              }
              
              const displayedCount = getDisplayedEventsCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3**
     * 
     * Property: The active status tab should always reflect the selected status.
     */
    it('should highlight the correct status tab for any selection', async () => {
      await fc.assert(
        fc.asyncProperty(
          statusSelectionArbitrary,
          async (status: EventStatus | 'all') => {
            const wrapper = mountEventsView()
            
            await selectStatus(wrapper, status)
            
            const activeStatus = getSelectedStatus(wrapper)
            expect(activeStatus).toBe(status)
            
            const activeTabs = wrapper.findAll('.status-tab.active')
            expect(activeTabs.length).toBe(1)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.4**
     * 
     * Property: Selecting the same status multiple times should not change the result.
     */
    it('should maintain consistent filtering when selecting the same status multiple times', async () => {
      await fc.assert(
        fc.asyncProperty(
          statusSelectionArbitrary,
          fc.integer({ min: 1, max: 3 }),
          async (status: EventStatus | 'all', repeatCount: number) => {
            const wrapper = mountEventsView()
            
            let expectedCount: number
            if (status === 'all') {
              expectedCount = events.length
            } else {
              expectedCount = events.filter(event => event.status === status).length
            }
            
            for (let i = 0; i < repeatCount; i++) {
              await selectStatus(wrapper, status)
              
              const displayedCount = getDisplayedEventsCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3**
     * 
     * Property: The sum of events in all individual statuses should equal total events.
     */
    it('should have status counts that sum to total events', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEventsView()
            
            let totalFromStatuses = 0
            
            for (const status of ALL_EVENT_STATUSES) {
              await selectStatus(wrapper, status)
              const count = getDisplayedEventsCount(wrapper)
              totalFromStatuses += count
            }
            
            expect(totalFromStatuses).toBe(events.length)
            
            await selectStatus(wrapper, 'all')
            const allCount = getDisplayedEventsCount(wrapper)
            expect(allCount).toBe(events.length)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3**
     * 
     * Property: Initial state should show all events (default status is 'all').
     */
    it('should display all events on initial load', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEventsView()
            
            const displayedCount = getDisplayedEventsCount(wrapper)
            expect(displayedCount).toBe(events.length)
            
            const activeStatus = getSelectedStatus(wrapper)
            expect(activeStatus).toBe('all')
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })

    /**
     * **Validates: Requirements 5.3**
     * 
     * Property: All status tabs should be rendered correctly.
     */
    it('should render all status tabs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEventsView()
            
            const tabs = wrapper.findAll('.status-tab')
            expect(tabs.length).toBe(eventStatuses.length)
            
            const tabTexts = tabs.map(tab => tab.text())
            eventStatuses.forEach(status => {
              expect(tabTexts).toContain(status.name)
            })
            
            wrapper.unmount()
          }
        ),
        { numRuns: 10 }
      )
    })
  })
})


/**
 * Task 11.2: 实现赛事列表展示
 * Unit Tests for Events List Display
 * **Validates: Requirements 5.1, 5.2, 5.5**
 */
describe('EventsView Unit Tests - Task 11.2: Events List Display', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  /**
   * **Validates: Requirements 5.5**
   * 
   * Test: Skeleton loading state
   */
  describe('Skeleton Loading State', () => {
    it('should show skeleton loading state initially', () => {
      const wrapper = mountEventsView()
      
      // Should show skeleton cards
      const skeletonCards = wrapper.findAll('.event-card--skeleton')
      expect(skeletonCards.length).toBeGreaterThan(0)
      
      wrapper.unmount()
    })

    it('should have skeleton elements for header, title, teams, and description', () => {
      const wrapper = mountEventsView()
      
      // Check skeleton structure
      expect(wrapper.find('.skeleton-header').exists()).toBe(true)
      expect(wrapper.find('.skeleton-badge').exists()).toBe(true)
      expect(wrapper.find('.skeleton-date').exists()).toBe(true)
      expect(wrapper.find('.skeleton-title').exists()).toBe(true)
      expect(wrapper.find('.skeleton-teams').exists()).toBe(true)
      expect(wrapper.find('.skeleton-description').exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should hide skeleton after loading completes', async () => {
      const wrapper = mountEventsView()
      
      // Initially should show skeleton
      expect(wrapper.findAll('.event-card--skeleton').length).toBeGreaterThan(0)
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      // Skeleton should be hidden
      expect(wrapper.findAll('.event-card--skeleton').length).toBe(0)
      
      // Real event cards should be visible
      const eventCards = wrapper.findAll('.event-card:not(.event-card--skeleton)')
      expect(eventCards.length).toBe(events.length)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 5.1**
   * 
   * Test: Event cards should display event information
   */
  describe('Event Card Display', () => {
    it('should render event cards for all events after loading', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const eventCards = wrapper.findAll('.event-card:not(.event-card--skeleton)')
      expect(eventCards.length).toBe(events.length)
      
      wrapper.unmount()
    })

    it('should display event title in each card', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const titles = wrapper.findAll('.event-card__title')
      expect(titles.length).toBe(events.length)
      
      // Verify first event title
      expect(titles[0].text()).toBe(events[0].title)
      
      wrapper.unmount()
    })

    it('should display event status badge', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const statusBadges = wrapper.findAll('.event-card__status')
      expect(statusBadges.length).toBe(events.length)
      
      wrapper.unmount()
    })

    it('should display event date', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const dates = wrapper.findAll('.event-card__date')
      expect(dates.length).toBe(events.length)
      
      // Verify first event date
      expect(dates[0].text()).toBe(events[0].date)
      
      wrapper.unmount()
    })

    it('should display teams information', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const teamsContainers = wrapper.findAll('.event-card__teams')
      expect(teamsContainers.length).toBe(events.length)
      
      // Each event should have 2 teams
      const teamElements = wrapper.findAll('.team')
      expect(teamElements.length).toBe(events.length * 2)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 5.2**
   * 
   * Test: Click to expand event details
   */
  describe('Event Expand Functionality', () => {
    it('should expand event details when clicked', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const firstCard = wrapper.find('.event-card:not(.event-card--skeleton)')
      expect(firstCard.exists()).toBe(true)
      
      // Initially, details should not be visible
      let details = firstCard.find('.event-card__details')
      expect(details.exists()).toBe(false)
      
      // Click to expand
      await firstCard.trigger('click')
      
      // Details should now be visible
      details = firstCard.find('.event-card__details')
      expect(details.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should collapse event details when clicked again', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const firstCard = wrapper.find('.event-card:not(.event-card--skeleton)')
      
      // Click to expand
      await firstCard.trigger('click')
      expect(firstCard.find('.event-card__details').exists()).toBe(true)
      
      // Click again to collapse
      await firstCard.trigger('click')
      expect(firstCard.find('.event-card__details').exists()).toBe(false)
      
      wrapper.unmount()
    })

    it('should show expand hint text', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const expandHints = wrapper.findAll('.event-card__expand-hint')
      expect(expandHints.length).toBe(events.length)
      
      // Initially should show "点击查看详情"
      expect(expandHints[0].text()).toContain('点击查看详情')
      
      wrapper.unmount()
    })

    it('should change expand hint text when expanded', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const firstCard = wrapper.find('.event-card:not(.event-card--skeleton)')
      
      // Click to expand
      await firstCard.trigger('click')
      
      const expandHint = firstCard.find('.event-card__expand-hint')
      expect(expandHint.text()).toContain('点击收起')
      
      wrapper.unmount()
    })

    it('should only expand one event at a time', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      const eventCards = wrapper.findAll('.event-card:not(.event-card--skeleton)')
      
      // Click first card
      await eventCards[0].trigger('click')
      expect(eventCards[0].find('.event-card__details').exists()).toBe(true)
      
      // Click second card
      await eventCards[1].trigger('click')
      
      // First card should be collapsed, second should be expanded
      expect(eventCards[0].find('.event-card__details').exists()).toBe(false)
      expect(eventCards[1].find('.event-card__details').exists()).toBe(true)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 5.1**
   * 
   * Test: Event prize display
   */
  describe('Event Prize Display', () => {
    it('should display prize for events that have it', async () => {
      const wrapper = mountEventsView()
      
      // Advance timers to complete loading
      await vi.advanceTimersByTimeAsync(1000)
      
      // Expand first event to see prize
      const firstCard = wrapper.find('.event-card:not(.event-card--skeleton)')
      await firstCard.trigger('click')
      
      const prizeElement = firstCard.find('.event-card__prize')
      
      // First event has a prize
      if (events[0].prize) {
        expect(prizeElement.exists()).toBe(true)
        expect(prizeElement.find('.prize-value').text()).toBe(events[0].prize)
      }
      
      wrapper.unmount()
    })
  })
})
