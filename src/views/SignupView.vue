<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Join our community of travelers and local guides
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSignup">
          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">I want to join as:</label>
            <div class="flex space-x-4">
              <button 
                type="button"
                @click="formData.role = 'traveler'"
                class="flex-1 py-2 px-4 rounded-md text-sm font-medium border"
                :class="formData.role === 'traveler' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
              >
                Traveler
              </button>
              <button 
                type="button"
                @click="formData.role = 'guide'"
                class="flex-1 py-2 px-4 rounded-md text-sm font-medium border"
                :class="formData.role === 'guide' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
              >
                Local Guide
              </button>
            </div>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Email or Mobile -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">Email or Mobile Number</label>
            <div class="mt-1">
              <input
                id="identifier"
                v-model="formData.identifier"
                type="text"
                required
                placeholder="Enter email or 10-digit mobile number"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
            <p class="mt-1 text-sm text-gray-500">Enter either your email address or 10-digit mobile number</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                minlength="6"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div class="mt-6">
            <router-link
              to="/login"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

const router = useRouter()

const formData = reactive({
  role: 'traveler',
  name: '',
  identifier: '',
  password: '',
  confirmPassword: ''
})

const handleSignup = async () => {
  try {
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Validate identifier (email or mobile)
    const isMobile = /^[0-9]{10}$/.test(formData.identifier)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)

    if (!isMobile && !isEmail) {
      alert('Please enter a valid email address or 10-digit mobile number')
      return
    }

    // Prepare user data
    const userData = {
      role: formData.role,
      name: formData.name,
      password: formData.password
    }

    // Set email and mobile based on identifier type
    if (isEmail) {
      userData.email = formData.identifier
      userData.mobile = ''
    } else {
      userData.mobile = formData.identifier
      userData.email = ''
    }

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent
    submitButton.textContent = 'Signing up...'
    submitButton.disabled = true

    try {
      // Sign up user
      const response = await userService.signup(userData)
      
      // Successful signup
      alert('Account created successfully! Please log in.')
      router.push('/login')
    } catch (error) {
      console.error('Signup error:', error)
      alert(error.message || 'Error during signup. Please try again.')
    } finally {
      // Reset button state
      submitButton.textContent = originalText
      submitButton.disabled = false
    }
  } catch (error) {
    console.error('Form error:', error)
    alert(error.message)
  }
}
</script> 