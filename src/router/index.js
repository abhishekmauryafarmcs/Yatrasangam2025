import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItineraryView from '../views/ItineraryView.vue'
import GuidesView from '../views/GuidesView.vue'
import CultureView from '../views/CultureView.vue'
import ProfileView from '../views/ProfileView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'

// Navigation guard to check authentication
const requireAuth = (to, from, next) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  
  if (!userData.isAuthenticated && to.name !== 'home' && to.name !== 'signup' && to.name !== 'login' && to.name !== 'privacy-policy') {
    next({ name: 'login' })
  } else {
    next()
  }
}

// Navigation guard to check user role for travelers
const requireTraveler = (to, from, next) => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    console.log('Navigation Guard - User Data:', {
      isAuthenticated: userData.isAuthenticated,
      role: userData.role,
      name: userData.name
    })
    
    // If no role is specified, default to traveler
    if (userData && userData.isAuthenticated === true) {
      if (!userData.role || userData.role === 'traveler') {
        next()
        return
      }
    }
    
    console.log('Access denied: Not authenticated or not a traveler')
    // Redirect to login if not authenticated, home if authenticated but wrong role
    next(userData.isAuthenticated ? { name: 'home' } : { name: 'login' })
  } catch (error) {
    console.error('Error in requireTraveler guard:', error)
    next({ name: 'login' })
  }
}

// Navigation guard to check user role for guides
const requireGuide = (to, from, next) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  
  if (userData.role === 'guide' && userData.isAuthenticated) {
    next()
  } else {
    next({ name: 'home' })
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/itinerary',
      name: 'itinerary',
      component: ItineraryView,
      beforeEnter: requireTraveler
    },
    {
      path: '/guides',
      name: 'guides',
      component: GuidesView,
      beforeEnter: requireAuth
    },
    {
      path: '/culture',
      name: 'culture',
      component: CultureView,
      beforeEnter: requireTraveler
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: requireAuth
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router 