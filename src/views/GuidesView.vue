<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Connect with Expert Local Guides in India</h1>
      <p class="mt-2 text-lg text-gray-600">Find knowledgeable guides who will introduce you to authentic cultural experiences</p>
    </div>

    <!-- Filters Section -->
    <div class="mt-8 bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Find Your Perfect Guide</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Location Filter -->
        <div>
          <label for="location" class="form-label">Location</label>
          <select
            id="location"
            v-model="filters.location"
            class="input-field"
          >
            <option value="">All Locations</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>

        <!-- Specialty Filter -->
        <div>
          <label for="specialty" class="form-label">Expertise</label>
          <select
            id="specialty"
            v-model="filters.specialty"
            class="input-field"
          >
            <option value="">All Specialties</option>
            <option v-for="specialty in specialties" :key="specialty" :value="specialty">
              {{ specialty }}
            </option>
          </select>
        </div>

        <!-- Language Filter -->
        <div>
          <label for="language" class="form-label">Language</label>
          <select
            id="language"
            v-model="filters.language"
            class="input-field"
          >
            <option value="">All Languages</option>
            <option v-for="language in languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Guide Listing Section -->
    <div class="mt-8">
      <div v-if="filteredGuides.length === 0" class="bg-white rounded-lg shadow py-12 px-6 text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-medium text-gray-900">No guides match your filters</h3>
        <p class="mt-2 text-gray-500">Try adjusting your search criteria to find more guides.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="guide in filteredGuides" :key="guide.id" class="bg-white shadow rounded-lg overflow-hidden transition transform hover:shadow-lg hover:-translate-y-1">
          <!-- Guide Profile Card -->
          <div class="relative">
            <div class="h-52 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <img :src="guide.photo" :alt="guide.name" class="h-full w-full object-cover">
            </div>
            <div class="absolute top-4 right-4">
              <span v-if="guide.available" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available Now
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Scheduled Only
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ guide.name }}</h3>
                <p class="text-sm text-gray-500">{{ guide.location }}</p>
              </div>
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="text-gray-700 font-medium">{{ guide.rating }}</span>
                <span class="text-gray-500 text-sm ml-1">({{ guide.reviews }})</span>
              </div>
            </div>
            
            <!-- Expertise Tags -->
            <div class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="specialty in guide.specialties"
                  :key="specialty"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ specialty }}
                </span>
              </div>
            </div>
            
            <!-- Languages -->
            <div class="mt-3 flex items-center text-sm text-gray-500">
              <span class="font-medium mr-2">Languages:</span>
              <span>{{ guide.languages.join(', ') }}</span>
            </div>
            
            <!-- Bio -->
            <p class="mt-4 text-sm text-gray-600">{{ guide.bio }}</p>
            
            <!-- Experience & Credentials -->
            <div class="mt-4 flex items-start text-sm">
              <div class="flex-shrink-0 h-5 w-5 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span class="ml-2">{{ guide.experience }} years experience as a guide</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-6 flex space-x-3">
              <button @click="showBookingModal(guide)" class="flex-1 btn-primary">
                Book a Session
              </button>
              <button @click="startChat(guide)" class="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <svg class="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                </svg>
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Booking Modal -->
    <div v-if="selectedGuide" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="selectedGuide = null"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Book a Session with {{ selectedGuide.name }}
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="bookGuide" class="space-y-4">
                    <div>
                      <label for="booking-date" class="form-label">Date</label>
                      <input type="date" id="booking-date" v-model="bookingForm.date" class="input-field" required>
                    </div>
                    <div>
                      <label for="booking-time" class="form-label">Time</label>
                      <select id="booking-time" v-model="bookingForm.time" class="input-field" required>
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label for="booking-duration" class="form-label">Duration</label>
                      <select id="booking-duration" v-model="bookingForm.duration" class="input-field" required>
                        <option value="2">2 hours</option>
                        <option value="4">Half day (4 hours)</option>
                        <option value="8">Full day (8 hours)</option>
                      </select>
                    </div>
                    <div>
                      <label for="booking-notes" class="form-label">Special requests or questions</label>
                      <textarea id="booking-notes" v-model="bookingForm.notes" rows="3" class="input-field"></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="bookGuide" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
              Request Booking
            </button>
            <button type="button" @click="selectedGuide = null" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat Modal -->
    <div v-if="chatGuide" class="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-40">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      
      <div class="bg-white rounded-t-lg sm:rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:h-auto h-96 relative z-50">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0">
              <img :src="chatGuide.photo" :alt="chatGuide.name" class="h-full w-full object-cover">
            </div>
            <div class="ml-3">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ chatGuide.name }}
              </h3>
              <div class="flex items-center">
                <div class="h-2 w-2 rounded-full bg-green-400"></div>
                <span class="ml-1 text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <button @click="chatGuide = null" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span class="sr-only">Close chat</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="px-4 py-3 h-64 overflow-y-auto">
          <div class="space-y-4">
            <!-- Messages -->
            <div class="flex items-end">
              <div class="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-indigo-500 text-white">Hello! I'm interested in your guided tours. What can you tell me about your expertise in this region?</span></div>
              </div>
            </div>
            <div class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-200 text-gray-800">Namaste! Thank you for your interest. I've been a guide in {{ chatGuide.location }} for {{ chatGuide.experience }} years and specialize in {{ chatGuide.specialties.join(' and ') }}. I'd be happy to show you the authentic cultural experiences here!</span></div>
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-200 text-gray-800">Do you have specific dates in mind for your visit?</span></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-4 py-3 border-t flex">
          <input type="text" placeholder="Type your message..." class="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md">
          <button class="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const locations = [
  'Agra', 'Jaipur', 'Varanasi', 'Delhi', 'Mumbai', 
  'Udaipur', 'Goa', 'Kerala', 'Amritsar', 'Rishikesh'
]

const specialties = [
  'Historical Sites', 'Food & Culinary', 'Arts & Crafts', 
  'Religious Traditions', 'Local Life', 'Photography', 
  'Architecture', 'Yoga & Spirituality', 'Nature & Wildlife'
]

const languages = [
  'English', 'Hindi', 'Bengali', 'Tamil', 
  'Telugu', 'Malayalam', 'Marathi', 'Punjabi'
]

const filters = reactive({
  location: '',
  specialty: '',
  language: ''
})

// Sample guide data for different Indian destinations
const guides = [
  {
    id: 1,
    name: 'Rajat Sharma',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Agra',
    specialties: ['Historical Sites', 'Architecture'],
    languages: ['Hindi', 'English'],
    rating: 4.9,
    reviews: 127,
    experience: 8,
    bio: 'I\'m a certified guide with expertise in Mughal history and architecture. Having grown up in Agra, I can share hidden stories of the Taj Mahal and other monuments.',
    available: true
  },
  {
    id: 2,
    name: 'Priya Patel',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Jaipur',
    specialties: ['Arts & Crafts', 'Local Life'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    rating: 4.8,
    reviews: 93,
    experience: 6,
    bio: 'As a local artisan\'s daughter, I specialize in traditional Rajasthani crafts. I\'ll take you to authentic workshops and help you understand the rich artistic heritage.',
    available: false
  },
  {
    id: 3,
    name: 'Arjun Das',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    location: 'Varanasi',
    specialties: ['Religious Traditions', 'Local Life'],
    languages: ['Hindi', 'English', 'Bengali'],
    rating: 4.7,
    reviews: 78,
    experience: 12,
    bio: 'I\'ve been guiding spiritual journeys along the Ganges for over a decade. Let me show you the authentic rituals and ceremonies that make Varanasi sacred.',
    available: true
  },
  {
    id: 4,
    name: 'Anjali Mehta',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    location: 'Mumbai',
    specialties: ['Food & Culinary', 'Local Life'],
    languages: ['Hindi', 'English', 'Marathi'],
    rating: 4.9,
    reviews: 156,
    experience: 5,
    bio: 'As a food blogger turned guide, I\'ll take you on a culinary adventure through Mumbai\'s diverse neighborhoods, from street food to hidden restaurants.',
    available: true
  },
  {
    id: 5,
    name: 'Vikram Singh',
    photo: 'https://randomuser.me/api/portraits/men/78.jpg',
    location: 'Udaipur',
    specialties: ['Historical Sites', 'Architecture', 'Photography'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    rating: 4.8,
    reviews: 112,
    experience: 9,
    bio: 'With my background in photography and history, I\'ll help you discover the best views and angles of Udaipur\'s palaces while sharing fascinating royal stories.',
    available: false
  },
  {
    id: 6,
    name: 'Meera Thomas',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    location: 'Kerala',
    specialties: ['Nature & Wildlife', 'Food & Culinary'],
    languages: ['English', 'Malayalam', 'Tamil'],
    rating: 4.9,
    reviews: 89,
    experience: 7,
    bio: 'Born and raised in Kerala, I specialize in backwater tours and authentic local cuisine. My tours include visits to spice plantations and cooking demonstrations.',
    available: true
  },
  {
    id: 7,
    name: 'Sanjay Gupta',
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    location: 'Delhi',
    specialties: ['Historical Sites', 'Food & Culinary'],
    languages: ['Hindi', 'English', 'Punjabi'],
    rating: 4.7,
    reviews: 203,
    experience: 11,
    bio: 'As a historian and foodie, I combine Delhi\'s magnificent monuments with its incredible street food scene for a complete cultural experience.',
    available: true
  },
  {
    id: 8,
    name: 'Lakshmi Krishnan',
    photo: 'https://randomuser.me/api/portraits/women/79.jpg',
    location: 'Rishikesh',
    specialties: ['Yoga & Spirituality', 'Nature & Wildlife'],
    languages: ['Hindi', 'English', 'Sanskrit'],
    rating: 4.9,
    reviews: 67,
    experience: 10,
    bio: 'Certified yoga instructor and spiritual guide with deep knowledge of Vedic traditions. My tours include meditation sessions by the Ganges and visits to ashrams.',
    available: true
  },
  {
    id: 9,
    name: 'Gurpreet Kaur',
    photo: 'https://randomuser.me/api/portraits/women/62.jpg',
    location: 'Amritsar',
    specialties: ['Religious Traditions', 'Food & Culinary'],
    languages: ['Punjabi', 'Hindi', 'English'],
    rating: 4.8,
    reviews: 72,
    experience: 6,
    bio: 'I offer insightful tours of the Golden Temple and Punjabi cultural experiences. Join me to learn about Sikh traditions and enjoy authentic Amritsari cuisine.',
    available: false
  }
]

const filteredGuides = computed(() => {
  return guides.filter(guide => {
    if (filters.location && guide.location !== filters.location) return false
    if (filters.specialty && !guide.specialties.includes(filters.specialty)) return false
    if (filters.language && !guide.languages.includes(filters.language)) return false
    return true
  })
})

// Booking functionality
const selectedGuide = ref(null)
const bookingForm = reactive({
  date: '',
  time: '',
  duration: '4',
  notes: ''
})

const showBookingModal = (guide) => {
  selectedGuide.value = guide
  // Reset form
  bookingForm.date = ''
  bookingForm.time = ''
  bookingForm.duration = '4'
  bookingForm.notes = ''
}

const bookGuide = () => {
  // In a real app, this would send the booking to a backend service
  alert(`Booking request sent to ${selectedGuide.value.name}! They will contact you shortly to confirm.`)
  selectedGuide.value = null
}

// Chat functionality
const chatGuide = ref(null)

const startChat = (guide) => {
  chatGuide.value = guide
}
</script> 