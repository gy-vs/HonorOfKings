/**
 * Version Store Tests
 * 
 * Tests for the version store including state management, actions, and getters
 * Requirements: 1.5, 6.2, 6.3, 6.4
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVersionStore } from './version'
import type { VersionFilter } from '@/types'

describe('Version Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should have empty versions array initially', () => {
      const store = useVersionStore()
      expect(store.versions).toEqual([])
    })

    it('should have null current version initially', () => {
      const store = useVersionStore()
      expect(store.currentVersion).toBeNull()
    })

    it('should have empty filtered versions initially', () => {
      const store = useVersionStore()
      expect(store.filteredVersions).toEqual([])
    })

    it('should have empty filter state initially', () => {
      const store = useVersionStore()
      expect(store.filterState).toEqual({})
    })

    it('should not be loading initially', () => {
      const store = useVersionStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have no error initially', () => {
      const store = useVersionStore()
      expect(store.error).toBeNull()
    })
  })

  describe('loadVersions Action', () => {
    it('should load versions from mock data', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      expect(store.versions.length).toBeGreaterThan(0)
      expect(store.isLoading).toBe(false)
    })

    it('should set current version to active version', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      expect(store.currentVersion).not.toBeNull()
      expect(store.currentVersion?.status).toBe('active')
    })

    it('should initialize filtered versions with all versions', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      expect(store.filteredVersions.length).toBe(store.versions.length)
    })

    it('should clear error on successful load', () => {
      const store = useVersionStore()
      store.error = 'Previous error'
      store.loadVersions()
      
      expect(store.error).toBeNull()
    })
  })

  describe('setCurrentVersion Action', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('should set current version by ID', () => {
      const store = useVersionStore()
      const targetVersion = store.versions[0]
      
      store.setCurrentVersion(targetVersion.id)
      
      expect(store.currentVersion?.id).toBe(targetVersion.id)
    })

    it('should not change current version if ID not found', () => {
      const store = useVersionStore()
      const originalVersion = store.currentVersion
      
      store.setCurrentVersion('non-existent-id')
      
      expect(store.currentVersion).toBe(originalVersion)
    })
  })

  describe('applyFilter Action', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('should filter by version number', () => {
      const store = useVersionStore()
      const filter: VersionFilter = { versionNumber: '2.0' }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions.every(v => 
        v.versionNumber.includes('2.0')
      )).toBe(true)
    })

    it('should filter by start date', () => {
      const store = useVersionStore()
      const startDate = new Date('2024-06-01')
      const filter: VersionFilter = { startDate }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions.every(v => 
        new Date(v.releaseDate) >= startDate
      )).toBe(true)
    })

    it('should filter by end date', () => {
      const store = useVersionStore()
      const endDate = new Date('2024-06-30')
      const filter: VersionFilter = { endDate }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions.every(v => 
        new Date(v.releaseDate) <= endDate
      )).toBe(true)
    })

    it('should filter by both start and end date', () => {
      const store = useVersionStore()
      const startDate = new Date('2024-06-01')
      const endDate = new Date('2024-08-31')
      const filter: VersionFilter = { startDate, endDate }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions.every(v => {
        const vDate = new Date(v.releaseDate)
        return vDate >= startDate && vDate <= endDate
      })).toBe(true)
    })

    it('should combine version number and date filters', () => {
      const store = useVersionStore()
      const filter: VersionFilter = {
        versionNumber: '1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30')
      }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions.every(v => {
        const vDate = new Date(v.releaseDate)
        return v.versionNumber.includes('1') &&
               vDate >= new Date('2024-01-01') &&
               vDate <= new Date('2024-06-30')
      })).toBe(true)
    })

    it('should update filter state', () => {
      const store = useVersionStore()
      const filter: VersionFilter = { versionNumber: '2.0' }
      
      store.applyFilter(filter)
      
      expect(store.filterState).toEqual(filter)
    })

    it('should return empty list when no versions match filter', () => {
      const store = useVersionStore()
      const filter: VersionFilter = { versionNumber: 'non-existent' }
      
      store.applyFilter(filter)
      
      expect(store.filteredVersions).toEqual([])
    })
  })

  describe('clearFilter Action', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('should reset filter state', () => {
      const store = useVersionStore()
      store.applyFilter({ versionNumber: '2.0' })
      
      store.clearFilter()
      
      expect(store.filterState).toEqual({})
    })

    it('should restore all versions to filtered list', () => {
      const store = useVersionStore()
      const originalCount = store.versions.length
      store.applyFilter({ versionNumber: '2.0' })
      
      store.clearFilter()
      
      expect(store.filteredVersions.length).toBe(originalCount)
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('getCurrentVersion should return current version', () => {
      const store = useVersionStore()
      
      expect(store.getCurrentVersion).toBe(store.currentVersion)
    })

    it('getFilteredVersions should return versions sorted by date descending', () => {
      const store = useVersionStore()
      const filtered = store.getFilteredVersions
      
      for (let i = 0; i < filtered.length - 1; i++) {
        const current = new Date(filtered[i].releaseDate).getTime()
        const next = new Date(filtered[i + 1].releaseDate).getTime()
        expect(current).toBeGreaterThanOrEqual(next)
      }
    })

    it('getVersionCount should return total version count', () => {
      const store = useVersionStore()
      
      expect(store.getVersionCount).toBe(store.versions.length)
    })

    it('getFilteredVersionCount should return filtered version count', () => {
      const store = useVersionStore()
      store.applyFilter({ versionNumber: '2.0' })
      
      expect(store.getFilteredVersionCount).toBe(store.filteredVersions.length)
    })

    it('hasActiveFilter should return false when no filter applied', () => {
      const store = useVersionStore()
      
      expect(store.hasActiveFilter).toBe(false)
    })

    it('hasActiveFilter should return true when filter applied', () => {
      const store = useVersionStore()
      store.applyFilter({ versionNumber: '2.0' })
      
      expect(store.hasActiveFilter).toBe(true)
    })
  })

  describe('getVersionById Method', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('should return version by ID', () => {
      const store = useVersionStore()
      const targetVersion = store.versions[0]
      
      const result = store.getVersionById(targetVersion.id)
      
      expect(result).toEqual(targetVersion)
    })

    it('should return undefined for non-existent ID', () => {
      const store = useVersionStore()
      
      const result = store.getVersionById('non-existent-id')
      
      expect(result).toBeUndefined()
    })
  })

  describe('getVersionsByStatus Method', () => {
    beforeEach(() => {
      const store = useVersionStore()
      store.loadVersions()
    })

    it('should return all versions with specified status', () => {
      const store = useVersionStore()
      
      const activeVersions = store.getVersionsByStatus('active')
      
      expect(activeVersions.every(v => v.status === 'active')).toBe(true)
    })

    it('should return empty array for non-existent status', () => {
      const store = useVersionStore()
      
      const result = store.getVersionsByStatus('non-existent')
      
      expect(result).toEqual([])
    })
  })

  describe('clearError Method', () => {
    it('should clear error state', () => {
      const store = useVersionStore()
      store.error = 'Some error'
      
      store.clearError()
      
      expect(store.error).toBeNull()
    })
  })

  describe('Cache Functionality', () => {
    it('should initialize cache timestamp as null', () => {
      const store = useVersionStore()
      
      expect(store.cacheTimestamp).toBeNull()
    })

    it('should initialize cache stats with zeros', () => {
      const store = useVersionStore()
      
      expect(store.cacheStats.hits).toBe(0)
      expect(store.cacheStats.misses).toBe(0)
      expect(store.cacheStats.invalidations).toBe(0)
    })

    it('should set cache timestamp after loading versions', () => {
      const store = useVersionStore()
      const beforeLoad = Date.now()
      
      store.loadVersions()
      
      const afterLoad = Date.now()
      expect(store.cacheTimestamp).not.toBeNull()
      expect(store.cacheTimestamp!).toBeGreaterThanOrEqual(beforeLoad)
      expect(store.cacheTimestamp!).toBeLessThanOrEqual(afterLoad)
    })

    it('should return true for isCacheValid when cache is fresh', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      expect(store.isCacheValid()).toBe(true)
    })

    it('should return false for isCacheValid when cache timestamp is null', () => {
      const store = useVersionStore()
      
      expect(store.isCacheValid()).toBe(false)
    })

    it('should return false for isCacheValid when versions are empty', () => {
      const store = useVersionStore()
      store.cacheTimestamp = Date.now()
      
      expect(store.isCacheValid()).toBe(false)
    })

    it('should use cache on second loadVersions call', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      const firstLoadStats = store.cacheStats.misses
      store.loadVersions()
      
      expect(store.cacheStats.hits).toBe(1)
      expect(store.cacheStats.misses).toBe(firstLoadStats)
    })

    it('should record cache miss on first load', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      expect(store.cacheStats.misses).toBe(1)
    })

    it('should invalidate cache manually', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      store.invalidateCache()
      
      expect(store.cacheTimestamp).toBeNull()
      expect(store.cacheStats.invalidations).toBe(1)
    })

    it('should reload data after cache invalidation', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      const firstLoadCount = store.versions.length
      store.invalidateCache()
      store.loadVersions()
      
      expect(store.versions.length).toBe(firstLoadCount)
      expect(store.cacheStats.misses).toBe(2)
    })

    it('should provide cache statistics', () => {
      const store = useVersionStore()
      store.loadVersions()
      store.loadVersions()
      
      const stats = store.getCacheStats()
      
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
      expect(stats.invalidations).toBe(0)
      expect(stats.hitRate).toBe('50.00%')
      expect(stats.cacheValid).toBe(true)
      expect(stats.cacheAge).not.toBeNull()
    })

    it('should calculate hit rate correctly', () => {
      const store = useVersionStore()
      store.loadVersions()
      store.loadVersions()
      store.loadVersions()
      
      const stats = store.getCacheStats()
      
      expect(stats.hitRate).toBe('66.67%')
    })

    it('should show N/A hit rate when no loads have occurred', () => {
      const store = useVersionStore()
      
      const stats = store.getCacheStats()
      
      expect(stats.hitRate).toBe('N/A%')
    })

    it('should not reload data if cache is valid', () => {
      const store = useVersionStore()
      store.loadVersions()
      
      const originalVersions = store.versions
      store.loadVersions()
      
      expect(store.versions).toBe(originalVersions)
    })
  })
})
