import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Route configuration for six pages
// Requirements: 7.1, 7.2 - Persistent navigation and route transitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { 
      title: '首页',
      transition: 'fade'
    }
  },
  {
    path: '/heroes',
    name: 'heroes',
    component: () => import('@/views/HeroListView.vue'),
    meta: { 
      title: '英雄列表',
      transition: 'fade'
    }
  },
  {
    path: '/heroes/:id',
    name: 'hero-detail',
    component: () => import('@/views/HeroDetailView.vue'),
    meta: { 
      title: '英雄详情',
      transition: 'slide-left',
      recordHistory: true  // Flag to indicate this route should record browsing history
    }
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('@/views/EquipmentView.vue'),
    meta: { 
      title: '装备列表',
      transition: 'fade'
    }
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/EventsView.vue'),
    meta: { 
      title: '赛事资讯',
      transition: 'fade'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { 
      title: '个人中心',
      transition: 'fade'
    }
  },
  {
    path: '/version-hub',
    name: 'version-hub',
    component: () => import('@/views/VersionHubView.vue'),
    meta: { 
      title: '版本中心',
      transition: 'fade'
    }
  },
  {
    path: '/version-hub/:id',
    name: 'version-detail',
    component: () => import('@/views/VersionDetailView.vue'),
    meta: { 
      title: '版本详情',
      transition: 'slide-left',
      recordHistory: true
    }
  },
  {
    // Catch-all route - redirect to home
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * Route Guard: Record browsing history
 * Requirements: 7.5 - Implement route guards to handle navigation logic
 * 
 * When navigating to hero-detail page, record the hero ID in browsing history
 */
function recordBrowsingHistory(to: RouteLocationNormalized): void {
  if (to.name === 'hero-detail' && to.params.id) {
    const heroId = Number(to.params.id)
    if (!isNaN(heroId) && heroId > 0) {
      const userStore = useUserStore()
      userStore.addHistory(heroId)
    }
  }
}

/**
 * Route Guard: Update document title
 * Requirements: 7.1 - Persistent navigation header on all pages
 */
function updateDocumentTitle(to: RouteLocationNormalized): void {
  const title = to.meta.title as string
  document.title = title ? `${title} - 王者荣耀` : '王者荣耀'
}

// Main navigation guard
// Requirements: 7.5 - Implement route guards to handle navigation logic
router.beforeEach((
  to: RouteLocationNormalized, 
  _from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  // Update document title
  updateDocumentTitle(to)
  
  // Record browsing history for hero detail pages
  if (to.meta.recordHistory) {
    recordBrowsingHistory(to)
  }
  
  next()
})

// After each navigation - can be used for analytics or other post-navigation tasks
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Log navigation for debugging (can be removed in production)
  if (import.meta.env.DEV) {
    console.log(`[Router] Navigated from ${from.path} to ${to.path}`)
  }
})

export default router
