<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">
              Email or Mobile Number
            </label>
            <div class="mt-1">
              <input
                id="identifier"
                v-model="identifier"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="'Enter email or mobile number'"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
            {{ error }}
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Don't have an account?
                <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const identifier = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''
        
        // Clear any existing error messages
        error.value = ''
        
        // Debug: Check existing user data
        console.log('Checking local storage...')
        const existingUserIndex = localStorage.getItem('userIndex')
        console.log('Existing user index:', existingUserIndex)
        
        // Check if localStorage is available
        try {
          localStorage.setItem('test', 'test')
          localStorage.removeItem('test')
        } catch (e) {
          error.value = 'Local storage is not available. Please enable cookies and try again.'
          return
        }
        
        // Debug: Log login attempt
        console.log('Attempting login with:', { 
          identifier: identifier.value,
          passwordLength: password.value.length 
        })
        
        const userData = await userService.login(identifier.value, password.value)
        
        // Store user data in localStorage with explicit isAuthenticated flag
        const userDataToStore = {
          ...userData,
          isAuthenticated: true,  // Explicitly set authentication status
          role: userData.role || 'traveler'  // Ensure role is set, default to traveler
        }
        
        try {
          localStorage.setItem('userData', JSON.stringify(userDataToStore))
          console.log('Stored user data:', userDataToStore)
        } catch (e) {
          console.error('Error storing user data:', e)
          // Even if localStorage fails, we can continue since data is in IPFS
        }
        
        // Check if the data was reconstructed (partial data)
        if (userData.isReconstructed) {
          // We'll still redirect to profile, but show a warning
          error.value = 'Logged in with limited data. Some features may be unavailable.'
          
          // Set a timeout to redirect after showing the message
          setTimeout(() => {
            router.push('/profile')
          }, 2000)
        } else {
          // Redirect to profile page immediately for full data
          router.push('/profile')
        }
      } catch (err) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          error.value = 'Authentication failed. Please check your credentials.'
        } else if (err.message.includes('IPFS') || err.message.includes('Pinata')) {
          error.value = 'Unable to connect to storage service. Please try again later.'
        } else if (err.message.includes('User data not found')) {
          error.value = 'Account not found. Please check your email/mobile number or sign up for a new account.'
        } else if (err.message.includes('Invalid credentials')) {
          error.value = 'Incorrect email/mobile number or password. Please try again.'
          // Debug: Log more details about the error
          console.log('Login failed with:', {
            identifier: identifier.value,
            hasPassword: !!password.value,
            errorDetails: err.message
          })
        } else {
          error.value = err.message || 'Login failed. Please try again.'
        }
        console.error('Login error:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      identifier,
      password,
      loading,
      error,
      handleLogin
    }
  }
}
</script> 