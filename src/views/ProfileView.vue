<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold text-gray-900">My Cultural Journey</h1>
        <p class="mt-2 text-lg text-gray-600">Manage your profile and {{ user.userType === 'guide' ? 'guide services' : 'saved cultural experiences' }}</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Profile Section -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:p-6">
            <!-- User Type Display -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Account Type:</label>
              <div class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium" :class="user.userType === 'guide' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ user.userType === 'guide' ? 'Local Guide' : 'Traveler' }}
              </div>
            </div>

            <div class="flex items-center">
              <div class="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-bold text-gray-900">{{ user.name || 'Your Name' }}</h2>
                <p class="text-sm text-gray-500">{{ user.email || 'your.email@example.com' }}</p>
              </div>
            </div>

            <div class="mt-6 border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Profile Information</h3>
                <button @click="editProfile = !editProfile" class="text-sm text-indigo-600 hover:text-indigo-900">
                  {{ editProfile ? 'Cancel' : 'Edit' }}
                </button>
              </div>

              <div v-if="!editProfile" class="mt-4 space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Location</p>
                  <p class="mt-1 text-sm text-gray-900">{{ user.location }}</p>
                </div>
                
                <!-- Traveler-specific display -->
                <div v-if="user.userType === 'traveler'">
                  <p class="text-sm font-medium text-gray-500">Travel Preferences</p>
                  <div class="mt-1 flex flex-wrap gap-2">
                    <span v-for="preference in user.preferences" :key="preference" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {{ preference }}
                    </span>
                  </div>
                </div>

                <!-- Guide-specific display -->
                <div v-if="user.userType === 'guide'">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Specialties</p>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <span v-for="specialty in user.specialties" :key="specialty" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {{ specialty }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Languages</p>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <span v-for="language in user.languages" :key="language" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {{ language }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Experience</p>
                    <p class="mt-1 text-sm text-gray-900">{{ user.experience }} years</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Rate</p>
                    <p class="mt-1 text-sm text-gray-900">{{ user.rate }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Availability</p>
                    <p class="mt-1 text-sm text-gray-900">{{ user.availability ? 'Available for bookings' : 'Not available' }}</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-500">About</p>
                  <p class="mt-1 text-sm text-gray-900">{{ user.about }}</p>
                </div>
              </div>

              <form v-else @submit.prevent="saveProfile" class="mt-4 space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" v-model="editedUser.name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" v-model="editedUser.email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" id="location" v-model="editedUser.location" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <!-- Traveler-specific fields -->
                <div v-if="user.userType === 'traveler'">
                  <label class="block text-sm font-medium text-gray-700">Travel Preferences</label>
                  <div class="mt-2 grid grid-cols-2 gap-2">
                    <div v-for="(preference, index) in allPreferences" :key="index" class="flex items-center">
                      <input :id="`preference-${index}`" type="checkbox" v-model="editedUser.preferences" :value="preference" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                      <label :for="`preference-${index}`" class="ml-2 block text-sm text-gray-900">{{ preference }}</label>
                    </div>
                  </div>
                </div>

                <!-- Guide-specific fields -->
                <div v-if="user.userType === 'guide'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Specialties</label>
                    <div class="mt-2 grid grid-cols-2 gap-2">
                      <div v-for="(specialty, index) in allSpecialties" :key="index" class="flex items-center">
                        <input :id="`specialty-${index}`" type="checkbox" v-model="editedUser.specialties" :value="specialty" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label :for="`specialty-${index}`" class="ml-2 block text-sm text-gray-900">{{ specialty }}</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Languages</label>
                    <div class="mt-2 grid grid-cols-2 gap-2">
                      <div v-for="(language, index) in allLanguages" :key="index" class="flex items-center">
                        <input :id="`language-${index}`" type="checkbox" v-model="editedUser.languages" :value="language" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label :for="`language-${index}`" class="ml-2 block text-sm text-gray-900">{{ language }}</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="experience" class="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <input type="number" id="experience" v-model="editedUser.experience" min="0" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>

                  <div>
                    <label for="rate" class="block text-sm font-medium text-gray-700">Rate (per day)</label>
                    <input type="text" id="rate" v-model="editedUser.rate" placeholder="e.g. ₹2000/day" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Availability</label>
                    <div class="mt-2">
                      <label class="inline-flex items-center">
                        <input type="checkbox" v-model="editedUser.availability" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <span class="ml-2 text-sm text-gray-900">Available for bookings</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label for="certifications" class="block text-sm font-medium text-gray-700">Certifications</label>
                    <textarea id="certifications" v-model="editedUser.certifications" rows="2" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="List your relevant certifications"></textarea>
                  </div>
                </div>

                <div>
                  <label for="about" class="block text-sm font-medium text-gray-700">About</label>
                  <textarea id="about" v-model="editedUser.about" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>

                <div class="flex justify-end">
                  <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section (Saved Itineraries for Travelers / Bookings for Guides) -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ user.userType === 'guide' ? 'My Bookings' : 'Saved Itineraries' }}
            </h3>
            <router-link 
              :to="user.userType === 'guide' ? '/guides' : '/itinerary'" 
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ user.userType === 'guide' ? 'Update Availability' : 'Create New' }}
            </router-link>
          </div>
          <div class="border-t border-gray-200">
            <div v-if="savedItineraries.length === 0" class="px-4 py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No saved itineraries</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating a new cultural journey.</p>
              <div class="mt-6">
                <router-link to="/itinerary" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Itinerary
                </router-link>
              </div>
            </div>

            <ul v-else role="list" class="divide-y divide-gray-200">
              <li v-for="itinerary in savedItineraries" :key="itinerary.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-indigo-600">{{ itinerary.name }}</div>
                      <div class="text-sm text-gray-500">{{ itinerary.destination }} • {{ itinerary.duration }} days</div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="viewItinerary(itinerary)" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View
                    </button>
                    <button @click="deleteItinerary(itinerary.id)" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Delete
                    </button>
                  </div>
                </div>
                <div class="mt-2">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="interest in itinerary.interests" :key="interest" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {{ interest }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Itinerary Details Modal -->
        <div v-if="selectedItinerary" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="selectedItinerary = null"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ selectedItinerary.name }}
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">{{ selectedItinerary.destination }} • {{ selectedItinerary.duration }} days</p>
                      <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-900">Itinerary Details</h4>
                        <div class="mt-2 space-y-4">
                          <div v-for="(day, index) in selectedItinerary.days" :key="index" class="border-l-2 border-indigo-200 pl-4 py-2">
                            <div class="text-sm font-medium text-gray-900">Day {{ index + 1 }}</div>
                            <div class="mt-1 text-sm text-gray-500">{{ day.description }}</div>
                            <ul class="mt-2 space-y-2">
                              <li v-for="(activity, actIndex) in day.activities" :key="actIndex" class="text-sm text-gray-600 flex items-start">
                                <span class="h-5 w-5 text-indigo-500 mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                  </svg>
                                </span>
                                {{ activity }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-900">Notes</h4>
                        <p class="mt-1 text-sm text-gray-500">{{ selectedItinerary.notes || 'No notes added.' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" @click="selectedItinerary = null" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { fetchFromPinata } from '../utils/pinata'

// Load user data from localStorage
const loadUserData = () => {
  try {
    const storedData = localStorage.getItem('userData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      return {
        userType: parsedData.role || 'traveler', // Use role from userData
        name: parsedData.name || '',
        email: parsedData.email || '',
        mobile: parsedData.mobile || '',
        location: '',
        preferences: [],
        about: '',
        specialties: [],
        languages: [],
        experience: 0,
        rate: '',
        availability: true,
        certifications: []
      }
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
  return {
    userType: 'traveler',
    name: '',
    email: '',
    location: '',
    preferences: [],
    about: '',
    specialties: [],
    languages: [],
    experience: 0,
    rate: '',
    availability: true,
    certifications: []
  }
}

// User profile data
const user = reactive(loadUserData())

// Load user profile from localStorage
function loadUserProfile() {
  try {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      // Preserve the userType from userData
      const userType = user.userType
      Object.assign(user, parsedProfile)
      user.userType = userType // Ensure userType isn't overwritten
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

const editProfile = ref(false)
const editedUser = reactive({ ...user })
const savedItineraries = ref([])

const allPreferences = [
  'Historical Sites',
  'Local Cuisine',
  'Cultural Festivals',
  'Arts & Crafts',
  'Religious Sites',
  'Traditional Music',
  'Dance Forms',
  'Architecture',
  'Rural Life',
  'Photography'
]

const allSpecialties = [
  'Historical Sites',
  'Food & Culinary',
  'Religious Traditions',
  'Arts & Culture',
  'Nature & Wildlife',
  'Yoga & Spirituality',
  'Architecture',
  'Local Experiences',
  'Photography Tours',
  'Adventure Activities'
]

const allLanguages = [
  'English',
  'Hindi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Punjabi',
  'Sanskrit',
  'Gujarati',
  'Kannada'
]

function saveProfile() {
  Object.assign(user, editedUser)
  
  // Save to localStorage
  try {
    localStorage.setItem('userProfile', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving user profile:', error)
  }
  
  editProfile.value = false
}

// Load saved itineraries from localStorage and IPFS
async function loadSavedItineraries() {
  try {
    const saved = localStorage.getItem('savedItineraries')
    if (saved) {
      const parsedItineraries = JSON.parse(saved)
      savedItineraries.value = parsedItineraries

      // Load full details from IPFS for each itinerary that has an IPFS hash
      for (let i = 0; i < savedItineraries.value.length; i++) {
        const itinerary = savedItineraries.value[i]
        if (itinerary.ipfsHash) {
          try {
            const ipfsData = await fetchFromPinata(itinerary.ipfsHash)
            // Merge IPFS data with existing data, preserving the ID
            savedItineraries.value[i] = { ...ipfsData, id: itinerary.id }
          } catch (error) {
            console.error(`Error loading itinerary ${itinerary.id} from IPFS:`, error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading saved itineraries:', error)
    savedItineraries.value = [] // Reset to empty array on error
  }
}

// Call the functions when component is mounted
onMounted(() => {
  loadUserProfile()
  loadSavedItineraries()
})

const selectedItinerary = ref(null)

function viewItinerary(itinerary) {
  selectedItinerary.value = itinerary
}

// Function to delete itinerary
async function deleteItinerary(id) {
  if (confirm('Are you sure you want to delete this itinerary?')) {
    const itineraryToDelete = savedItineraries.value.find(item => item.id === id)
    savedItineraries.value = savedItineraries.value.filter(item => item.id !== id)
    
    // Update localStorage
    try {
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries.value))
      
      // If the deleted itinerary is currently selected, close the modal
      if (selectedItinerary.value && selectedItinerary.value.id === id) {
        selectedItinerary.value = null
      }

      // Note: We can't delete from IPFS as it's immutable, but we remove the reference
      console.log('Itinerary deleted. Note: IPFS hash', itineraryToDelete?.ipfsHash, 'remains in IPFS')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      alert('Failed to delete itinerary. Please try again.')
    }
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.input-field {
  @apply mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}
</style> 