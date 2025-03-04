<template>
  <div class="itinerary-view">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900">Create Your Cultural Journey in India</h1>
      <p class="mt-2 text-lg text-gray-600">Personalize your travel experience based on your cultural interests and preferences</p>
      
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow sm:rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Your Travel Preferences
              </h3>
              <form @submit.prevent="generateItinerary" class="mt-5 space-y-6">
                <div class="space-y-4">
                  <div>
                    <label for="state" class="form-label">
                      State in India
                    </label>
                    <select
                      id="state"
                      v-model="formData.state"
                      class="input-field"
                      required
                      @change="updateDistricts"
                    >
                      <option value="">Select a state</option>
                      <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                    </select>
                  </div>

                  <div>
                    <label for="destination" class="form-label">
                      District/City
                    </label>
                    <select
                      id="destination"
                      v-model="formData.destination"
                      class="input-field"
                      required
                      :disabled="!formData.state"
                    >
                      <option value="">Select a district/city</option>
                      <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="form-label">
                    Cultural Interests
                  </label>
                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="interest in culturalInterests" :key="interest.id" 
                         class="relative flex items-start p-4 border rounded-lg cursor-pointer"
                         :class="formData.selectedInterests.includes(interest.id) ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200 hover:bg-gray-50'"
                         @click="toggleInterest(interest.id)">
                      <div class="flex items-center h-5">
                        <input
                          :id="interest.id"
                          v-model="formData.selectedInterests"
                          :value="interest.id"
                          type="checkbox"
                          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        >
                      </div>
                      <div class="ml-3 text-sm">
                        <label :for="interest.id" class="font-medium text-gray-700">{{ interest.name }}</label>
                        <p class="text-gray-500">{{ interest.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="duration" class="form-label">
                      Trip Duration (days)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      v-model="formData.duration"
                      min="1"
                      max="30"
                      class="input-field"
                      required
                    >
                  </div>

                  <div>
                    <label for="language" class="form-label">
                      Preferred Language Support
                    </label>
                    <select
                      id="language"
                      v-model="formData.language"
                      class="input-field"
                    >
                      <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label for="travelStyle" class="form-label">Travel Style</label>
                  <div class="mt-2 flex space-x-4">
                    <span 
                      v-for="style in travelStyles" 
                      :key="style.id"
                      @click="formData.travelStyle = style.id"
                      class="px-4 py-2 rounded-full text-sm cursor-pointer"
                      :class="formData.travelStyle === style.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                    >
                      {{ style.name }}
                    </span>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn-primary"
                  >
                    Generate Itinerary
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Itinerary Display Section -->
        <div class="lg:col-span-2">
          <div v-if="isLoading" class="bg-white shadow sm:rounded-lg p-8 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600">{{ loadingMessage }}</p>
          </div>

          <div v-else-if="!generatedItinerary || generatedItinerary.length === 0" class="bg-white shadow sm:rounded-lg p-8 flex flex-col items-center justify-center text-center h-96">
            <div class="text-6xl mb-4">🧭</div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">Ready to explore India?</h3>
            <p class="text-gray-500 max-w-md">Fill out your preferences to generate a personalized cultural itinerary tailored to your interests.</p>
          </div>

          <div v-else>
            <div class="mt-8 flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900">Your Cultural Itinerary</h2>
              <button 
                @click="saveItineraryToProfile" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Itinerary
              </button>
            </div>

            <!-- Itinerary Days -->
            <div class="bg-white shadow sm:rounded-lg overflow-hidden">
              <!-- Day Tabs -->
              <div class="px-6 pt-4 border-b border-gray-200">
                <div class="flex overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    v-for="(day, index) in generatedItinerary" 
                    :key="index"
                    @click="activeDay = index"
                    class="px-5 py-2 text-sm font-medium mr-2 rounded-t-lg transition-colors"
                    :class="activeDay === index 
                      ? 'bg-indigo-50 text-indigo-700 border-t-2 border-l border-r border-indigo-500' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
                  >
                    Day {{ index + 1 }}
                  </button>
                </div>
              </div>

              <!-- Day Title and Travel Style Indicator -->
              <div v-if="generatedItinerary[activeDay]" class="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <h3 class="text-lg font-medium text-indigo-800">Day {{ activeDay + 1 }}: {{ formData.destination }} Exploration</h3>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="{
                      'bg-green-100 text-green-800': formData.travelStyle === 'relaxed',
                      'bg-indigo-100 text-indigo-800': formData.travelStyle === 'balanced',
                      'bg-orange-100 text-orange-800': formData.travelStyle === 'intensive'
                    }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="formData.travelStyle === 'relaxed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      <path v-else-if="formData.travelStyle === 'balanced'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {{ travelStyles.find(style => style.id === formData.travelStyle)?.name }} Pace
                  </span>
                </div>
              </div>

              <!-- Day Schedule Timeline -->
              <div v-if="generatedItinerary[activeDay]" class="px-6 py-4">
                <div class="relative">
                  <!-- Timeline line -->
                  <div class="absolute top-0 bottom-0 left-12 w-0.5 bg-indigo-100"></div>
                  
                  <!-- Time slots -->
                  <div v-for="(timeSlot, slotIndex) in generatedItinerary[activeDay].timeSlots" :key="slotIndex" 
                    class="relative mb-8">
                    <!-- Time marker -->
                    <div class="absolute left-10 top-0 -ml-3 mt-1.5 transform -translate-x-1/2">
                      <div class="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                        <span class="text-xs font-semibold text-white">{{ timeSlot.time.split(':')[0] }}</span>
                      </div>
                    </div>
                    
                    <!-- Time display -->
                    <div class="flex-shrink-0 w-24 pt-0.5">
                      <span class="text-sm font-medium text-gray-700">{{ timeSlot.time }}</span>
                    </div>
                    
                    <!-- Activity card -->
                    <div class="ml-16">
                      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition duration-200">
                        <!-- Header with title and activity type indicator -->
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="font-semibold text-gray-900 text-base">{{ timeSlot.title }}</h4>
                          <div class="flex items-center">
                            <span v-for="interest in getActivityInterests(timeSlot.title, timeSlot.description)" 
                              :key="interest.id"
                              class="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                              :class="getInterestColorClass(interest.id)">
                              {{ interest.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- Location -->
                        <div class="flex items-center text-sm text-gray-600 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ timeSlot.location }}
                        </div>
                        
                        <!-- Description -->
                        <p class="text-sm text-gray-600 mb-3">{{ timeSlot.description }}</p>
                        
                        <!-- Cultural Context -->
                        <div v-if="timeSlot.culturalContext" class="mb-3 p-2 bg-amber-50 rounded-md border border-amber-100">
                          <div class="flex items-center text-amber-800 font-medium text-xs mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cultural Context
                          </div>
                          <p class="text-xs text-amber-700">{{ timeSlot.culturalContext }}</p>
                        </div>
                        
                        <!-- Practical Info and Additional Details Accordion -->
                        <div class="border-t border-gray-100 pt-2">
                          <div class="mt-1" v-if="expandedSlots[slotIndex]">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                              <!-- Practical Information -->
                              <div class="bg-gray-50 rounded-md p-3">
                                <h5 class="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Practical Information
                                </h5>
                                <ul class="space-y-1 text-xs">
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Duration:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.duration }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Cost:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.cost }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Booking:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.bookingInfo }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Dress Code:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.dressCode }}</span>
                                  </li>
                                </ul>
                              </div>

                              <!-- Additional Details -->
                              <div class="bg-gray-50 rounded-md p-3">
                                <h5 class="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                  Additional Details
                                </h5>
                                <ul class="space-y-1 text-xs">
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Photography:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.photography }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Transport:</span>
                                    <span class="text-gray-700">{{ timeSlot.practicalInfo?.transport }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Tips:</span>
                                    <span class="text-gray-700">{{ timeSlot.tips }}</span>
                                  </li>
                                  <li class="flex items-start">
                                    <span class="font-medium text-gray-600 min-w-[80px]">Weather Plan:</span>
                                    <span class="text-gray-700">{{ timeSlot.weatherAlternatives }}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <button 
                            @click="toggleSlotExpansion(slotIndex)" 
                            class="w-full mt-1 text-xs flex items-center justify-center text-indigo-600 hover:text-indigo-800 py-1"
                          >
                            <span v-if="!expandedSlots[slotIndex]">Show Details</span>
                            <span v-else>Hide Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                class="h-4 w-4 ml-1 transition-transform duration-200" 
                                :class="{'rotate-180': expandedSlots[slotIndex]}"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Section -->
          <div v-if="generatedItinerary" class="mt-6 bg-white shadow sm:rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Itinerary Map
              </h3>
            </div>
            <div class="p-4">
              <CulturalMap :destinations="mapDestinations" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import CulturalMap from '../components/CulturalMap.vue'
import { itineraryService } from '../services/itineraryService'
import { locationService } from '../services/locationService'
import { uploadJSONToPinata } from '../utils/pinata'

const states = locationService.getStates()
const districts = ref([])

const languages = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi']

const culturalInterests = [
  { id: 'food', name: 'Culinary Arts', description: 'Local cuisine, cooking classes, and food markets' },
  { id: 'history', name: 'Historical Sites', description: 'Monuments, temples, and archaeological sites' },
  { id: 'arts', name: 'Traditional Arts', description: 'Music, dance, and visual arts' },
  { id: 'festivals', name: 'Festivals & Ceremonies', description: 'Local celebrations and traditional ceremonies' },
  { id: 'crafts', name: 'Traditional Crafts', description: 'Artisan workshops and traditional craftsmanship' },
  { id: 'spiritual', name: 'Spiritual Experiences', description: 'Temples, meditation, and yoga retreats' }
]

const travelStyles = [
  { id: 'relaxed', name: 'Relaxed' },
  { id: 'balanced', name: 'Balanced' },
  { id: 'intensive', name: 'Intensive' }
]

const formData = reactive({
  state: '',
  destination: '',
  selectedInterests: [],
  duration: 7,
  language: 'English',
  travelStyle: 'balanced'
})

const isLoading = ref(false)
const generatedItinerary = ref([])
const activeDay = ref(0)
const loadingMessage = ref('Initializing your personalized cultural itinerary...')

// Track expanded/collapsed state for each time slot
const expandedSlots = ref({});

// Toggle expansion state for a time slot
const toggleSlotExpansion = (slotIndex) => {
  expandedSlots.value[slotIndex] = !expandedSlots.value[slotIndex];
};

// Function to determine which interests apply to an activity
const getActivityInterests = (title, description) => {
  const combinedText = (title + ' ' + description).toLowerCase();
  return culturalInterests.filter(interest => {
    // Check if the user selected this interest
    if (!formData.selectedInterests.includes(interest.id)) return false;
    
    // Check if the activity matches this interest
    switch(interest.id) {
      case 'food':
        return /food|cuisine|culinary|restaurant|cooking|eat|dish|meal|taste|gastro|cook/i.test(combinedText);
      case 'history':
        return /history|historical|ancient|heritage|monument|fort|palace|archaeological|museum|ruin|temple|shrine/i.test(combinedText);
      case 'arts':
        return /art|music|dance|painting|performance|theater|concert|gallery|exhibition|show/i.test(combinedText);
      case 'festivals':
        return /festival|celebration|ceremony|ritual|event|fair|procession|traditional celebration/i.test(combinedText);
      case 'crafts':
        return /craft|artisan|handicraft|handloom|pottery|weaving|textile|handmade|traditional craft/i.test(combinedText);
      case 'spiritual':
        return /spiritual|meditation|yoga|prayer|temple|ashram|holy|sacred|ritual/i.test(combinedText);
      default:
        return false;
    }
  });
};

// Get color classes for interest tags
const getInterestColorClass = (interestId) => {
  const colorMap = {
    food: 'bg-red-100 text-red-800',
    history: 'bg-amber-100 text-amber-800',
    arts: 'bg-purple-100 text-purple-800',
    festivals: 'bg-pink-100 text-pink-800',
    crafts: 'bg-emerald-100 text-emerald-800',
    spiritual: 'bg-blue-100 text-blue-800'
  };
  
  return colorMap[interestId] || 'bg-gray-100 text-gray-800';
};

// Watch for state changes to update districts
const updateDistricts = () => {
  districts.value = locationService.getDistricts(formData.state)
  formData.destination = '' // Reset destination when state changes
}

const toggleInterest = (interestId) => {
  const index = formData.selectedInterests.indexOf(interestId)
  if (index === -1) {
    formData.selectedInterests.push(interestId)
  } else {
    formData.selectedInterests.splice(index, 1)
  }
}

async function generateItinerary() {
  if (!formData.destination || formData.selectedInterests.length === 0) {
    alert('Please select a destination and at least one interest')
    return
  }

  isLoading.value = true
  loadingMessage.value = 'Initializing your personalized cultural itinerary...'
  
  try {
    // Show progress messages
    const updateLoadingMessage = () => {
      const messages = [
        'Consulting our cultural experts...',
        'Discovering local experiences...',
        'Crafting your personalized journey...',
        'Adding cultural context and insights...',
        'Finalizing your itinerary...'
      ]
      let messageIndex = 0
      
      return setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length
        loadingMessage.value = messages[messageIndex]
      }, 3000)
    }
    
    const messageInterval = updateLoadingMessage()
    
    // Generate itinerary
    const itinerary = await itineraryService.generateItinerary(formData)
    
    // Clear the loading message interval
    clearInterval(messageInterval)
    
    // Update the itinerary
    generatedItinerary.value = itinerary
    activeDay.value = 0 // Reset to first day
    
  } catch (error) {
    console.error('Error generating itinerary:', error)
    alert('An error occurred while generating your itinerary. A basic itinerary has been created instead.')
  } finally {
    isLoading.value = false
  }
}

async function saveItineraryToProfile() {
  try {
    // Get existing saved itineraries from localStorage
    const savedItinerariesStr = localStorage.getItem('savedItineraries')
    let savedItineraries = savedItinerariesStr ? JSON.parse(savedItinerariesStr) : []

    // Create a new itinerary object
    const newItinerary = {
      id: Date.now(), // Use timestamp as unique ID
      name: `${formData.destination} Cultural Journey`,
      destination: formData.destination,
      duration: formData.duration,
      interests: formData.selectedInterests.map(id => {
        const interest = culturalInterests.find(i => i.id === id)
        return interest ? interest.name : id
      }),
      days: generatedItinerary.value.map(day => ({
        description: `Day ${day.day} in ${formData.destination}`,
        activities: day.timeSlots.map(slot => slot.title)
      })),
      notes: `Created on ${new Date().toLocaleDateString()} with ${formData.travelStyle} travel style.`,
      createdAt: new Date().toISOString()
    }

    try {
      // Upload to IPFS first
      const ipfsHash = await uploadJSONToPinata(newItinerary)
      console.log('Itinerary saved to IPFS:', ipfsHash)
      
      // Add IPFS hash to the itinerary object
      newItinerary.ipfsHash = ipfsHash
      
      // Add new itinerary to the array
      savedItineraries.push(newItinerary)

      // Save back to localStorage
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries))

      // Show success message
      alert('Itinerary saved successfully! You can view it in your profile.')
    } catch (error) {
      console.error('Error saving to IPFS:', error)
      throw new Error('Failed to save itinerary to IPFS storage')
    }
  } catch (error) {
    console.error('Error saving itinerary:', error)
    alert('Failed to save itinerary. Please try again.')
  }
}

// Map destinations with coordinates
const mapDestinations = computed(() => {
  if (!formData.destination || !formData.state) return []
  
  const coordinates = locationService.getCoordinates(formData.state, formData.destination)
  if (!coordinates) return []

  return [{
    name: formData.destination,
    coordinates: coordinates,
    description: `Your selected destination in ${formData.state}`
  }]
})
</script> 