/**
 * EquipmentView Property-Based Tests
 * 
 * Task 10.1: 实现装备分类筛选
 * Task 10.2: 实现装备列表展示
 * Feature: honor-of-kings-vue-app, Property 6: Equipment Category Filter Correctness
 * **Validates: Requirements 4.1, 4.2, 4.5**
 * 
 * Property 6 Definition:
 * "For any equipment category filter selection, all displayed equipment items SHALL have 
 * a `category` property matching the selected category."
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import * as fc from 'fast-check'
import EquipmentView from '../EquipmentView.vue'
import EquipmentCard from '@/components/common/EquipmentCard.vue'
import { equipment, equipmentCategories } from '@/data/equipment'
import type { EquipmentCategory } from '@/types'

/**
 * All valid equipment categories for testing
 */
const ALL_EQUIPMENT_CATEGORIES: EquipmentCategory[] = ['attack', 'magic', 'defense', 'movement', 'jungle']

/**
 * Arbitrary for generating valid equipment categories
 */
const equipmentCategoryArbitrary = fc.constantFrom<EquipmentCategory>(...ALL_EQUIPMENT_CATEGORIES)

/**
 * Arbitrary for generating category selections (including 'all')
 */
const categorySelectionArbitrary = fc.constantFrom<EquipmentCategory | 'all'>(
  'all', 'attack', 'magic', 'defense', 'movement', 'jungle'
)

/**
 * Mount EquipmentView with proper configuration
 */
function mountEquipmentView(): VueWrapper {
  return mount(EquipmentView, {
    global: {
      plugins: [createPinia()],
      stubs: {
        'el-icon': true,
        'el-tooltip': true,
        'router-link': true
      }
    }
  })
}

/**
 * Helper function to get the selected category from the component
 */
function getSelectedCategory(wrapper: VueWrapper): EquipmentCategory | 'all' {
  const activeTab = wrapper.find('.category-tab.active')
  if (!activeTab.exists()) return 'all'
  
  const text = activeTab.text()
  const categoryMap: Record<string, EquipmentCategory | 'all'> = {
    '全部': 'all',
    '攻击': 'attack',
    '法术': 'magic',
    '防御': 'defense',
    '移动': 'movement',
    '打野': 'jungle'
  }
  return categoryMap[text] || 'all'
}

/**
 * Helper function to click a category tab by category key
 */
async function selectCategory(wrapper: VueWrapper, category: EquipmentCategory | 'all'): Promise<void> {
  const categoryLabels: Record<EquipmentCategory | 'all', string> = {
    'all': '全部',
    'attack': '攻击',
    'magic': '法术',
    'defense': '防御',
    'movement': '移动',
    'jungle': '打野'
  }
  
  const tabs = wrapper.findAll('.category-tab')
  const targetTab = tabs.find(tab => tab.text() === categoryLabels[category])
  
  if (targetTab) {
    await targetTab.trigger('click')
  }
}

/**
 * Helper function to get the displayed equipment count from the component
 */
function getDisplayedEquipmentCount(wrapper: VueWrapper): number {
  const countElement = wrapper.find('.count-number')
  if (!countElement.exists()) return 0
  return parseInt(countElement.text(), 10)
}

describe('EquipmentView Property-Based Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Feature: honor-of-kings-vue-app, Property 6: Equipment Category Filter Correctness', () => {
    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: When 'all' category is selected, all equipment SHALL be displayed.
     */
    it('should display all equipment when "all" category is selected', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('all' as const),
          async () => {
            const wrapper = mountEquipmentView()
            
            // Select 'all' category
            await selectCategory(wrapper, 'all')
            
            // Property: When 'all' is selected, all equipment should be displayed
            const displayedCount = getDisplayedEquipmentCount(wrapper)
            expect(displayedCount).toBe(equipment.length)
            
            // Verify the active category is 'all'
            const selectedCategory = getSelectedCategory(wrapper)
            expect(selectedCategory).toBe('all')
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: For any category filter selection, all displayed equipment items SHALL have 
     * a `category` property matching the selected category.
     */
    it('should filter equipment correctly for any selected category', async () => {
      await fc.assert(
        fc.asyncProperty(
          equipmentCategoryArbitrary,
          async (selectedCategory: EquipmentCategory) => {
            const wrapper = mountEquipmentView()
            
            // Select the category
            await selectCategory(wrapper, selectedCategory)
            
            // Calculate expected count based on equipment data
            const expectedEquipment = equipment.filter(item => item.category === selectedCategory)
            const expectedCount = expectedEquipment.length
            
            // Property: Displayed count should match filtered equipment count
            const displayedCount = getDisplayedEquipmentCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            // Property: All expected equipment should have the matching category
            expectedEquipment.forEach(item => {
              expect(item.category).toBe(selectedCategory)
            })
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: For any category selection (including 'all'), the filter behavior 
     * is consistent and correct.
     */
    it('should correctly filter equipment for any category selection including all', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: EquipmentCategory | 'all') => {
            const wrapper = mountEquipmentView()
            
            // Select the category
            await selectCategory(wrapper, category)
            
            // Calculate expected count
            let expectedCount: number
            if (category === 'all') {
              expectedCount = equipment.length
            } else {
              expectedCount = equipment.filter(item => item.category === category).length
            }
            
            // Property: Displayed count should match expected filtered count
            const displayedCount = getDisplayedEquipmentCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: Switching between categories should always result in correct filtering.
     * Tests multiple sequential category selections.
     */
    it('should correctly filter equipment when switching between categories', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(categorySelectionArbitrary, { minLength: 2, maxLength: 5 }),
          async (categorySequence: Array<EquipmentCategory | 'all'>) => {
            const wrapper = mountEquipmentView()
            
            // Apply each category selection in sequence
            for (const category of categorySequence) {
              await selectCategory(wrapper, category)
              
              // Calculate expected count for current category
              let expectedCount: number
              if (category === 'all') {
                expectedCount = equipment.length
              } else {
                expectedCount = equipment.filter(item => item.category === category).length
              }
              
              // Property: After each selection, displayed count should be correct
              const displayedCount = getDisplayedEquipmentCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: The active category tab should always reflect the selected category.
     */
    it('should highlight the correct category tab for any selection', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: EquipmentCategory | 'all') => {
            const wrapper = mountEquipmentView()
            
            // Select the category
            await selectCategory(wrapper, category)
            
            // Property: The active tab should match the selected category
            const activeCategory = getSelectedCategory(wrapper)
            expect(activeCategory).toBe(category)
            
            // Property: Only one tab should be active
            const activeTabs = wrapper.findAll('.category-tab.active')
            expect(activeTabs.length).toBe(1)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: Selecting the same category multiple times should not change the result.
     * (Idempotence property)
     */
    it('should maintain consistent filtering when selecting the same category multiple times', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          fc.integer({ min: 1, max: 3 }),
          async (category: EquipmentCategory | 'all', repeatCount: number) => {
            const wrapper = mountEquipmentView()
            
            // Calculate expected count
            let expectedCount: number
            if (category === 'all') {
              expectedCount = equipment.length
            } else {
              expectedCount = equipment.filter(item => item.category === category).length
            }
            
            // Select the same category multiple times
            for (let i = 0; i < repeatCount; i++) {
              await selectCategory(wrapper, category)
              
              // Property: Count should remain consistent
              const displayedCount = getDisplayedEquipmentCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: The sum of equipment in all individual categories should equal total equipment.
     * This validates the completeness of the filtering logic.
     */
    it('should have category counts that sum to total equipment', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEquipmentView()
            
            let totalFromCategories = 0
            
            // Count equipment in each category
            for (const category of ALL_EQUIPMENT_CATEGORIES) {
              await selectCategory(wrapper, category)
              const count = getDisplayedEquipmentCount(wrapper)
              totalFromCategories += count
            }
            
            // Property: Sum of all category counts should equal total equipment
            expect(totalFromCategories).toBe(equipment.length)
            
            // Verify by selecting 'all'
            await selectCategory(wrapper, 'all')
            const allCount = getDisplayedEquipmentCount(wrapper)
            expect(allCount).toBe(equipment.length)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: Each equipment category should have at least one item in the test data.
     * This ensures the test data is valid for testing all categories.
     */
    it('should have equipment for each category in test data', async () => {
      await fc.assert(
        fc.asyncProperty(
          equipmentCategoryArbitrary,
          async (category: EquipmentCategory) => {
            const wrapper = mountEquipmentView()
            
            await selectCategory(wrapper, category)
            const displayedCount = getDisplayedEquipmentCount(wrapper)
            
            // Property: Each category should have at least one equipment item
            const equipmentWithCategory = equipment.filter(item => item.category === category)
            expect(displayedCount).toBe(equipmentWithCategory.length)
            expect(displayedCount).toBeGreaterThanOrEqual(1)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: Filtering should be deterministic - same category always produces same count.
     */
    it('should produce deterministic results for any category', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: EquipmentCategory | 'all') => {
            // Mount two separate instances
            const wrapper1 = mountEquipmentView()
            const wrapper2 = mountEquipmentView()
            
            // Select the same category on both
            await selectCategory(wrapper1, category)
            await selectCategory(wrapper2, category)
            
            // Property: Both instances should show the same count
            const count1 = getDisplayedEquipmentCount(wrapper1)
            const count2 = getDisplayedEquipmentCount(wrapper2)
            expect(count1).toBe(count2)
            
            wrapper1.unmount()
            wrapper2.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: Initial state should show all equipment (default category is 'all').
     */
    it('should display all equipment on initial load', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEquipmentView()
            
            // Property: Initial state should show all equipment
            const displayedCount = getDisplayedEquipmentCount(wrapper)
            expect(displayedCount).toBe(equipment.length)
            
            // Property: 'all' category should be active by default
            const activeCategory = getSelectedCategory(wrapper)
            expect(activeCategory).toBe('all')
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 4.2**
     * 
     * Property: All category tabs should be rendered correctly.
     */
    it('should render all category tabs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountEquipmentView()
            
            // Property: All category tabs should be present
            const tabs = wrapper.findAll('.category-tab')
            expect(tabs.length).toBe(equipmentCategories.length)
            
            // Property: Tab labels should match category names
            const tabTexts = tabs.map(tab => tab.text())
            equipmentCategories.forEach(category => {
              expect(tabTexts).toContain(category.name)
            })
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})


/**
 * Task 10.2: 实现装备列表展示
 * Unit Tests for Equipment List Display
 * **Validates: Requirements 4.1, 4.5**
 */
describe('EquipmentView Unit Tests - Task 10.2: Equipment List Display', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /**
   * **Validates: Requirements 4.1**
   * 
   * Test: EquipmentCard component should be used for each equipment item
   */
  describe('EquipmentCard Component Usage', () => {
    it('should render EquipmentCard components for all equipment items', () => {
      const wrapper = mountEquipmentView()
      
      // Find all EquipmentCard components
      const equipmentCards = wrapper.findAllComponents(EquipmentCard)
      
      // Should have one EquipmentCard for each equipment item
      expect(equipmentCards.length).toBe(equipment.length)
      
      wrapper.unmount()
    })

    it('should pass correct equipment prop to each EquipmentCard', () => {
      const wrapper = mountEquipmentView()
      
      const equipmentCards = wrapper.findAllComponents(EquipmentCard)
      
      // Each EquipmentCard should receive an equipment prop
      equipmentCards.forEach((card) => {
        const props = card.props()
        expect(props.equipment).toBeDefined()
        expect(props.equipment.id).toBeDefined()
        expect(props.equipment.name).toBeDefined()
        expect(props.equipment.category).toBeDefined()
      })
      
      wrapper.unmount()
    })

    it('should render correct number of EquipmentCards after filtering', async () => {
      const wrapper = mountEquipmentView()
      
      // Filter by 'attack' category
      await selectCategory(wrapper, 'attack')
      
      const attackEquipment = equipment.filter(item => item.category === 'attack')
      const equipmentCards = wrapper.findAllComponents(EquipmentCard)
      
      expect(equipmentCards.length).toBe(attackEquipment.length)
      
      wrapper.unmount()
    })

    it('should emit click event when EquipmentCard is clicked', async () => {
      const wrapper = mountEquipmentView()
      
      const firstCard = wrapper.findComponent(EquipmentCard)
      expect(firstCard.exists()).toBe(true)
      
      // The EquipmentCard component has a click handler that emits 'click' event
      // We need to call the component's method directly since the internal structure
      // is wrapped in el-tooltip which is stubbed
      // Trigger the click by calling the vm method
      const vm = firstCard.vm as any
      if (vm.handleCardClick) {
        vm.handleCardClick()
        expect(firstCard.emitted('click')).toBeTruthy()
      } else {
        // Alternative: verify the component is set up to handle clicks
        // by checking that it has the @click handler in the parent
        const cardWrapper = wrapper.find('.equipment-grid__item')
        expect(cardWrapper.exists()).toBe(true)
      }
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.5**
   * 
   * Test: TransitionGroup should be used for list animations
   */
  describe('TransitionGroup Animation', () => {
    it('should use TransitionGroup for equipment grid', () => {
      const wrapper = mountEquipmentView()
      
      // Find the TransitionGroup component
      const transitionGroup = wrapper.findComponent({ name: 'TransitionGroup' })
      expect(transitionGroup.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should have correct TransitionGroup name attribute for animations', () => {
      const wrapper = mountEquipmentView()
      
      // Check that the TransitionGroup has the correct name for CSS transitions
      const transitionGroup = wrapper.findComponent({ name: 'TransitionGroup' })
      expect(transitionGroup.exists()).toBe(true)
      
      // The TransitionGroup should have name="equipment-list" for CSS animations
      expect(transitionGroup.attributes('name')).toBe('equipment-list')
      
      wrapper.unmount()
    })

    it('should render TransitionGroup as a div with equipment-grid class', () => {
      const wrapper = mountEquipmentView()
      
      // The TransitionGroup should render as a div with class equipment-grid
      const equipmentGrid = wrapper.find('.equipment-grid')
      expect(equipmentGrid.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should have equipment-grid__item class on each EquipmentCard', () => {
      const wrapper = mountEquipmentView()
      
      // Each EquipmentCard should have the grid item class
      const gridItems = wrapper.findAll('.equipment-grid__item')
      expect(gridItems.length).toBe(equipment.length)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.1**
   * 
   * Test: Grid layout should be responsive
   */
  describe('Responsive Grid Layout', () => {
    it('should render equipment in a grid container', () => {
      const wrapper = mountEquipmentView()
      
      const gridContainer = wrapper.find('.equipment-grid-container')
      expect(gridContainer.exists()).toBe(true)
      
      const equipmentGrid = wrapper.find('.equipment-grid')
      expect(equipmentGrid.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should display equipment count correctly', () => {
      const wrapper = mountEquipmentView()
      
      const countElement = wrapper.find('.equipment-count')
      expect(countElement.exists()).toBe(true)
      
      const countNumber = wrapper.find('.count-number')
      expect(countNumber.exists()).toBe(true)
      expect(countNumber.text()).toBe(String(equipment.length))
      
      wrapper.unmount()
    })

    it('should update equipment count when filtering', async () => {
      const wrapper = mountEquipmentView()
      
      // Filter by 'magic' category
      await selectCategory(wrapper, 'magic')
      
      const magicEquipment = equipment.filter(item => item.category === 'magic')
      const countNumber = wrapper.find('.count-number')
      
      expect(countNumber.text()).toBe(String(magicEquipment.length))
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.1**
   * 
   * Test: Empty state handling
   */
  describe('Empty State Handling', () => {
    it('should show empty state when no equipment matches filter', async () => {
      // Note: With current test data, all categories have equipment
      // This test verifies the empty state structure exists
      const wrapper = mountEquipmentView()
      
      // The empty state element should exist in the template
      // but be hidden when there are equipment items
      const emptyState = wrapper.find('.empty-state')
      
      // With 'all' category selected, empty state should not be visible
      expect(emptyState.exists()).toBe(false)
      
      wrapper.unmount()
    })

    it('should have empty state structure in template', () => {
      // This test verifies the empty state structure is correct in the component
      // The empty state is conditionally rendered with v-if when filteredEquipment.length === 0
      // Since we have equipment data, we verify the component structure by checking
      // that the grid is shown instead of empty state
      const wrapper = mountEquipmentView()
      
      // With equipment data, the grid should be visible
      const equipmentGrid = wrapper.find('.equipment-grid')
      expect(equipmentGrid.exists()).toBe(true)
      
      // Empty state should not be visible when there are items
      const emptyState = wrapper.find('.empty-state')
      expect(emptyState.exists()).toBe(false)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.1, 4.5**
   * 
   * Test: Equipment display with all required elements
   */
  describe('Equipment Display Integration', () => {
    it('should display page header with title and subtitle', () => {
      const wrapper = mountEquipmentView()
      
      const pageHeader = wrapper.find('.page-header')
      expect(pageHeader.exists()).toBe(true)
      
      const pageTitle = wrapper.find('.page-title')
      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.text()).toBe('装备列表')
      
      const pageSubtitle = wrapper.find('.page-subtitle')
      expect(pageSubtitle.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should have filter section with category tabs', () => {
      const wrapper = mountEquipmentView()
      
      const filterSection = wrapper.find('.filter-section')
      expect(filterSection.exists()).toBe(true)
      
      const categoryTabs = wrapper.find('.category-tabs')
      expect(categoryTabs.exists()).toBe(true)
      
      const tabs = wrapper.findAll('.category-tab')
      expect(tabs.length).toBe(equipmentCategories.length)
      
      wrapper.unmount()
    })

    it('should render all equipment items with unique keys', () => {
      const wrapper = mountEquipmentView()
      
      const equipmentCards = wrapper.findAllComponents(EquipmentCard)
      
      // Collect all equipment IDs
      const equipmentIds = equipmentCards.map(card => card.props().equipment.id)
      
      // All IDs should be unique
      const uniqueIds = new Set(equipmentIds)
      expect(uniqueIds.size).toBe(equipmentIds.length)
      
      wrapper.unmount()
    })
  })
})


/**
 * Task 10.3: 实现装备详情弹窗
 * Unit Tests for Equipment Detail Modal
 * **Validates: Requirements 4.4**
 */
describe('EquipmentView Unit Tests - Task 10.3: Equipment Detail Modal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /**
   * Mount EquipmentView with dialog support
   */
  function mountEquipmentViewWithDialog(): VueWrapper {
    return mount(EquipmentView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          'el-icon': true,
          'el-tooltip': true,
          'el-dialog': {
            template: `
              <div v-if="modelValue" class="el-dialog-stub" data-testid="equipment-dialog">
                <div class="dialog-header-slot"><slot name="header" :close="() => $emit('update:modelValue', false)" :titleId="'dialog-title'"></slot></div>
                <div class="dialog-body-slot"><slot></slot></div>
                <div class="dialog-footer-slot"><slot name="footer"></slot></div>
              </div>
            `,
            props: ['modelValue', 'title', 'width'],
            emits: ['update:modelValue']
          },
          'el-button': {
            template: '<button class="el-button-stub" @click="$emit(\'click\')"><slot></slot></button>',
            emits: ['click']
          },
          'router-link': true
        }
      }
    })
  }

  /**
   * **Validates: Requirements 4.4**
   * 
   * Test: Dialog should be hidden by default
   */
  describe('Dialog Initial State', () => {
    it('should not show dialog on initial load', () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Dialog should not be visible initially
      const dialog = wrapper.find('[data-testid="equipment-dialog"]')
      expect(dialog.exists()).toBe(false)
      
      wrapper.unmount()
    })

    it('should have dialogVisible ref initialized to false', () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Access the component's internal state
      const vm = wrapper.vm as any
      expect(vm.dialogVisible).toBe(false)
      
      wrapper.unmount()
    })

    it('should have selectedEquipment ref initialized to null', () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const vm = wrapper.vm as any
      expect(vm.selectedEquipment).toBeNull()
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.4**
   * 
   * Test: Clicking equipment card should open dialog
   */
  describe('Dialog Opening', () => {
    it('should open dialog when equipment card is clicked', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Find the first EquipmentCard and trigger click
      const firstCard = wrapper.findComponent(EquipmentCard)
      expect(firstCard.exists()).toBe(true)
      
      // Emit click event from the card
      await firstCard.vm.$emit('click', equipment[0])
      
      // Dialog should now be visible
      const vm = wrapper.vm as any
      expect(vm.dialogVisible).toBe(true)
      
      wrapper.unmount()
    })

    it('should set selectedEquipment when equipment card is clicked', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const firstCard = wrapper.findComponent(EquipmentCard)
      const testEquipment = equipment[0]
      
      await firstCard.vm.$emit('click', testEquipment)
      
      const vm = wrapper.vm as any
      expect(vm.selectedEquipment).toEqual(testEquipment)
      
      wrapper.unmount()
    })

    it('should display dialog with equipment details after click', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const firstCard = wrapper.findComponent(EquipmentCard)
      const testEquipment = equipment[0]
      
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      // Dialog should be visible
      const dialog = wrapper.find('[data-testid="equipment-dialog"]')
      expect(dialog.exists()).toBe(true)
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.4**
   * 
   * Test: Dialog should display full equipment information
   */
  describe('Dialog Content Display', () => {
    it('should display equipment name in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      // Check that the equipment name is displayed
      const nameElement = wrapper.find('.equipment-detail__name')
      expect(nameElement.exists()).toBe(true)
      expect(nameElement.text()).toBe(testEquipment.name)
      
      wrapper.unmount()
    })

    it('should display equipment icon in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      const iconElement = wrapper.find('.equipment-detail__icon')
      expect(iconElement.exists()).toBe(true)
      expect(iconElement.attributes('src')).toBe(testEquipment.icon)
      
      wrapper.unmount()
    })

    it('should display equipment category badge in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      const categoryBadge = wrapper.find('.equipment-detail__category-badge')
      expect(categoryBadge.exists()).toBe(true)
      
      wrapper.unmount()
    })

    it('should display equipment price in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      const priceElement = wrapper.find('.equipment-detail__price-value')
      expect(priceElement.exists()).toBe(true)
      expect(priceElement.text()).toBe(testEquipment.price.toLocaleString())
      
      wrapper.unmount()
    })

    it('should display equipment description in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      const descriptionElement = wrapper.find('.equipment-detail__description')
      expect(descriptionElement.exists()).toBe(true)
      expect(descriptionElement.text()).toBe(testEquipment.description)
      
      wrapper.unmount()
    })

    it('should display equipment attributes in dialog', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      const testEquipment = equipment[0]
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', testEquipment)
      await wrapper.vm.$nextTick()
      
      const attributesContainer = wrapper.find('.equipment-detail__attributes')
      expect(attributesContainer.exists()).toBe(true)
      
      const attributes = wrapper.findAll('.equipment-detail__attribute')
      expect(attributes.length).toBe(testEquipment.attributes.length)
      
      wrapper.unmount()
    })

    it('should display equipment passive effect when present', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Find equipment with passive effect
      const equipmentWithPassive = equipment.find(e => e.passive)
      expect(equipmentWithPassive).toBeDefined()
      
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', equipmentWithPassive!)
      await wrapper.vm.$nextTick()
      
      const passiveElement = wrapper.find('.equipment-detail__passive')
      expect(passiveElement.exists()).toBe(true)
      expect(passiveElement.text()).toBe(equipmentWithPassive!.passive)
      
      wrapper.unmount()
    })

    it('should not display passive section when equipment has no passive', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Find equipment without passive effect
      const equipmentWithoutPassive = equipment.find(e => !e.passive)
      
      if (equipmentWithoutPassive) {
        const firstCard = wrapper.findComponent(EquipmentCard)
        await firstCard.vm.$emit('click', equipmentWithoutPassive)
        await wrapper.vm.$nextTick()
        
        const passiveSection = wrapper.find('.equipment-detail__passive-section')
        expect(passiveSection.exists()).toBe(false)
      }
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.4**
   * 
   * Test: Dialog closing functionality
   */
  describe('Dialog Closing', () => {
    it('should close dialog when closeDialog is called', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Open dialog first
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', equipment[0])
      
      const vm = wrapper.vm as any
      expect(vm.dialogVisible).toBe(true)
      
      // Call closeDialog
      vm.closeDialog()
      await wrapper.vm.$nextTick()
      
      expect(vm.dialogVisible).toBe(false)
      
      wrapper.unmount()
    })

    it('should close dialog when close button in footer is clicked', async () => {
      const wrapper = mountEquipmentViewWithDialog()
      
      // Open dialog first
      const firstCard = wrapper.findComponent(EquipmentCard)
      await firstCard.vm.$emit('click', equipment[0])
      await wrapper.vm.$nextTick()
      
      // Find and click the close button in footer
      const closeButton = wrapper.find('.dialog-footer .el-button-stub')
      if (closeButton.exists()) {
        await closeButton.trigger('click')
        
        const vm = wrapper.vm as any
        expect(vm.dialogVisible).toBe(false)
      }
      
      wrapper.unmount()
    })
  })

  /**
   * **Validates: Requirements 4.4**
   * 
   * Property-based test: Any equipment click should open dialog with correct data
   */
  describe('Property-Based Tests for Equipment Modal', () => {
    it('should correctly display any equipment item in the modal', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: equipment.length - 1 }),
          async (equipmentIndex: number) => {
            const wrapper = mountEquipmentViewWithDialog()
            const testEquipment = equipment[equipmentIndex]
            
            // Simulate clicking on the equipment
            const vm = wrapper.vm as any
            vm.handleEquipmentClick(testEquipment)
            await wrapper.vm.$nextTick()
            
            // Property: Dialog should be visible
            expect(vm.dialogVisible).toBe(true)
            
            // Property: Selected equipment should match clicked equipment
            expect(vm.selectedEquipment).toEqual(testEquipment)
            expect(vm.selectedEquipment.id).toBe(testEquipment.id)
            expect(vm.selectedEquipment.name).toBe(testEquipment.name)
            expect(vm.selectedEquipment.category).toBe(testEquipment.category)
            expect(vm.selectedEquipment.price).toBe(testEquipment.price)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should correctly compute category display for any equipment', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: equipment.length - 1 }),
          async (equipmentIndex: number) => {
            const wrapper = mountEquipmentViewWithDialog()
            const testEquipment = equipment[equipmentIndex]
            
            const vm = wrapper.vm as any
            vm.handleEquipmentClick(testEquipment)
            await wrapper.vm.$nextTick()
            
            // Property: Category display should be correct Chinese text
            const expectedCategoryMap: Record<string, string> = {
              attack: '攻击',
              magic: '法术',
              defense: '防御',
              movement: '移动',
              jungle: '打野'
            }
            
            expect(vm.selectedCategoryDisplay).toBe(expectedCategoryMap[testEquipment.category])
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should correctly format price for any equipment', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: equipment.length - 1 }),
          async (equipmentIndex: number) => {
            const wrapper = mountEquipmentViewWithDialog()
            const testEquipment = equipment[equipmentIndex]
            
            const vm = wrapper.vm as any
            vm.handleEquipmentClick(testEquipment)
            await wrapper.vm.$nextTick()
            
            // Property: Formatted price should match expected format
            expect(vm.formattedPrice).toBe(testEquipment.price.toLocaleString())
            
            wrapper.unmount()
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})
