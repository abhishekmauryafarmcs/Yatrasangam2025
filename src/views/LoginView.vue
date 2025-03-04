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
        
        const userData = await userService.login(identifier.value, password.value)
        localStorage.setItem('userData', JSON.stringify(userData))
        
        // Redirect to profile page
        router.push('/profile')
      } catch (err) {
        // Display specific error message from the service if available
        error.value = err.message || 'Login failed. Please try again.'
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