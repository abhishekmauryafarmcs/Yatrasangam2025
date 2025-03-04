<template>
  <div class="min-h-screen bg-gray-50">
    <SplashScreen v-if="showSplash" @complete="onSplashComplete" :duration="3000" />
    <template v-if="!showSplash">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <router-link to="/" class="flex items-center">
                <span class="text-xl font-bold text-indigo-600">YatraSangam</span>
              </router-link>
              <!-- Desktop Navigation -->
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <router-link
                  v-for="item in navigationItems"
                  :key="item.path"
                  v-show="item.show"
                  :to="item.path"
                  class="nav-link"
                  :class="{ 'router-link-active': $route.path === item.path }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>
            
            <div class="flex items-center">
              <!-- Show Sign Up/Login buttons when not authenticated -->
              <template v-if="!isAuthenticated">
                <router-link 
                  to="/login" 
                  class="inline-flex items-center px-4 py-2 mr-3 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Sign In
                </router-link>
                <router-link 
                  to="/signup" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </router-link>
              </template>

              <!-- Show profile when authenticated -->
              <div v-else class="flex items-center">
                <router-link 
                  to="/profile" 
                  class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                  :class="{ 'text-indigo-600': $route.path === '/profile' }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ userData.name || 'Profile' }}
                </router-link>
                <!-- Mobile menu button -->
                <button
                  v-if="isAuthenticated"
                  @click="isMobileMenuOpen = !isMobileMenuOpen"
                  type="button"
                  class="sm:hidden inline-flex items-center justify-center p-2 ml-4 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-controls="mobile-menu"
                  :aria-expanded="isMobileMenuOpen"
                >
                  <span class="sr-only">Open main menu</span>
                  <!-- Hamburger icon -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      v-if="!isMobileMenuOpen"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <!-- Desktop logout button -->
                <button 
                  @click="handleLogout"
                  class="hidden sm:inline-flex items-center px-4 py-2 ml-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          v-if="isAuthenticated"
          v-show="isMobileMenuOpen"
          class="sm:hidden"
          id="mobile-menu"
        >
          <div class="pt-2 pb-3 space-y-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              v-show="item.show"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.path === item.path,
                       'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700': $route.path !== item.path }"
              @click="isMobileMenuOpen = false"
            >
              {{ item.name }}
            </router-link>
            <!-- Mobile logout button -->
            <button 
              @click="handleLogout"
              class="w-full text-left mobile-nav-link border-transparent text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition>
          </router-view>
        </div>
      </main>
    </template>
  </div>
</template>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 pb-1 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-colors duration-200;
}

.nav-link.router-link-active {
  @apply border-indigo-500 text-indigo-600 border-b-2 font-semibold;
}

.nav-link:hover {
  @apply border-gray-300;
}

.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200;
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Add a favicon link */
</style>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import SplashScreen from './components/SplashScreen.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const userData = ref({})
const isMobileMenuOpen = ref(false)
const showSplash = ref(true)

// Function to handle splash screen completion
const onSplashComplete = () => {
  console.log('Splash screen completed');
  showSplash.value = false;
  // If not on home page, navigate to home
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
}

// Function to check authentication status
const checkAuth = () => {
  const storedUserData = localStorage.getItem('userData')
  if (storedUserData) {
    userData.value = JSON.parse(storedUserData)
    isAuthenticated.value = true
  } else {
    isAuthenticated.value = false
    userData.value = {}
  }
}

// Watch for changes in localStorage
window.addEventListener('storage', checkAuth)

// Watch for route changes to check auth status
watch(() => router.currentRoute.value.path, () => {
  checkAuth()
  // Close mobile menu when route changes
  isMobileMenuOpen.value = false
})

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('userData')
  isAuthenticated.value = false
  userData.value = {}
  isMobileMenuOpen.value = false
  router.push('/')
}

// Check authentication status on mount
onMounted(() => {
  checkAuth()
})

// Navigation items based on authentication
const navigationItems = computed(() => [
  { name: 'Home', path: '/', show: true },
  { name: 'Create Itinerary', path: '/itinerary', show: isAuthenticated.value && userData.value.role !== 'guide' },
  { name: 'Local Guides', path: '/guides', show: isAuthenticated.value },
  { name: 'Cultural Tips', path: '/culture', show: isAuthenticated.value },
])

// Add favicon dynamically
const favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.href = '/icons/yatrasangamlogo.png'
favicon.type = 'image/png'
document.head.appendChild(favicon)
</script> 