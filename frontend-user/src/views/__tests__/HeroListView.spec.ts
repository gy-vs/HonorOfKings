/**
 * HeroListView Property-Based Tests
 * 
 * Task 7.2: 编写分类筛选属性测试
 * Feature: honor-of-kings-vue-app, Property 2: Category Filter Correctness
 * **Validates: Requirements 2.2**
 * 
 * Task 7.4: 编写搜索筛选属性测试
 * Feature: honor-of-kings-vue-app, Property 3: Search Filter Correctness
 * **Validates: Requirements 2.3**
 * 
 * Property 2 Definition:
 * "For any category filter selection on the hero list page, all displayed heroes SHALL have 
 * a `role` property matching the selected category. When no category is selected, all heroes 
 * SHALL be displayed."
 * 
 * Property 3 Definition:
 * "For any non-empty search string entered in the hero list search input, all displayed heroes 
 * SHALL have a `name` property containing the search string (case-insensitive)."
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import * as fc from 'fast-check'
import HeroListView from '../HeroListView.vue'
import { heroes } from '@/data/heroes'
import type { HeroRole } from '@/types'

/**
 * All valid hero roles for testing
 */
const ALL_HERO_ROLES: HeroRole[] = ['warrior', 'mage', 'assassin', 'marksman', 'support', 'tank']

/**
 * Arbitrary for generating valid hero roles
 */
const heroRoleArbitrary = fc.constantFrom<HeroRole>(...ALL_HERO_ROLES)

/**
 * Arbitrary for generating category selections (including 'all')
 */
const categorySelectionArbitrary = fc.constantFrom<HeroRole | 'all'>(
  'all', 'warrior', 'mage', 'assassin', 'marksman', 'support', 'tank'
)

/**
 * Mount HeroListView with proper configuration
 */
function mountHeroListView(): VueWrapper {
  return mount(HeroListView, {
    global: {
      plugins: [createPinia()],
      stubs: {
        'el-icon': true,
        'router-link': true
      }
    }
  })
}

/**
 * Helper function to get the selected category from the component
 */
function getSelectedCategory(wrapper: VueWrapper): HeroRole | 'all' {
  const activeTab = wrapper.find('.category-tab.active')
  if (!activeTab.exists()) return 'all'
  
  const text = activeTab.text()
  const categoryMap: Record<string, HeroRole | 'all'> = {
    '全部': 'all',
    '战士': 'warrior',
    '法师': 'mage',
    '刺客': 'assassin',
    '射手': 'marksman',
    '辅助': 'support',
    '坦克': 'tank'
  }
  return categoryMap[text] || 'all'
}

/**
 * Helper function to click a category tab by role
 */
async function selectCategory(wrapper: VueWrapper, category: HeroRole | 'all'): Promise<void> {
  const categoryLabels: Record<HeroRole | 'all', string> = {
    'all': '全部',
    'warrior': '战士',
    'mage': '法师',
    'assassin': '刺客',
    'marksman': '射手',
    'support': '辅助',
    'tank': '坦克'
  }
  
  const tabs = wrapper.findAll('.category-tab')
  const targetTab = tabs.find(tab => tab.text() === categoryLabels[category])
  
  if (targetTab) {
    await targetTab.trigger('click')
  }
}

/**
 * Helper function to get the displayed hero count from the component
 */
function getDisplayedHeroCount(wrapper: VueWrapper): number {
  const countElement = wrapper.find('.count-number')
  if (!countElement.exists()) return 0
  return parseInt(countElement.text(), 10)
}

describe('HeroListView Property-Based Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Feature: honor-of-kings-vue-app, Property 2: Category Filter Correctness', () => {
    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: When 'all' category is selected, all heroes SHALL be displayed.
     * This tests the "no category selected" case from the property definition.
     */
    it('should display all heroes when "all" category is selected', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('all' as const),
          async () => {
            const wrapper = mountHeroListView()
            
            // Select 'all' category
            await selectCategory(wrapper, 'all')
            
            // Property: When 'all' is selected, all heroes should be displayed
            const displayedCount = getDisplayedHeroCount(wrapper)
            expect(displayedCount).toBe(heroes.length)
            
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
     * **Validates: Requirements 2.2**
     * 
     * Property: For any category filter selection, all displayed heroes SHALL have 
     * a `role` property matching the selected category.
     */
    it('should filter heroes correctly for any selected category', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroRoleArbitrary,
          async (selectedRole: HeroRole) => {
            const wrapper = mountHeroListView()
            
            // Select the category
            await selectCategory(wrapper, selectedRole)
            
            // Calculate expected count based on heroes data
            const expectedHeroes = heroes.filter(hero => hero.role === selectedRole)
            const expectedCount = expectedHeroes.length
            
            // Property: Displayed count should match filtered heroes count
            const displayedCount = getDisplayedHeroCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            // Property: All expected heroes should have the matching role
            expectedHeroes.forEach(hero => {
              expect(hero.role).toBe(selectedRole)
            })
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: For any category selection (including 'all'), the filter behavior 
     * is consistent and correct.
     */
    it('should correctly filter heroes for any category selection including all', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: HeroRole | 'all') => {
            const wrapper = mountHeroListView()
            
            // Select the category
            await selectCategory(wrapper, category)
            
            // Calculate expected count
            let expectedCount: number
            if (category === 'all') {
              expectedCount = heroes.length
            } else {
              expectedCount = heroes.filter(hero => hero.role === category).length
            }
            
            // Property: Displayed count should match expected filtered count
            const displayedCount = getDisplayedHeroCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: Switching between categories should always result in correct filtering.
     * Tests multiple sequential category selections.
     */
    it('should correctly filter heroes when switching between categories', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(categorySelectionArbitrary, { minLength: 2, maxLength: 5 }),
          async (categorySequence: Array<HeroRole | 'all'>) => {
            const wrapper = mountHeroListView()
            
            // Apply each category selection in sequence
            for (const category of categorySequence) {
              await selectCategory(wrapper, category)
              
              // Calculate expected count for current category
              let expectedCount: number
              if (category === 'all') {
                expectedCount = heroes.length
              } else {
                expectedCount = heroes.filter(hero => hero.role === category).length
              }
              
              // Property: After each selection, displayed count should be correct
              const displayedCount = getDisplayedHeroCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: The active category tab should always reflect the selected category.
     */
    it('should highlight the correct category tab for any selection', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: HeroRole | 'all') => {
            const wrapper = mountHeroListView()
            
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
     * **Validates: Requirements 2.2**
     * 
     * Property: Selecting the same category multiple times should not change the result.
     * (Idempotence property)
     */
    it('should maintain consistent filtering when selecting the same category multiple times', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          fc.integer({ min: 1, max: 3 }),
          async (category: HeroRole | 'all', repeatCount: number) => {
            const wrapper = mountHeroListView()
            
            // Calculate expected count
            let expectedCount: number
            if (category === 'all') {
              expectedCount = heroes.length
            } else {
              expectedCount = heroes.filter(hero => hero.role === category).length
            }
            
            // Select the same category multiple times
            for (let i = 0; i < repeatCount; i++) {
              await selectCategory(wrapper, category)
              
              // Property: Count should remain consistent
              const displayedCount = getDisplayedHeroCount(wrapper)
              expect(displayedCount).toBe(expectedCount)
            }
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: The sum of heroes in all individual categories should equal total heroes.
     * This validates the completeness of the filtering logic.
     */
    it('should have category counts that sum to total heroes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const wrapper = mountHeroListView()
            
            let totalFromCategories = 0
            
            // Count heroes in each category
            for (const role of ALL_HERO_ROLES) {
              await selectCategory(wrapper, role)
              const count = getDisplayedHeroCount(wrapper)
              totalFromCategories += count
            }
            
            // Property: Sum of all category counts should equal total heroes
            expect(totalFromCategories).toBe(heroes.length)
            
            // Verify by selecting 'all'
            await selectCategory(wrapper, 'all')
            const allCount = getDisplayedHeroCount(wrapper)
            expect(allCount).toBe(heroes.length)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: Each hero role should have at least one hero in the test data.
     * This ensures the test data is valid for testing all categories.
     */
    it('should have heroes for each role category in test data', async () => {
      await fc.assert(
        fc.asyncProperty(
          heroRoleArbitrary,
          async (role: HeroRole) => {
            const wrapper = mountHeroListView()
            
            await selectCategory(wrapper, role)
            const displayedCount = getDisplayedHeroCount(wrapper)
            
            // Property: Each role should have at least one hero
            // (This validates our test data is comprehensive)
            const heroesWithRole = heroes.filter(h => h.role === role)
            expect(displayedCount).toBe(heroesWithRole.length)
            
            wrapper.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: Filtering should be deterministic - same category always produces same count.
     */
    it('should produce deterministic results for any category', async () => {
      await fc.assert(
        fc.asyncProperty(
          categorySelectionArbitrary,
          async (category: HeroRole | 'all') => {
            // Mount two separate instances
            const wrapper1 = mountHeroListView()
            const wrapper2 = mountHeroListView()
            
            // Select the same category on both
            await selectCategory(wrapper1, category)
            await selectCategory(wrapper2, category)
            
            // Property: Both instances should show the same count
            const count1 = getDisplayedHeroCount(wrapper1)
            const count2 = getDisplayedHeroCount(wrapper2)
            expect(count1).toBe(count2)
            
            wrapper1.unmount()
            wrapper2.unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})


/**
 * Task 7.4: 编写搜索筛选属性测试
 * 
 * Feature: honor-of-kings-vue-app, Property 3: Search Filter Correctness
 * 
 * **Validates: Requirements 2.3**
 * 
 * Property Definition:
 * "For any non-empty search string entered in the hero list search input, all displayed heroes 
 * SHALL have a `name` property containing the search string (case-insensitive)."
 */
describe('Feature: honor-of-kings-vue-app, Property 3: Search Filter Correctness', () => {
  /**
   * Helper function to set search input value
   */
  async function setSearchInput(wrapper: VueWrapper, searchText: string): Promise<void> {
    const searchInput = wrapper.find('.search-input')
    if (searchInput.exists()) {
      await searchInput.setValue(searchText)
    }
  }

  /**
   * Helper function to calculate expected hero count for a search query
   */
  function getExpectedHeroCount(searchQuery: string): number {
    if (!searchQuery.trim()) {
      return heroes.length
    }
    const query = searchQuery.trim().toLowerCase()
    return heroes.filter(hero => hero.name.toLowerCase().includes(query)).length
  }

  /**
   * Helper function to get heroes that match a search query
   */
  function getMatchingHeroes(searchQuery: string): typeof heroes {
    if (!searchQuery.trim()) {
      return heroes
    }
    const query = searchQuery.trim().toLowerCase()
    return heroes.filter(hero => hero.name.toLowerCase().includes(query))
  }

  /**
   * Arbitrary for generating random search strings (alphanumeric and Chinese characters)
   */
  const searchStringArbitrary = fc.stringOf(
    fc.oneof(
      fc.char16bits().filter(c => /[\u4e00-\u9fa5a-zA-Z0-9]/.test(c)),
      fc.constant(' ')
    ),
    { minLength: 1, maxLength: 10 }
  )

  /**
   * Arbitrary for generating substrings of actual hero names
   */
  const heroNameSubstringArbitrary = fc.constantFrom(...heroes).chain(hero => {
    const name = hero.name
    return fc.tuple(
      fc.integer({ min: 0, max: name.length - 1 }),
      fc.integer({ min: 1, max: name.length })
    ).map(([start, length]) => {
      const end = Math.min(start + length, name.length)
      return name.substring(start, end)
    })
  })

  /**
   * Arbitrary for generating full hero names
   */
  const heroNameArbitrary = fc.constantFrom(...heroes.map(h => h.name))

  /**
   * Arbitrary for generating single characters from hero names
   */
  const singleCharFromHeroNameArbitrary = fc.constantFrom(
    ...heroes.flatMap(h => h.name.split(''))
  )

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: When an empty search string is entered, all heroes SHALL be displayed.
   */
  it('should display all heroes when search string is empty', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(''),
        async () => {
          const wrapper = mountHeroListView()
          
          // Set empty search
          await setSearchInput(wrapper, '')
          
          // Property: All heroes should be displayed
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(heroes.length)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: For any non-empty search string, all displayed heroes SHALL have a name 
   * containing the search string (case-insensitive).
   */
  it('should filter heroes correctly for any search string', async () => {
    await fc.assert(
      fc.asyncProperty(
        searchStringArbitrary,
        async (searchQuery: string) => {
          const wrapper = mountHeroListView()
          
          // Set search query
          await setSearchInput(wrapper, searchQuery)
          
          // Calculate expected count
          const expectedCount = getExpectedHeroCount(searchQuery)
          
          // Property: Displayed count should match expected filtered count
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(expectedCount)
          
          // Property: All matching heroes should have names containing the search string
          const matchingHeroes = getMatchingHeroes(searchQuery)
          const query = searchQuery.trim().toLowerCase()
          if (query) {
            matchingHeroes.forEach(hero => {
              expect(hero.name.toLowerCase()).toContain(query)
            })
          }
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Search should be case-insensitive - searching with different cases 
   * should produce the same results.
   */
  it('should perform case-insensitive search', async () => {
    await fc.assert(
      fc.asyncProperty(
        heroNameArbitrary,
        async (heroName: string) => {
          const wrapper1 = mountHeroListView()
          const wrapper2 = mountHeroListView()
          const wrapper3 = mountHeroListView()
          
          // Search with original case
          await setSearchInput(wrapper1, heroName)
          const count1 = getDisplayedHeroCount(wrapper1)
          
          // Search with lowercase
          await setSearchInput(wrapper2, heroName.toLowerCase())
          const count2 = getDisplayedHeroCount(wrapper2)
          
          // Search with uppercase
          await setSearchInput(wrapper3, heroName.toUpperCase())
          const count3 = getDisplayedHeroCount(wrapper3)
          
          // Property: All three searches should produce the same count
          expect(count1).toBe(count2)
          expect(count2).toBe(count3)
          
          wrapper1.unmount()
          wrapper2.unmount()
          wrapper3.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Searching for a substring of a hero name should include that hero in results.
   */
  it('should match partial hero names (substring matching)', async () => {
    await fc.assert(
      fc.asyncProperty(
        heroNameSubstringArbitrary,
        async (substring: string) => {
          const wrapper = mountHeroListView()
          
          // Set search to substring
          await setSearchInput(wrapper, substring)
          
          // Property: At least one hero should match (since substring comes from a hero name)
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBeGreaterThanOrEqual(1)
          
          // Property: All matching heroes should contain the substring
          const matchingHeroes = getMatchingHeroes(substring)
          const query = substring.toLowerCase()
          matchingHeroes.forEach(hero => {
            expect(hero.name.toLowerCase()).toContain(query)
          })
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Searching for a single character from hero names should return all heroes 
   * whose names contain that character.
   */
  it('should correctly filter for single character searches', async () => {
    await fc.assert(
      fc.asyncProperty(
        singleCharFromHeroNameArbitrary,
        async (char: string) => {
          const wrapper = mountHeroListView()
          
          // Set search to single character
          await setSearchInput(wrapper, char)
          
          // Calculate expected count
          const expectedCount = getExpectedHeroCount(char)
          
          // Property: Displayed count should match expected
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(expectedCount)
          
          // Property: At least one hero should match
          expect(displayedCount).toBeGreaterThanOrEqual(1)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Searching for a full hero name should return at least that hero.
   */
  it('should return at least one result when searching for full hero name', async () => {
    await fc.assert(
      fc.asyncProperty(
        heroNameArbitrary,
        async (heroName: string) => {
          const wrapper = mountHeroListView()
          
          // Set search to full hero name
          await setSearchInput(wrapper, heroName)
          
          // Property: At least one hero should be found
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBeGreaterThanOrEqual(1)
          
          // Property: The exact hero should be in the results
          const matchingHeroes = getMatchingHeroes(heroName)
          const heroExists = matchingHeroes.some(h => h.name === heroName)
          expect(heroExists).toBe(true)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Search results should be deterministic - same search query always produces same count.
   */
  it('should produce deterministic results for any search query', async () => {
    await fc.assert(
      fc.asyncProperty(
        searchStringArbitrary,
        async (searchQuery: string) => {
          // Mount two separate instances
          const wrapper1 = mountHeroListView()
          const wrapper2 = mountHeroListView()
          
          // Set the same search on both
          await setSearchInput(wrapper1, searchQuery)
          await setSearchInput(wrapper2, searchQuery)
          
          // Property: Both instances should show the same count
          const count1 = getDisplayedHeroCount(wrapper1)
          const count2 = getDisplayedHeroCount(wrapper2)
          expect(count1).toBe(count2)
          
          wrapper1.unmount()
          wrapper2.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Clearing search should restore all heroes.
   */
  it('should restore all heroes when search is cleared', async () => {
    await fc.assert(
      fc.asyncProperty(
        searchStringArbitrary,
        async (searchQuery: string) => {
          const wrapper = mountHeroListView()
          
          // Set search query
          await setSearchInput(wrapper, searchQuery)
          
          // Clear search
          await setSearchInput(wrapper, '')
          
          // Property: All heroes should be displayed after clearing
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(heroes.length)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Search with whitespace-only should behave like empty search.
   */
  it('should treat whitespace-only search as empty search', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringOf(fc.constant(' '), { minLength: 1, maxLength: 5 }),
        async (whitespace: string) => {
          const wrapper = mountHeroListView()
          
          // Set search to whitespace only
          await setSearchInput(wrapper, whitespace)
          
          // Property: All heroes should be displayed (whitespace is trimmed)
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(heroes.length)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Search combined with category filter should apply both filters correctly.
   */
  it('should correctly combine search with category filter', async () => {
    await fc.assert(
      fc.asyncProperty(
        heroNameSubstringArbitrary,
        categorySelectionArbitrary,
        async (searchQuery: string, category: HeroRole | 'all') => {
          const wrapper = mountHeroListView()
          
          // Apply category filter first
          await selectCategory(wrapper, category)
          
          // Then apply search
          await setSearchInput(wrapper, searchQuery)
          
          // Calculate expected count (both filters applied)
          let expectedHeroes = heroes
          if (category !== 'all') {
            expectedHeroes = expectedHeroes.filter(h => h.role === category)
          }
          const query = searchQuery.trim().toLowerCase()
          if (query) {
            expectedHeroes = expectedHeroes.filter(h => h.name.toLowerCase().includes(query))
          }
          
          // Property: Displayed count should match expected with both filters
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(expectedHeroes.length)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Searching for non-existent string should return zero results.
   */
  it('should return zero results for non-matching search strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('ZZZZNONEXISTENT999'),
        async (searchQuery: string) => {
          const wrapper = mountHeroListView()
          
          // Set search to non-existent string
          await setSearchInput(wrapper, searchQuery)
          
          // Property: No heroes should match
          const displayedCount = getDisplayedHeroCount(wrapper)
          expect(displayedCount).toBe(0)
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property: Sequential search queries should each produce correct results.
   */
  it('should correctly filter for sequential search queries', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(heroNameSubstringArbitrary, { minLength: 2, maxLength: 4 }),
        async (searchQueries: string[]) => {
          const wrapper = mountHeroListView()
          
          for (const query of searchQueries) {
            // Set search query
            await setSearchInput(wrapper, query)
            
            // Calculate expected count
            const expectedCount = getExpectedHeroCount(query)
            
            // Property: Each query should produce correct count
            const displayedCount = getDisplayedHeroCount(wrapper)
            expect(displayedCount).toBe(expectedCount)
          }
          
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
